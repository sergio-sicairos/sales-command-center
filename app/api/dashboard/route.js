// app/api/dashboard/route.js
import { soql } from "@/lib/salesforce";
import { AE_QUOTAS, DEFAULT_AE_QUOTA, SDR_MEETING_QUOTA, SDR_LEAD_SOURCES } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthStart = `${year}-${month}-01`;
    const nextMonth = now.getMonth() + 1 === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(now.getMonth() + 2).padStart(2, "0")}-01`;

    const closedWon = await soql(`
      SELECT Owner.Name, Name, Opportunity_ARR__c, CloseDate, LeadSource
      FROM Opportunity
      WHERE StageName = 'Closed Won'
        AND Type = 'New Business'
        AND CloseDate >= ${monthStart}
        AND CloseDate < ${nextMonth}
      ORDER BY Opportunity_ARR__c DESC
    `);

    const pipeline = await soql(`
      SELECT Owner.Name, Name, Opportunity_ARR__c, StageName, CloseDate
      FROM Opportunity
      WHERE Type = 'New Business'
        AND StageName NOT IN ('Closed Won', 'Closed Lost')
      ORDER BY Opportunity_ARR__c DESC
    `);

    const sdrSourceList = SDR_LEAD_SOURCES.map((s) => `'${s}'`).join(",");
    const sdrMeetings = await soql(`
      SELECT Owner.Name, Name, StageName, CreatedDate, LeadSource
      FROM Opportunity
      WHERE Type = 'New Business'
        AND LeadSource IN (${sdrSourceList})
        AND CreatedDate >= ${monthStart}T00:00:00Z
        AND CreatedDate < ${nextMonth}T00:00:00Z
      ORDER BY CreatedDate DESC
    `);

    const rosterNames = Object.keys(AE_QUOTAS);
    const rosterSet = new Set(rosterNames);
    const aeMap = {};

    for (const name of rosterNames) {
      const quota = AE_QUOTAS[name] ?? DEFAULT_AE_QUOTA;
      aeMap[name] = { name, closed: 0, deals: [], cnt: 0, pipeline: 0, pipeCnt: 0, quota, gap: quota };
    }

    for (const opp of closedWon) {
      const ownerName = opp.Owner?.Name;
      if (!ownerName || !rosterSet.has(ownerName)) continue;
      aeMap[ownerName].closed += opp.Opportunity_ARR__c || 0;
      aeMap[ownerName].cnt++;
      aeMap[ownerName].deals.push({
        name: opp.Name,
        arr: opp.Opportunity_ARR__c || 0,
        close: opp.CloseDate,
        lead: opp.LeadSource,
      });
    }

    for (const opp of pipeline) {
      const ownerName = opp.Owner?.Name;
      if (!ownerName || !rosterSet.has(ownerName)) continue;
      aeMap[ownerName].pipeline += opp.Opportunity_ARR__c || 0;
      aeMap[ownerName].pipeCnt++;
    }

    for (const ae of Object.values(aeMap)) {
      if (ae.quota === 0) {
        // $0 quota month — any revenue = 100% attainment, gap is always 0
        ae.gap = 0;
        ae.attainment = ae.closed > 0 ? 100 : 0;
      } else {
        ae.gap = Math.max(0, ae.quota - ae.closed);
        ae.attainment = Math.round((ae.closed / ae.quota) * 100);
      }
    }

    const sdrMap = {};
    for (const opp of sdrMeetings) {
      const ownerName = opp.Owner?.Name;
      if (!ownerName || !rosterSet.has(ownerName)) continue;
      if (!sdrMap[ownerName]) {
        sdrMap[ownerName] = { name: ownerName, booked: 0, pending: 0, qualified: 0, lost: 0, opps: [] };
      }
      sdrMap[ownerName].booked++;
      sdrMap[ownerName].opps.push({
        name: opp.Name,
        stage: opp.StageName,
        created: opp.CreatedDate?.slice(0, 10),
      });
      const stage = opp.StageName || "";
      if (stage.includes("Open")) sdrMap[ownerName].pending++;
      else if (stage.includes("Qualified") || stage.includes("Interested") || stage.includes("POC") || stage.includes("Negotiation"))
        sdrMap[ownerName].qualified++;
      else if (stage.includes("Lost")) sdrMap[ownerName].lost++;
    }

    const aeData = Object.values(aeMap).sort((a, b) => b.attainment - a.attainment);
    const sdrData = Object.values(sdrMap).sort((a, b) => b.booked - a.booked);

    return Response.json({
      aeData,
      sdrData,
      config: { AE_QUOTAS, SDR_MEETING_QUOTA },
      meta: {
        month: `${year}-${month}`,
        closedCount: closedWon.length,
        pipelineCount: pipeline.length,
        sdrCount: sdrMeetings.length,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
