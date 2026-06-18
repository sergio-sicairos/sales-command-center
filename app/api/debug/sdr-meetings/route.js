import { soql } from "@/lib/salesforce";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sdrName = searchParams.get("name") || "Izzy Weiss";

    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthStart = `${year}-${month}-01`;
    const monthNum = parseInt(month);
    const nextMonth = monthNum === 12
      ? `${year + 1}-01-01`
      : `${year}-${String(monthNum + 1).padStart(2, "0")}-01`;

    // Get all opportunities attributed to this SDR
    const allOpps = await soql(`
      SELECT Owner.Name, Name, StageName, CreatedDate, LeadSource, SDR_Points__c,
             SDR_Meeting_Qualified_by_AE__c, SDR_Meeting_Qualified_Date__c,
             Manual_Override_SDR_Attributable__c, Manual_Override_SDR_Attributable__r.Name
      FROM Opportunity
      WHERE Type = 'New Business'
        AND (Owner.Name = '${sdrName}' OR Manual_Override_SDR_Attributable__r.Name = '${sdrName}')
      ORDER BY CreatedDate DESC
    `);

    // Get qualified meetings in current month
    const qualifiedThisMonth = await soql(`
      SELECT Owner.Name, Name, StageName, CreatedDate, LeadSource, SDR_Points__c,
             SDR_Meeting_Qualified_by_AE__c, SDR_Meeting_Qualified_Date__c,
             Manual_Override_SDR_Attributable__c, Manual_Override_SDR_Attributable__r.Name
      FROM Opportunity
      WHERE Type = 'New Business'
        AND SDR_Meeting_Qualified_by_AE__c = true
        AND SDR_Meeting_Qualified_Date__c >= ${monthStart}
        AND SDR_Meeting_Qualified_Date__c < ${nextMonth}
        AND (Owner.Name = '${sdrName}' OR Manual_Override_SDR_Attributable__r.Name = '${sdrName}')
      ORDER BY SDR_Meeting_Qualified_Date__c DESC
    `);

    return Response.json({
      sdrName,
      period: `${year}-${month}`,
      monthStart,
      nextMonth,
      allOppsCount: allOpps.length,
      allOpps: allOpps.map(o => ({
        name: o.Name,
        owner: o.Owner?.Name,
        stage: o.StageName,
        createdDate: o.CreatedDate,
        qualified: o.SDR_Meeting_Qualified_by_AE__c,
        qualifiedDate: o.SDR_Meeting_Qualified_Date__c,
        points: o.SDR_Points__c,
        attributedTo: o.Manual_Override_SDR_Attributable__r?.Name || o.Manual_Override_SDR_Attributable__c,
      })),
      qualifiedThisMonthCount: qualifiedThisMonth.length,
      qualifiedThisMonth: qualifiedThisMonth.map(o => ({
        name: o.Name,
        owner: o.Owner?.Name,
        points: o.SDR_Points__c,
        qualifiedDate: o.SDR_Meeting_Qualified_Date__c,
      })),
    });
  } catch (err) {
    console.error("Debug API error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
