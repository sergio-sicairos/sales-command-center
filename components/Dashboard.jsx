"use client";
import { useState, useEffect, useCallback } from "react";

const fmt = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${Math.round(n)}`);
const fmtF = (n) => `$${Math.round(n).toLocaleString()}`;
const ini = (n) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const AVATARS = {
  "Josh Jossart": "/avatars/josh-jossart.jpg",
  "Devin McLaughlin": "/avatars/devin-mclaughlin.jpg",
  "Noah Post-Hyatt": "/avatars/noah-post-hyatt.jpg",
  "Alyssa Knight": "/avatars/alyssa-knight.jpg",
  "John White": "/avatars/john-white.jpg",
  "Agustin Yanez": "/avatars/agustin-yanez.png",
  "Sergio Sicairos": "/avatars/sergio-sicairos.png",
  "Nano Schmidt": "/avatars/nano-schmidt.png",
  "Jenni Lee": "/avatars/jenni-lee.png",
  "Swasthi Malladi": "/avatars/swasthi-malladi.png",
  "Meghan Ministri": "/avatars/meghan-ministri.jpg",
  "James Rheaume": "/avatars/james-rheaume.jpg",
  "Blanchard Kenfack": "/avatars/blanchard-kenfack.jpg",
  "Nate Siebert": "/avatars/nate-siebert.jpg",
};

function Avatar({ name, size = 42 }) {
  const [failed, setFailed] = useState(false);
  const url = AVATARS[name];
  if (!url || failed) {
    return <div style={{ width: size, height: size, borderRadius: 10, background: "#e2e8f0", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: Math.round(size * 0.26), fontWeight: 700, letterSpacing: 0.5, fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}>{ini(name)}</div>;
  }
  return <img src={url} alt={name} width={size} height={size} onError={() => setFailed(true)} style={{ width: size, height: size, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />;
}

function StatusPill({ status, compact = false }) {
  const c = {
    hit: { bg: "#dcfce7", border: "#bbf7d0", color: "#16a34a", label: "Hit Quota ✓" },
    above: { bg: "#fef9c3", border: "#fef08a", color: "#a16207", label: "On Pace" },
    on: { bg: "#fef9c3", border: "#fef08a", color: "#a16207", label: "Tracking" },
    behind: { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Behind" },
    surplus: { bg: "#dcfce7", border: "#bbf7d0", color: "#16a34a", label: "Hit Quota ✓" },
    neutral: { bg: "#f1f5f9", border: "#e2e8f0", color: "#94a3b8", label: "No Quota" },
  }[status] || { bg: "#fef2f2", border: "#fecaca", color: "#dc2626", label: "Behind" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: compact ? 4 : 6, padding: compact ? "3px 10px" : "5px 14px", borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, fontSize: compact ? 10 : 12, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>
      <span style={{ width: compact ? 5 : 6, height: compact ? 5 : 6, borderRadius: "50%", background: c.color }} />{c.label}
    </span>
  );
}

function Bar({ value, max, color, h = 4 }) {
  const w = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ width: "100%", height: h, borderRadius: h, background: "#e2e8f0", overflow: "hidden", marginTop: 4 }}>
      <div style={{ width: `${w}%`, height: "100%", borderRadius: h, background: color, transition: "width 0.8s ease" }} />
    </div>
  );
}

export default function Dashboard() {
  const [tab, setTab] = useState("ae");
  const [viewMode, setViewMode] = useState("table");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [expanded, setExpanded] = useState(null);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const now = new Date();
  const MN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const cm = MN[now.getMonth()], cy = now.getFullYear();
  const dim = new Date(cy, now.getMonth() + 1, 0).getDate(), dom = now.getDate(), pace = dom / dim;

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`${res.status}`);
      setData(await res.json());
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const getStatus = (v, q) => {
    if (q === 0) return v > 0 ? "surplus" : "neutral";
    if (v >= q) return "hit";
    if (v / q >= pace) return "above";
    if (v / q >= pace * 0.7) return "on";
    return "behind";
  };

  const attColor = (p) => {
    if (p >= 75) return "#16a34a";
    if (p >= 50) return "#eab308";
    if (p >= 25) return "#ea580c";
    return "#dc2626";
  };

  const aeData = data?.aeData || [];
  const sdrData = data?.sdrData || [];
  const SDR_QUOTA = data?.config?.SDR_MEETING_QUOTA || 20;
  const TEAM_GOAL = data?.config?.TEAM_GOAL || 1900000;
  const meta = data?.meta || {};
  const tClosed = aeData.reduce((s, a) => s + a.closed, 0);
  const tDeals = aeData.reduce((s, a) => s + a.cnt, 0);
  const tQuota = aeData.reduce((s, a) => s + (a.quota || 0), 0);
  const tGap = aeData.reduce((s, a) => s + (a.gap || 0), 0);
  const quotaAEs = aeData.filter((a) => a.quota > 0).length;
  const qHitters = aeData.filter((a) => a.quota > 0 && a.closed >= a.quota).length;
  const teamAtt = TEAM_GOAL > 0 ? Math.round((tClosed / TEAM_GOAL) * 100) : 0;
  const teamGap = Math.max(0, TEAM_GOAL - tClosed);
  const teamPaceAmt = Math.round(TEAM_GOAL * pace);
  const teamPaceDiff = tClosed - teamPaceAmt;
  const teamBarColor = tClosed >= TEAM_GOAL ? "#16a34a" : tClosed / TEAM_GOAL >= pace ? "#3b82f6" : tClosed / TEAM_GOAL >= pace * 0.8 ? "#eab308" : "#dc2626";
  const tBookings = sdrData.reduce((s, a) => s + a.booked, 0);
  const tPending = sdrData.reduce((s, a) => s + a.pending, 0);
  const tQualified = sdrData.reduce((s, a) => s + a.qualified, 0);

  const isTV = viewMode === "tv";

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dc { max-width: ${isTV ? "100%" : "1400px"}; margin: 0 auto; padding: ${isTV ? "20px 28px" : "32px 40px"}; }
        .hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: ${isTV ? "16px" : "28px"}; flex-wrap: wrap; gap: 12px; }
        .hdr h1 { font-size: ${isTV ? "18px" : "22px"}; font-weight: 700; color: #0f172a; letter-spacing: -0.3px; }
        .hdr .sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }
        .live { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; border-radius: 16px; background: #f0fdf4; border: 1px solid #bbf7d0; font-size: 12px; color: #16a34a; }
        .ld { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; animation: lp 2s ease-in-out infinite; }
        @keyframes lp { 0%,100%{opacity:1} 50%{opacity:.4} }
        .rb { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 5px 12px; color: #64748b; font-size: 12px; cursor: pointer; font-family: inherit; }
        .rb:hover { background: #f8fafc; border-color: #cbd5e1; color: #334155; }
        .rb:disabled { opacity: 0.3; }
        .rb.active { background: #0f172a; color: #fff; border-color: #0f172a; }

        .kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: ${isTV ? "10px" : "16px"}; margin-bottom: ${isTV ? "16px" : "28px"}; }
        .kpi { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: ${isTV ? "12px 16px" : "20px"}; }
        .kpi-label { font-size: ${isTV ? "9px" : "11px"}; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: ${isTV ? "4px" : "8px"}; }
        .kpi-val { font-size: ${isTV ? "20px" : "28px"}; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; }
        .kpi-sub { font-size: ${isTV ? "10px" : "11px"}; color: #94a3b8; margin-top: 2px; }

        .tabs { display: flex; gap: 2px; padding: 3px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px; width: fit-content; }
        .tb { padding: 8px 20px; border-radius: 8px; border: none; background: transparent; color: #94a3b8; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .tb.on { background: #fff; color: #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

        .card { background: #fff; border: 1px solid #e2e8f0; border-radius: 14px; overflow: hidden; }
        .card-hdr { padding: 14px 24px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: #94a3b8; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; }

        .ae-hdr, .ae-row { display: table; width: 100%; table-layout: fixed; padding: 0; }
        .ae-hdr > *, .ae-row > * { display: table-cell; vertical-align: middle; padding: 12px 16px; }
        .ae-hdr > *:first-child, .ae-row > *:first-child { padding-left: 28px; width: 28%; }
        .ae-hdr > *:nth-child(2) { width: 22%; text-align: center; }
        .ae-row > *:nth-child(2) { width: 22%; text-align: left; }
        .ae-hdr > *:nth-child(3), .ae-row > *:nth-child(3) { width: 14%; text-align: right; }
        .ae-hdr > *:nth-child(4), .ae-row > *:nth-child(4) { width: 14%; text-align: right; }
        .ae-hdr > *:last-child, .ae-row > *:last-child { width: 18%; text-align: right; padding-right: 28px; }

        .sdr-hdr, .sdr-row { display: table; width: 100%; table-layout: fixed; padding: 0; }
        .sdr-hdr > *, .sdr-row > * { display: table-cell; vertical-align: middle; padding: 12px 16px; }
        .sdr-hdr > *:first-child, .sdr-row > *:first-child { padding-left: 28px; width: 24%; }
        .sdr-hdr > *:nth-child(2), .sdr-row > *:nth-child(2) { width: 10%; text-align: right; }
        .sdr-hdr > *:nth-child(3), .sdr-row > *:nth-child(3) { width: 10%; text-align: right; }
        .sdr-hdr > *:nth-child(4), .sdr-row > *:nth-child(4) { width: 12%; text-align: right; }
        .sdr-hdr > *:nth-child(5), .sdr-row > *:nth-child(5) { width: 10%; text-align: right; }
        .sdr-hdr > *:last-child, .sdr-row > *:last-child { width: 18%; text-align: right; padding-right: 28px; }

        .col-hdr { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; border-bottom: 1px solid #f1f5f9; }
        .row-wrap { border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.1s; }
        .row-wrap:hover { background: #f8fafc; }
        .row-inner { }

        .rank { font-size: 14px; font-weight: 700; color: #cbd5e1; min-width: 20px; }
        .name-cell { display: flex; align-items: center; gap: 12px; }
        .name-primary { font-size: 14px; font-weight: 600; color: #0f172a; }
        .name-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; }
        .val { font-size: 15px; font-weight: 700; color: #0f172a; }
        .val-muted { font-size: 13px; color: #94a3b8; }
        .att-val { font-size: 15px; font-weight: 700; }
        .gap-hit { color: #16a34a; font-weight: 700; font-size: 13px; }
        .gap-miss { color: #dc2626; font-weight: 700; font-size: 13px; }

        .expand-panel { padding: 10px 24px 14px 80px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .deal-chip { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 8px; background: #fff; border: 1px solid #e2e8f0; font-size: 12px; color: #64748b; margin: 3px 4px 3px 0; }
        .deal-amt { color: #16a34a; font-weight: 600; }

        .footer { display: flex; justify-content: space-between; align-items: center; padding: 14px 24px; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
        .foot-bar { width: 180px; height: 3px; border-radius: 2px; background: #e2e8f0; overflow: hidden; }
        .foot-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, #16a34a, #3b82f6); }

        .loader { padding: 80px 0; text-align: center; }
        .spinner { display: inline-block; width: 24px; height: 24px; border: 2px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: sp 0.7s linear infinite; }
        @keyframes sp { to { transform: rotate(360deg); } }
        .src { margin-top: 16px; font-size: 10px; color: #cbd5e1; padding: 10px 0; }
        .pacing-badge { font-size: 12px; font-weight: 600; }
        .stage-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px; }

        /* TV CARD GRID */
        .tv-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .tv-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; position: relative; }
        .tv-card:hover { border-color: #cbd5e1; }
        .tv-rank { position: absolute; top: 8px; right: 12px; font-size: 12px; font-weight: 700; color: #cbd5e1; }
        .tv-top { display: flex; align-items: center; gap: 10px; }
        .tv-name { font-size: 15px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tv-deals { font-size: 10px; color: #94a3b8; margin-top: 1px; }
        .tv-arr { display: flex; align-items: baseline; gap: 4px; }
        .tv-arr-val { font-size: 15px; font-weight: 700; color: #0f172a; }
        .tv-arr-of { font-size: 11px; color: #94a3b8; }
        .tv-stats { display: flex; justify-content: space-between; align-items: center; }
        .tv-att { font-size: 14px; font-weight: 700; }
        .tv-gap { font-size: 12px; font-weight: 600; }
        .tv-footer { display: flex; justify-content: center; margin-top: 2px; }

        /* TV Team Summary Card */
        .tv-summary { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 6px; color: #f1f5f9; }
        .tv-summary-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
        .tv-summary-val { font-size: 14px; font-weight: 700; color: #f1f5f9; }
        .tv-summary-sub { font-size: 10px; color: #475569; }

        @media (max-width: 800px) { .kpi-row { grid-template-columns: 1fr 1fr; } .dc { padding: 20px 16px; } .tv-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="dc">
        {/* HEADER */}
        <div className="hdr">
          <div>
            <h1>AE Performance — {cm} {cy}</h1>
            <div className="sub">Day {dom} of {dim} · {Math.round(pace * 100)}% through month</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className={`rb ${isTV ? "active" : ""}`} onClick={() => setViewMode(isTV ? "table" : "tv")}>{isTV ? "◧ Table View" : "▦ TV Mode"}</button>
            <button className="rb" onClick={load} disabled={loading}>{loading ? "Loading…" : "↻ Refresh"}</button>
            <div className="live"><div className="ld" />{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-row">
          <div className="kpi"><div className="kpi-label">Team Closed ARR</div><div className="kpi-val">{fmtF(tClosed)}</div><div className="kpi-sub">{tDeals} deals</div></div>
          <div className="kpi"><div className="kpi-label">Monthly Goal</div><div className="kpi-val">{fmtF(TEAM_GOAL)}</div><div className="kpi-sub">{quotaAEs} active quotas</div></div>
          <div className="kpi"><div className="kpi-label">Gap Remaining</div><div className="kpi-val" style={{ color: tClosed >= TEAM_GOAL ? "#16a34a" : "#dc2626" }}>{fmtF(Math.max(0, TEAM_GOAL - tClosed))}</div><div className="kpi-sub">{qHitters}/{quotaAEs} at quota</div></div>
          <div className="kpi"><div className="kpi-label">SDR Meetings</div><div className="kpi-val">{tBookings}</div><div className="kpi-sub">{tPending} pending · {tQualified} qual'd</div></div>
        </div>

        {/* ===== TEAM GOAL BAR ===== */}
        {!loading && !error && data && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, padding: isTV ? "18px 24px" : "26px 32px", marginBottom: isTV ? 16 : 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, color: "#94a3b8", marginBottom: 8 }}>Monthly Team Goal — {cm} {cy}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: isTV ? 26 : 36, fontWeight: 700, color: "#0f172a", letterSpacing: -1, fontFamily: "'DM Sans',sans-serif" }}>{fmtF(tClosed)}</span>
                  <span style={{ fontSize: isTV ? 13 : 17, color: "#94a3b8", fontWeight: 500 }}>of {fmtF(TEAM_GOAL)}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: isTV ? 20 : 32, alignItems: "flex-start" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isTV ? 24 : 32, fontWeight: 700, color: teamBarColor, letterSpacing: -0.5 }}>{teamAtt}%</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Attainment</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isTV ? 24 : 32, fontWeight: 700, color: teamGap === 0 ? "#16a34a" : "#dc2626", letterSpacing: -0.5 }}>{teamGap === 0 ? "Done!" : `-${fmtF(teamGap)}`}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Gap</div>
                </div>
              </div>
            </div>
            {/* Progress bar with pace marker */}
            <div style={{ position: "relative", width: "100%", height: 10, borderRadius: 5, background: "#fef3c7", marginBottom: 14 }}>
              <div style={{ width: `${Math.min(teamAtt, 100)}%`, height: "100%", borderRadius: 5, background: teamBarColor, transition: "width 0.8s ease" }} />
              <div style={{ position: "absolute", top: -4, left: `${Math.min(pace * 100, 100)}%`, transform: "translateX(-50%)", width: 2, height: 18, background: "#cbd5e1", borderRadius: 1 }} title="Month pace" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 24 }}>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Pace </span><span style={{ fontSize: 13, fontWeight: 600, color: teamPaceDiff >= 0 ? "#16a34a" : "#dc2626" }}>{teamPaceDiff >= 0 ? `+${fmtF(teamPaceDiff)}` : `-${fmtF(Math.abs(teamPaceDiff))}`}</span></div>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Expected </span><span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{fmtF(teamPaceAmt)}</span></div>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>At Quota </span><span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{qHitters}/{quotaAEs} reps</span></div>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>Day {dom} / {dim} · {Math.round(pace * 100)}% through month</div>
            </div>
          </div>
        )}

        {loading && !data ? (
          <div className="card"><div className="loader"><div className="spinner" /><div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>Querying Salesforce…</div></div></div>
        ) : error ? (
          <div className="card"><div className="loader"><div style={{ color: "#dc2626", fontSize: 13 }}>Error: {error}</div><button className="rb" onClick={load} style={{ marginTop: 12 }}>Retry</button></div></div>
        ) : isTV ? (
          /* ============ TV CARD GRID ============ */
          <div className="tv-grid">
            {aeData.map((ae, i) => {
              const q = ae.quota || 0;
              const att = ae.attainment != null ? ae.attainment : (q > 0 ? Math.round((ae.closed / q) * 100) : (ae.closed > 0 ? 100 : 0));
              const st = getStatus(ae.closed, q);
              const bc = attColor(att);
              const gapVal = ae.gap || 0;
              return (
                <div className="tv-card" key={ae.name}>
                  <span className="tv-rank">#{i + 1}</span>
                  <div className="tv-top">
                    <Avatar name={ae.name} size={56} />
                    <div style={{ overflow: "hidden" }}>
                      <div className="tv-name">{ae.name}</div>
                      <div className="tv-deals">{ae.cnt} deal{ae.cnt !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <div className="tv-arr">
                    <span className="tv-arr-val">{fmtF(Math.round(ae.closed))}</span>
                    <span className="tv-arr-of">of {q > 0 ? fmt(q) : "$0"}</span>
                  </div>
                  <Bar value={ae.closed} max={q || ae.closed || 1} color={bc} h={5} />
                  <div className="tv-stats">
                    <span className="tv-att" style={{ color: bc }}>{att}%</span>
                    <span className="tv-gap" style={{ color: gapVal === 0 ? "#16a34a" : "#dc2626" }}>{gapVal === 0 ? "$0 gap" : `-${fmt(gapVal)}`}</span>
                  </div>
                  <div className="tv-footer"><StatusPill status={st} compact /></div>
                </div>
              );
            })}
            {/* Team Summary Card */}
            <div className="tv-summary">
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Team Total</div>
              <div><div className="tv-summary-label">Closed</div><div className="tv-summary-val">{fmtF(tClosed)}</div></div>
              <div><div className="tv-summary-label">Goal</div><div className="tv-summary-val">{fmtF(TEAM_GOAL)}</div></div>
              <div><div className="tv-summary-label">Gap</div><div className="tv-summary-val" style={{ color: tClosed >= TEAM_GOAL ? "#34d399" : "#f87171" }}>{fmtF(Math.max(0, TEAM_GOAL - tClosed))}</div></div>
              <div><div className="tv-summary-label">Attainment</div><div className="tv-summary-val">{Math.round(tClosed / TEAM_GOAL * 100)}%</div></div>
              <div><div className="tv-summary-label">At Quota</div><div className="tv-summary-val">{qHitters}/{quotaAEs}</div></div>
              <div style={{ marginTop: 4 }}>
                <div className="tv-summary-label">Month Progress</div>
                <div style={{ width: "100%", height: 4, borderRadius: 2, background: "#1e293b", overflow: "hidden", marginTop: 4 }}>
                  <div style={{ width: `${Math.round(pace * 100)}%`, height: "100%", borderRadius: 2, background: "linear-gradient(90deg, #34d399, #60a5fa)" }} />
                </div>
                <div className="tv-summary-sub" style={{ marginTop: 3 }}>Day {dom}/{dim} · {Math.round(pace * 100)}%</div>
              </div>
            </div>
          </div>
        ) : (
          /* ============ TABLE VIEW ============ */
          <>
            <div className="tabs">
              <button className={`tb ${tab === "ae" ? "on" : ""}`} onClick={() => { setTab("ae"); setExpanded(null); }}>Account Executives</button>
              <button className={`tb ${tab === "sdr" ? "on" : ""}`} onClick={() => { setTab("sdr"); setExpanded(null); }}>SDR Activity</button>
            </div>

            {tab === "ae" ? (
              <div className="card">
                <div className="card-hdr"><span>Individual Performance</span>{meta.fetchedAt && <span>{new Date(meta.fetchedAt).toLocaleTimeString()} · {meta.closedCount} records</span>}</div>
                <div className="ae-hdr">
                  <div className="col-hdr">Account Executive</div><div className="col-hdr">ARR Closed</div><div className="col-hdr">Attainment</div><div className="col-hdr">Gap to Goal</div><div className="col-hdr">Status</div>
                </div>
                {aeData.map((ae, i) => {
                  const q = ae.quota || 0;
                  const att = ae.attainment != null ? ae.attainment : (q > 0 ? Math.round((ae.closed / q) * 100) : (ae.closed > 0 ? 100 : 0));
                  const st = getStatus(ae.closed, q);
                  const bc = attColor(att);
                  const gapVal = ae.gap || 0;
                  const ex = expanded === `ae-${i}`;
                  return (
                    <div key={ae.name}>
                      <div className="row-wrap" onClick={() => setExpanded(ex ? null : `ae-${i}`)}>
                        <div className="ae-row row-inner">
                          <div className="name-cell">
                            <span className="rank">{i + 1}</span>
                            <Avatar name={ae.name} />
                            <div><div className="name-primary" style={{ whiteSpace: "nowrap" }}>{ae.name}</div><div className="name-sub">{ae.cnt} deal{ae.cnt !== 1 ? "s" : ""}</div></div>
                          </div>
                          <div><div style={{ display: "flex", alignItems: "baseline", gap: 5 }}><span className="val">{fmtF(Math.round(ae.closed))}</span><span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 400 }}>of {q > 0 ? fmt(q) : "$0"}</span></div><Bar value={ae.closed} max={q || ae.closed || 1} color={bc} /></div>
                          <div><span className="att-val" style={{ color: bc }}>{att}%</span></div>
                          <div>{gapVal === 0 ? <span className="gap-hit">$0</span> : <span className="gap-miss">-{fmt(gapVal)}</span>}</div>
                          <div><StatusPill status={st} /></div>
                        </div>
                      </div>
                      {ex && ae.deals?.length > 0 && (
                        <div className="expand-panel">
                          {ae.deals.sort((a, b) => b.arr - a.arr).map((d, j) => (
                            <span key={j} className="deal-chip">{d.name.length > 28 ? d.name.slice(0, 28) + "…" : d.name}<span className="deal-amt">{fmt(d.arr)}</span></span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="footer"><span>Month Progress: Day {dom}/{dim}</span><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div className="foot-bar"><div className="foot-fill" style={{ width: `${Math.round(pace * 100)}%` }} /></div><span>{Math.round(pace * 100)}%</span></div></div>
              </div>
            ) : (
              <div className="card">
                <div className="card-hdr"><span>SDR Outbound · Meetings Booked This Month</span>{meta.fetchedAt && <span>{new Date(meta.fetchedAt).toLocaleTimeString()}</span>}</div>
                <div className="sdr-hdr">
                  <div className="col-hdr">Assigned AE</div><div className="col-hdr">Booked</div><div className="col-hdr">Pending</div><div className="col-hdr">Qualified</div><div className="col-hdr">Pacing</div><div className="col-hdr">Status</div>
                </div>
                {sdrData.map((s, i) => {
                  const att = Math.round((s.booked / SDR_QUOTA) * 100);
                  const st = getStatus(s.booked, SDR_QUOTA);
                  const expected = Math.round(SDR_QUOTA * pace);
                  const diff = s.booked - expected;
                  const ex = expanded === `sdr-${i}`;
                  return (
                    <div key={s.name}>
                      <div className="row-wrap" onClick={() => setExpanded(ex ? null : `sdr-${i}`)}>
                        <div className="sdr-row row-inner">
                          <div className="name-cell"><span className="rank">{i + 1}</span><Avatar name={s.name} /><div><div className="name-primary">{s.name}</div><div className="name-sub">{s.booked}/{SDR_QUOTA} target</div></div></div>
                          <div><span className="val">{s.booked}</span></div>
                          <div><span className="val-muted">{s.pending}</span></div>
                          <div><span className="val">{s.qualified}</span></div>
                          <div><span className="pacing-badge" style={{ color: diff >= 0 ? "#16a34a" : "#dc2626" }}>{diff >= 0 ? `+${diff}` : diff}</span></div>
                          <div><StatusPill status={st} /></div>
                        </div>
                      </div>
                      {ex && s.opps?.length > 0 && (
                        <div className="expand-panel">
                          {s.opps.sort((a, b) => (a.stage || "").localeCompare(b.stage || "")).map((o, j) => {
                            const sc = (o.stage || "").includes("Open") ? "#3b82f6" : (o.stage || "").includes("Qualified") || (o.stage || "").includes("Interested") ? "#16a34a" : (o.stage || "").includes("Lost") ? "#dc2626" : "#94a3b8";
                            return <span key={j} className="deal-chip"><span className="stage-dot" style={{ background: sc }} />{(o.name || "").length > 26 ? o.name.slice(0, 26) + "…" : o.name}</span>;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="footer"><span>Month: Day {dom}/{dim} · SDR Quota: {SDR_QUOTA}/mo</span><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div className="foot-bar"><div className="foot-fill" style={{ width: `${Math.round(pace * 100)}%` }} /></div><span>{Math.round(pace * 100)}%</span></div></div>
              </div>
            )}
          </>
        )}
        <div className="src">Source: Salesforce REST API · Opportunity_ARR__c · CloseDate in {cm} {cy}</div>
      </div>
    </div>
  );
}
