"use client";
import { useState, useEffect, useCallback } from "react";

const fmt = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}K` : `$${Math.round(n)}`);
const fmtF = (n) => `$${Math.round(n).toLocaleString()}`;
const fmtPts = (n) => Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(1)).toString();
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
  "James Rheaume": "/avatars/james-rheaume.jpg",
  "Nate Siebert": "/avatars/nate-siebert.jpg",
  "Elias Ramirez": "/avatars/elias-ramirez.png",
  // SDRs
  "Dan Malkary": "/avatars/dan-malkary.jpg",
  "Julia McCullough": "/avatars/julia-mccullough.jpg",
  "James Krepelka": "/avatars/james-krepelka.jpg",
  "Solomon Bandy": "/avatars/solomon-bandy.jpg",
  "Chris Voith": "/avatars/chris-voith.jpg",
  "Colby Keces": "/avatars/colby-keces.jpg",
  "Jack Dudzik": "/avatars/jack-dudzik.jpg",
  "Austin Kuo": "/avatars/austin-kuo.jpg",
  "Ross DeRose": "/avatars/ross-derose.jpg",
  "Luke Singer": "/avatars/luke-singer.jpg",
  "Matthew Hafizi": "/avatars/matthew-hafizi.jpg",
  "Jesse Mon": "/avatars/jesse-mon.jpg",
  "London Vidaurri": "/avatars/london-vidaurri.jpg",
  "Marianna Manolioudaki": "/avatars/marianna-manolioudaki.jpeg",
  "Jaden Welborn": "/avatars/jaden-welborn.jpeg",
  "Jack Skerlj": "/avatars/jack-skerlj.jpeg",
  "Wossen Gedib": "/avatars/wossen-gedib.jpeg",
  "Donovan Swan": "/avatars/donovan-swan.jpeg",
  "Tyler Parod": "/avatars/tyler-parod.jpeg",
  "Izzy Weiss": "/avatars/isabel-weiss.jpeg",
  "Shwetha Rajmohan": "/avatars/shwetha-rajmohan.png",
};

const QUOTES = [
  { text: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.", author: "Rocky Balboa" },
  { text: "Going one more round when you don't think you can — that's what makes all the difference in your life.", author: "Rocky Balboa" },
  { text: "If you had one shot, or one opportunity, to seize everything you ever wanted, would you capture it or just let it slip?", author: "Eminem, 8 Mile" },
  { text: "Whatever it takes.", author: "Steve Rogers, Avengers: Endgame" },
  { text: "Failure is not an option.", author: "Gene Kranz, Apollo 13" },
  { text: "You got a dream, you gotta protect it.", author: "Chris Gardner, The Pursuit of Happyness" },
  { text: "Don't ever let somebody tell you you can't do something.", author: "Chris Gardner, The Pursuit of Happyness" },
  { text: "What we do in life echoes in eternity.", author: "Maximus, Gladiator" },
  { text: "Strength and honor.", author: "Maximus, Gladiator" },
  { text: "I'm gonna go out there and take what's mine.", author: "Ren McCormack, Footloose" },
  { text: "Winners don't quit. Quitters don't win.", author: "Remember the Titans" },
  { text: "The only true failure is giving up.", author: "Remember the Titans" },
  { text: "You got it within you. I know you do.", author: "Coach Herman Boone, Remember the Titans" },
  { text: "You're the best around. Nothing's gonna ever keep you down.", author: "Joe Esposito, The Karate Kid" },
  { text: "Sweep the leg.", author: "Sensei Kreese, The Karate Kid" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky, Youngblood" },
  { text: "Show me the money!", author: "Rod Tidwell, Jerry Maguire" },
  { text: "Help me help you.", author: "Jerry Maguire" },
  { text: "You complete me.", author: "Jerry Maguire" },
  { text: "Carpe diem. Seize the day.", author: "John Keating, Dead Poets Society" },
  { text: "Do or do not. There is no try.", author: "Yoda, The Empire Strikes Back" },
  { text: "If you put your mind to it, you can accomplish anything.", author: "Marty McFly, Back to the Future" },
  { text: "I'll be back.", author: "The Terminator" },
  { text: "The real question is how hard do you want to work?", author: "Whiplash" },
  { text: "Greatness is not a function of circumstance. Greatness is largely a matter of conscious choice.", author: "Good to Great" },
  { text: "A champion keeps moving forward.", author: "Cinderella Story" },
  { text: "Just keep building.", author: "The Pursuit of Happyness" },
  { text: "Champions aren't made in the gyms. Champions are made from something they have deep inside them.", author: "Rocky" },
  { text: "The greatest thing you'll ever learn is just to love and be loved in return.", author: "Moulin Rouge!" },
  { text: "Impossible is nothing.", author: "Adidas" },
];

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
    above: { bg: "#dcfce7", border: "#bbf7d0", color: "#16a34a", label: "On Pace" },
    on: { bg: "#fef9c3", border: "#fef08a", color: "#a16207", label: "Tracking" },
    behind: { bg: "#fed7aa", border: "#fdba74", color: "#ea580c", label: "Behind" },
    surplus: { bg: "#dcfce7", border: "#bbf7d0", color: "#16a34a", label: "Hit Quota ✓" },
    neutral: { bg: "#f1f5f9", border: "#e2e8f0", color: "#94a3b8", label: "No Quota" },
  }[status] || { bg: "#fed7aa", border: "#fdba74", color: "#ea580c", label: "Behind" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: compact ? 4 : 6, padding: compact ? "3px 10px" : "5px 14px", borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, fontSize: compact ? 10 : 12, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>
      <span style={{ width: compact ? 5 : 6, height: compact ? 5 : 6, borderRadius: "50%", background: c.color }} />{c.label}
    </span>
  );
}

function Donut({ percent, size = 110, strokeWidth = 11, color = "#0891b2", trackColor = "#e0f2fe", centerColor = "#0f172a" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(percent, 100));
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <span style={{ fontSize: Math.round(size * 0.24), fontWeight: 700, color: centerColor, lineHeight: 1, letterSpacing: -0.5, textShadow: centerColor === "#fff" ? "0 1px 4px rgba(0,0,0,0.5)" : "none" }}>{Math.round(percent)}%</span>
      </div>
    </div>
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
  const [viewMode] = useState("tv");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [expanded, setExpanded] = useState(null);
  const [tvScale, setTvScale] = useState(1);
  const [loopMode, setLoopMode] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const [aePageIndex, setAEPageIndex] = useState(0);
  const [sdrPageIndex, setSdrPageIndex] = useState(0);

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const compute = () => {
      if (viewMode !== "tv") { setTvScale(1); return; }
      setTvScale(Math.min(window.innerWidth / 1440, window.innerHeight / 1020));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [viewMode]);

  const now = new Date();
  const MN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const selectedDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const cm = MN[selectedDate.getMonth()], cy = selectedDate.getFullYear();
  const dim = new Date(cy, selectedDate.getMonth() + 1, 0).getDate();
  const dom = monthOffset === 0 ? now.getDate() : dim;
  const pace = monthOffset === 0 ? dom / dim : 1;
  const selectedMonthParam = `${cy}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`;

  // Calculate quarter info
  const currentMonth = selectedDate.getMonth() + 1; // 1-12
  const currentQuarter = Math.ceil(currentMonth / 3);
  const quarterName = `Q${currentQuarter}`;
  const quarterStartMonth = (currentQuarter - 1) * 3 + 1;
  const quarterEndMonth = currentQuarter * 3;
  const quarterStartDate = new Date(cy, quarterStartMonth - 1, 1);
  const quarterEndDate = new Date(cy, quarterEndMonth, 0);
  const daysInQuarter = Math.ceil((quarterEndDate - quarterStartDate) / (1000 * 60 * 60 * 24)) + 1;
  const currentDayOfQuarter = monthOffset === 0 ? Math.ceil((now - quarterStartDate) / (1000 * 60 * 60 * 24)) + 1 : daysInQuarter;
  const quarterPace = monthOffset === 0 ? currentDayOfQuarter / daysInQuarter : 1;

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/dashboard?month=${selectedMonthParam}`);
      if (!res.ok) throw new Error(`${res.status}`);
      setData(await res.json());
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, [selectedMonthParam]);
  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!loopMode) return;
    let elapsedTime = 0;
    const interval = setInterval(() => {
      elapsedTime += 30000; // Check every 30 seconds
      const cycleTime = elapsedTime % 120000; // 120s cycle: 30s AE page 1 + 30s AE page 2 + 30s SDR page 1 + 30s SDR page 2

      if (cycleTime < 30000) { // AE page 1 for 30s
        setTab("ae");
        setAEPageIndex(0);
      } else if (cycleTime < 60000) { // AE page 2 for 30s
        setTab("ae");
        setAEPageIndex(1);
      } else if (cycleTime < 90000) { // SDR page 1 for 30s
        setTab("sdr");
        setSdrPageIndex(0);
      } else { // SDR page 2 for 30s
        setTab("sdr");
        setSdrPageIndex(1);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [loopMode]);


  const getStatus = (v, q, isAE = false) => {
    if (q === 0) return v > 0 ? "surplus" : "neutral";
    if (v >= q) return "hit";
    const paceToUse = isAE ? quarterPace : pace;
    const attainment = v / q;
    const epsilon = 0.0001; // small tolerance for floating point precision
    if (attainment >= paceToUse - epsilon) return "above";
    if (attainment >= paceToUse * 0.7 - epsilon) return "on";
    return "behind";
  };

  const statusColor = (status) => {
    if (status === "hit" || status === "above") return "#16a34a"; // On Pace - green
    if (status === "on") return "#fcd34d"; // Tracking - yellow
    if (status === "behind") return "#ea580c"; // Behind - orange
    if (status === "surplus") return "#16a34a"; // Surplus - green
    return "#94a3b8"; // Neutral - gray
  };

  const attColor = (p) => {
    if (p >= 75) return "#16a34a";
    if (p >= 50) return "#facc15";
    if (p >= 25) return "#f97316";
    return "#dc2626";
  };

  const aeData = data?.aeData || [];
  const sdrData = data?.sdrData || [];
  const companyArr = data?.companyArr || 0;
  const COSTA_RICA_GOAL = 25000000;
  const costaRicaPct = (companyArr / COSTA_RICA_GOAL) * 100;
  const costaRicaGap = Math.max(0, COSTA_RICA_GOAL - companyArr);
  const SDR_QUOTA = data?.config?.SDR_MEETING_QUOTA || 10;
  const SDR_TEAM_GOAL = data?.config?.SDR_TEAM_QUOTA || 105;
  const TEAM_GOAL = data?.config?.TEAM_GOAL || 1900000;
  const RAMP_QUOTAS = data?.config?.RAMP_QUOTAS || {};
  const meta = data?.meta || {};
  const tClosed = aeData.reduce((s, a) => s + a.closed, 0);
  const tDeals = aeData.reduce((s, a) => s + a.cnt, 0);
  const tQuota = aeData.reduce((s, a) => s + (a.quota || 0), 0);
  const tGap = aeData.reduce((s, a) => s + (a.gap || 0), 0);
  const quotaAEs = aeData.filter((a) => a.quota > 0).length;
  const qHitters = aeData.filter((a) => a.quota > 0 && a.closed >= a.quota).length;
  const teamAtt = TEAM_GOAL > 0 ? Math.round((tClosed / TEAM_GOAL) * 100) : 0;
  const teamGap = Math.max(0, TEAM_GOAL - tClosed);
  const teamPaceAmt = Math.round(TEAM_GOAL * quarterPace);
  const teamPaceDiff = tClosed - teamPaceAmt;
  const teamBarColor = tClosed >= TEAM_GOAL ? "#16a34a" : tClosed / TEAM_GOAL >= quarterPace ? "#3b82f6" : tClosed / TEAM_GOAL >= quarterPace * 0.8 ? "#facc15" : "#dc2626";
  const tBookings = sdrData.reduce((s, a) => s + a.booked, 0);
  const tPending = sdrData.reduce((s, a) => s + a.pending, 0);
  const tQualified = sdrData.reduce((s, a) => s + a.qualified, 0);
  const sdrTeamAtt = SDR_TEAM_GOAL > 0 ? Math.round((tBookings / SDR_TEAM_GOAL) * 100) : 0;
  const sdrTeamGap = Math.max(0, SDR_TEAM_GOAL - tBookings);
  const sdrTeamPaceAmt = SDR_TEAM_GOAL * pace;
  const sdrTeamPaceDiff = parseFloat((tBookings - sdrTeamPaceAmt).toFixed(1));
  const sdrTeamBarColor = tBookings >= SDR_TEAM_GOAL ? "#16a34a" : tBookings / SDR_TEAM_GOAL >= pace ? "#3b82f6" : tBookings / SDR_TEAM_GOAL >= pace * 0.8 ? "#facc15" : "#dc2626";
  const sdrQuotaHitters = sdrData.filter((s) => s.quota > 0 && s.booked >= s.quota).length;
  const sdrWithQuota = sdrData.filter((s) => s.quota > 0).length;

  const isTV = viewMode === "tv";

  return (
    <div style={isTV ? { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", overflowY: "auto", overflowX: "hidden", display: "flex", justifyContent: "center", background: "#f8fafc", color: "#1e293b", fontFamily: "'DM Sans', system-ui, sans-serif" } : { minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .dc { max-width: ${isTV ? "none" : "1400px"}; margin: 0 auto; padding: ${isTV ? "20px 28px" : "32px 40px"}; ${isTV ? "display: flex; flex-direction: column;" : ""} }
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
        .sdr-hdr > *:first-child, .sdr-row > *:first-child { padding-left: 28px; width: 32%; }
        .sdr-hdr > *:nth-child(2), .sdr-row > *:nth-child(2) { width: 11%; text-align: right; }
        .sdr-hdr > *:nth-child(3), .sdr-row > *:nth-child(3) { width: 11%; text-align: right; }
        .sdr-hdr > *:nth-child(4), .sdr-row > *:nth-child(4) { width: 11%; text-align: right; }
        .sdr-hdr > *:nth-child(5), .sdr-row > *:nth-child(5) { width: 11%; text-align: right; }
        .sdr-hdr > *:last-child, .sdr-row > *:last-child { width: 24%; text-align: right; padding-right: 28px; }

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
        .src { margin-top: 16px; font-size: 10px; color: #cbd5e1; padding: 10px 0; ${isTV ? "display: none;" : ""} }
        .pacing-badge { font-size: 12px; font-weight: 600; }
        .stage-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; margin-right: 5px; }

        /* TV CARD GRID */
        .tv-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; flex: 1; min-height: 0; grid-auto-rows: 1fr; }
        .tv-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 10px; position: relative; }
        .tv-card:hover { border-color: #cbd5e1; }
        .tv-rank { position: absolute; top: 10px; right: 14px; font-size: 13px; font-weight: 700; color: #cbd5e1; }
        .tv-top { display: flex; align-items: center; gap: 12px; }
        .tv-name { font-size: 16px; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tv-deals { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .tv-arr { display: flex; align-items: baseline; gap: 5px; }
        .tv-arr-val { font-size: 18px; font-weight: 700; color: #0f172a; }
        .tv-arr-of { font-size: 12px; color: #94a3b8; }
        .tv-stats { display: flex; justify-content: space-between; align-items: center; }
        .tv-att { font-size: 16px; font-weight: 700; }
        .tv-gap { font-size: 13px; font-weight: 600; }
        .tv-footer { display: flex; justify-content: center; margin-top: auto; }

        /* TV Team Summary Card */
        .tv-summary { background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 6px; color: #f1f5f9; }
        .tv-summary-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: #64748b; }
        .tv-summary-val { font-size: 14px; font-weight: 700; color: #f1f5f9; }
        .tv-summary-sub { font-size: 10px; color: #475569; }

        @media (max-width: 800px) { .kpi-row { grid-template-columns: 1fr 1fr; } .dc { padding: 20px 16px; } .tv-grid { grid-template-columns: repeat(2, 1fr); } }

        .sdr-ticker-wrapper { background: linear-gradient(135deg, #cfe2f3 0%, #d4e4f7 100%); border: 3px solid #90caf9; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 16px; min-height: 260px; }
        .sdr-ticker-row { overflow: hidden; }
        .sdr-ticker { display: flex; gap: 0; }
        .sdr-ticker-left { animation: scroll-left 91s linear infinite; }
        .sdr-ticker-right { animation: scroll-left 91s linear infinite reverse; }
        .sdr-ticker:hover { animation-play-state: paused; cursor: grab; }
        .sdr-ticker-item { flex: 0 0 280px; padding: 20px; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; flex-direction: column; gap: 12px; align-items: center; transition: all 0.2s; box-shadow: 0 2px 6px rgba(0,0,0,0.08); margin: 0 8px; }
        .sdr-ticker-item:hover { border-color: #cbd5e1; background: #f8fafc; transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.1); }
        .sdr-ticker-rank { font-size: 12px; font-weight: 700; color: #cbd5e1; }
        .sdr-ticker-top { display: flex; flex-direction: column; gap: 10px; align-items: center; text-align: center; }
        .sdr-ticker-info { flex: 1; }
        .sdr-ticker-name { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 2px; }
        .sdr-ticker-booked { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        .sdr-ticker-quota { font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .sdr-ticker-bar { margin: 8px 0; width: 100%; }
        .sdr-ticker-stats { display: flex; gap: 8px; font-size: 10px; font-weight: 600; margin: 8px 0; width: 100%; justify-content: center; flex-wrap: wrap; }
        .sdr-ticker-pending { font-size: 10px; color: #d97706; font-weight: 600; margin: 4px 0; }
        @keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-6808px); } }
        @keyframes scroll-right { 0% { transform: translateX(-6808px); } 100% { transform: translateX(0); } }
      `}</style>

      <div className="dc" style={isTV ? { width: "1440px", minHeight: "1020px", transform: `scale(${tvScale})`, transformOrigin: "top center", flexShrink: 0 } : {}}>
        {/* HEADER */}
        <div className="hdr">
          <div>
            <h1>{tab === "sdr" ? "SDR Performance — " + cm + " " + cy : `AE Performance - ${quarterName} ${cy}`}</h1>
            <div className="sub">{tab === "sdr" ? `Day ${dom} of ${dim} · ${Math.round(pace * 100)}% through month` : `Day ${currentDayOfQuarter} of ${daysInQuarter} · ${Math.round(quarterPace * 100)}% through ${quarterName}`}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className={`rb ${monthOffset === -1 ? "active" : ""}`} onClick={() => { setMonthOffset((p) => p === 0 ? -1 : 0); setData(null); setExpanded(null); }}>{monthOffset === -1 ? "← This Month" : "Last Month"}</button>
            <button className={`rb ${loopMode ? "active" : ""}`} onClick={() => setLoopMode((p) => !p)}>⟳ Loop</button>
            <button className="rb" onClick={load} disabled={loading}>{loading ? "Loading…" : "↻ Refresh"}</button>
            <div className="live"><div className="ld" />{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
          </div>
        </div>


        {/* ===== TEAM GOAL BAR ===== */}
        {!loading && !error && data && tab === "ae" && (
          <div style={{ display: "flex", gap: isTV ? 12 : 16, marginBottom: isTV ? 16 : 28, alignItems: "stretch" }}>
            <div style={{ width: isTV ? 220 : 240, backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.6) 100%), url('/costa-rica.jpg')", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid #f97316", borderRadius: 14, padding: isTV ? "12px 14px" : "16px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, flexShrink: 0, boxShadow: "0 4px 14px rgba(249,115,22,0.25)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.9, color: "#fff", textAlign: "center", lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>Costa Rica Trip · by July 31</div>
              <Donut percent={costaRicaPct} size={isTV ? 90 : 110} color="#fb923c" trackColor="rgba(255,255,255,0.35)" centerColor="#fff" />
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, letterSpacing: -0.3, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{fmtF(companyArr)}</div>
              <div style={{ fontSize: 10, color: "#fff", textAlign: "center", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>of $25M · {fmt(costaRicaGap)} to go</div>
            </div>
            <div style={{ flex: 1, background: "#faf8f5", border: "1px solid #e8e3db", borderRadius: 14, padding: isTV ? "18px 24px" : "26px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, color: "#94a3b8", marginBottom: 8 }}>AE Quarterly Goal - {quarterName} {cy}</div>
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
            <div style={{ position: "relative", width: "100%", height: 10, borderRadius: 5, background: "#ede9e3", marginBottom: 14 }}>
              <div style={{ width: `${Math.min(teamAtt, 100)}%`, height: "100%", borderRadius: 5, background: teamBarColor, transition: "width 0.8s ease" }} />
              <div style={{ position: "absolute", top: -4, left: `${Math.min(quarterPace * 100, 100)}%`, transform: "translateX(-50%)", width: 2, height: 18, background: "#cbd5e1", borderRadius: 1 }} title="Quarter pace" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 24 }}>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Pace </span><span style={{ fontSize: 13, fontWeight: 600, color: teamPaceDiff >= 0 ? "#16a34a" : "#dc2626" }}>{teamPaceDiff >= 0 ? `+${fmtF(teamPaceDiff)}` : `-${fmtF(Math.abs(teamPaceDiff))}`}</span></div>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Expected </span><span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{fmtF(teamPaceAmt)}</span></div>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>At Quota </span><span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{qHitters}/{quotaAEs} reps</span></div>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{tab === "sdr" ? `Day ${dom} / ${dim} · ${Math.round(pace * 100)}% through month` : `Day ${currentDayOfQuarter} / ${daysInQuarter} · ${Math.round(quarterPace * 100)}% through ${quarterName}`}</div>
            </div>
            </div>
            {(() => {
              const q = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
              return (
                <div style={{ width: isTV ? 340 : 380, background: "#e8eef5", border: "1px solid #cfd9e6", borderRadius: 14, padding: isTV ? "18px 22px" : "22px 26px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#0f172a" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b", marginBottom: 6 }}>Daily Motivation</div>
                  <div style={{ fontSize: 42, color: "#94a3b8", lineHeight: 0.8, marginBottom: 6, fontFamily: "Georgia, serif" }}>"</div>
                  <div style={{ fontSize: 17, color: "#1e293b", lineHeight: 1.5, fontStyle: "italic", fontWeight: 500 }}>{q.text}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 10, fontWeight: 500 }}>— {q.author}</div>
                </div>
              );
            })()}
          </div>
        )}

        {!loading && !error && data && tab === "sdr" && (
          <div style={{ display: "flex", gap: isTV ? 12 : 16, marginBottom: isTV ? 16 : 28, alignItems: "stretch" }}>
            <div style={{ width: isTV ? 220 : 240, backgroundImage: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.6) 100%), url('/costa-rica.jpg')", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid #f97316", borderRadius: 14, padding: isTV ? "12px 14px" : "16px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, flexShrink: 0, boxShadow: "0 4px 14px rgba(249,115,22,0.25)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.9, color: "#fff", textAlign: "center", lineHeight: 1.3, textShadow: "0 1px 4px rgba(0,0,0,0.7)", whiteSpace: "nowrap" }}>Costa Rica Trip · by July 31</div>
              <Donut percent={costaRicaPct} size={isTV ? 90 : 110} color="#fb923c" trackColor="rgba(255,255,255,0.35)" centerColor="#fff" />
              <div style={{ fontSize: 13, color: "#fff", fontWeight: 700, letterSpacing: -0.3, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>{fmtF(companyArr)}</div>
              <div style={{ fontSize: 10, color: "#fff", textAlign: "center", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>of $25M · {fmt(costaRicaGap)} to go</div>
            </div>
            <div style={{ flex: 1, background: "#faf8f5", border: "1px solid #e8e3db", borderRadius: 14, padding: isTV ? "18px 24px" : "26px 32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.4, color: "#94a3b8", marginBottom: 8 }}>Monthly SDR Team Goal — {cm} {cy}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: isTV ? 26 : 36, fontWeight: 700, color: "#0f172a", letterSpacing: -1, fontFamily: "'DM Sans',sans-serif" }}>{fmtPts(tBookings)}</span>
                  <span style={{ fontSize: isTV ? 13 : 17, color: "#94a3b8", fontWeight: 500 }}>of {SDR_TEAM_GOAL} meetings</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: isTV ? 20 : 32, alignItems: "flex-start" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isTV ? 24 : 32, fontWeight: 700, color: sdrTeamBarColor, letterSpacing: -0.5 }}>{sdrTeamAtt}%</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Attainment</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: isTV ? 24 : 32, fontWeight: 700, color: sdrTeamGap === 0 ? "#16a34a" : "#dc2626", letterSpacing: -0.5 }}>{sdrTeamGap === 0 ? "Done!" : `-${fmtPts(sdrTeamGap)}`}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, textTransform: "uppercase", letterSpacing: 0.8 }}>Gap</div>
                </div>
              </div>
            </div>
            <div style={{ position: "relative", width: "100%", height: 10, borderRadius: 5, background: "#ede9e3", marginBottom: 14 }}>
              <div style={{ width: `${Math.min(sdrTeamAtt, 100)}%`, height: "100%", borderRadius: 5, background: sdrTeamBarColor, transition: "width 0.8s ease" }} />
              <div style={{ position: "absolute", top: -4, left: `${Math.min(pace * 100, 100)}%`, transform: "translateX(-50%)", width: 2, height: 18, background: "#cbd5e1", borderRadius: 1 }} title="Month pace" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 24 }}>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Pace </span><span style={{ fontSize: 13, fontWeight: 600, color: sdrTeamPaceDiff >= 0 ? "#16a34a" : "#dc2626" }}>{sdrTeamPaceDiff >= 0 ? `+${fmtPts(sdrTeamPaceDiff)}` : fmtPts(sdrTeamPaceDiff)}</span></div>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>Expected </span><span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{fmtPts(parseFloat(sdrTeamPaceAmt.toFixed(1)))}</span></div>
                <div><span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.8 }}>At Quota </span><span style={{ fontSize: 13, fontWeight: 600, color: "#64748b" }}>{sdrQuotaHitters}/{sdrWithQuota} SDRs</span></div>
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{tab === "sdr" ? `Day ${dom} / ${dim} · ${Math.round(pace * 100)}% through month` : `Day ${currentDayOfQuarter} / ${daysInQuarter} · ${Math.round(quarterPace * 100)}% through ${quarterName}`}</div>
            </div>
            </div>
            {(() => {
              const q = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length];
              return (
                <div style={{ width: isTV ? 340 : 380, background: "#e8eef5", border: "1px solid #cfd9e6", borderRadius: 14, padding: isTV ? "18px 22px" : "22px 26px", display: "flex", flexDirection: "column", justifyContent: "center", color: "#0f172a" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, color: "#64748b", marginBottom: 6 }}>Daily Motivation</div>
                  <div style={{ fontSize: 42, color: "#94a3b8", lineHeight: 0.8, marginBottom: 6, fontFamily: "Georgia, serif" }}>"</div>
                  <div style={{ fontSize: 17, color: "#1e293b", lineHeight: 1.5, fontStyle: "italic", fontWeight: 500 }}>{q.text}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 10, fontWeight: 500 }}>— {q.author}</div>
                </div>
              );
            })()}
          </div>
        )}

        {loading && !data ? (
          <div className="card"><div className="loader"><div className="spinner" /><div style={{ marginTop: 14, fontSize: 12, color: "#94a3b8" }}>Querying Salesforce…</div></div></div>
        ) : error ? (
          <div className="card"><div className="loader"><div style={{ color: "#dc2626", fontSize: 13 }}>Error: {error}</div><button className="rb" onClick={load} style={{ marginTop: 12 }}>Retry</button></div></div>
        ) : isTV ? (
          /* ============ TV MODE ============ */
          <>
            <div className="tabs" style={{ marginBottom: 16 }}>
              <button className={`tb ${tab === "ae" ? "on" : ""}`} onClick={() => { setTab("ae"); setExpanded(null); }}>Account Executives</button>
              <button className={`tb ${tab === "sdr" ? "on" : ""}`} onClick={() => { setTab("sdr"); setExpanded(null); }}>SDRs</button>
            </div>

            {tab === "ae" ? (
              /* ---- AE TV GRID ---- */
              <div>
                {(() => {
                  const itemsPerPage = 10;
                  const pages = [];
                  for (let i = 0; i < aeData.length; i += itemsPerPage) {
                    pages.push(aeData.slice(i, i + itemsPerPage));
                  }
                  const currentPage = pages[aePageIndex] || [];
                  return (
                    <>
                    <div className="tv-grid">
                      {currentPage.map((ae, i) => {
                        const actualIndex = aePageIndex * itemsPerPage + i;
                        const q = ae.quota || 0;
                        const att = ae.attainment != null ? ae.attainment : (q > 0 ? Math.round((ae.closed / q) * 100) : (ae.closed > 0 ? 100 : 0));
                        const st = getStatus(ae.closed, q, true);
                        const bc = statusColor(st);
                        const gapVal = ae.gap || 0;
                        const ex = expanded === `ae-${actualIndex}`;
                        return (
                          <div className="tv-card" key={ae.name}>
                            <span className="tv-rank">#{actualIndex + 1}</span>
                            <div className="tv-top">
                              <Avatar name={ae.name} size={56} />
                              <div style={{ overflow: "hidden" }}>
                                <div className="tv-name">{ae.name}</div>
                                <div style={{ display: "flex", gap: 8, fontSize: 11, color: "#94a3b8", alignItems: "center" }}>
                                  <div className="tv-deals">{ae.cnt} deal{ae.cnt !== 1 ? "s" : ""}</div>
                                  <span>|</span>
                                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>{ae.qualityDealsCnt}</span>
                                    <span style={{ fontSize: 10 }}>quality deals</span>
                                  </div>
                                </div>
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
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#64748b", marginTop: 8 }}>
                              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Open Pipeline:</span><span style={{ fontWeight: 600, color: "#0f172a" }}>{fmt(ae.openPipeline)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Best Case:</span><span style={{ fontWeight: 600, color: "#0f172a" }}>{fmt(ae.bestCase)}</span></div>
                              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Commit:</span><span style={{ fontWeight: 600, color: "#0f172a" }}>{fmt(ae.commit)}</span></div>
                              {(() => {
                                const expectedLandAtt = q > 0 ? Math.round(((ae.closed + ae.commit) / q) * 100) : (ae.closed + ae.commit > 0 ? 100 : 0);
                                const exEl = expanded === `ae-expected-${actualIndex}`;
                                const hasDeals = (ae.bestCaseDeals?.length > 0 || ae.commitDeals?.length > 0);
                                return (
                                  <div>
                                    <div onClick={() => hasDeals && setExpanded(exEl ? null : `ae-expected-${actualIndex}`)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)", borderRadius: 6, border: "1px solid #cbd5e1", marginTop: 4, cursor: hasDeals ? "pointer" : "default", flexWrap: "nowrap", minHeight: 40 }}><span style={{ fontWeight: 600, color: "#64748b", fontSize: 12, flexShrink: 0 }}>Expected Land</span><div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}><span style={{ fontWeight: 800, color: "#0f172a", fontSize: 13, whiteSpace: "nowrap" }}>{fmt(ae.closed + ae.commit)}</span><span style={{ fontWeight: 500, color: "#94a3b8", fontSize: 11 }}>/</span><span style={{ fontWeight: 600, color: "#64748b", fontSize: 11, whiteSpace: "nowrap" }}>{expectedLandAtt}%</span>{hasDeals && <span style={{ marginLeft: 8, fontSize: 15, color: "#94a3b8", fontWeight: 400, flexShrink: 0 }}>{exEl ? "−" : "+"}</span>}</div></div>
                                    {exEl && hasDeals && (
                                      <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10, marginTop: 2, display: "flex", flexDirection: "column", gap: 5 }}>
                                        {ae.bestCaseDeals?.length > 0 && (
                                          <>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Best Case</div>
                                            {ae.bestCaseDeals.sort((a, b) => b.arr - a.arr).map((d, j) => (
                                              <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b" }}>
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{d.name.length > 24 ? d.name.slice(0, 24) + "…" : d.name}</span>
                                                <span style={{ color: "#3b82f6", fontWeight: 600, flexShrink: 0 }}>{fmt(d.arr)}</span>
                                              </div>
                                            ))}
                                          </>
                                        )}
                                        {ae.commitDeals?.length > 0 && (
                                          <>
                                            {ae.bestCaseDeals?.length > 0 && <div style={{ height: 1, background: "#f1f5f9", margin: "4px 0" }} />}
                                            <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase" }}>Commit</div>
                                            {ae.commitDeals.sort((a, b) => b.arr - a.arr).map((d, j) => (
                                              <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b" }}>
                                                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{d.name.length > 24 ? d.name.slice(0, 24) + "…" : d.name}</span>
                                                <span style={{ color: "#8b5cf6", fontWeight: 600, flexShrink: 0 }}>{fmt(d.arr)}</span>
                                              </div>
                                            ))}
                                          </>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                            <div className="tv-footer" style={{ justifyContent: "space-between", marginTop: 8, position: "relative" }}>
                              <StatusPill status={st} compact />
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                {RAMP_QUOTAS[ae.name] && <span style={{ fontSize: 9, fontWeight: 600, color: "#fff", background: "#3b82f6", border: "1px solid #2563eb", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>Ramp</span>}
                                {ae.deals?.length > 0 && (
                                  <span onClick={() => setExpanded(ex ? null : `ae-${actualIndex}`)} style={{ width: 22, height: 22, borderRadius: "50%", border: "1px solid #e2e8f0", background: "#f8fafc", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#94a3b8", fontWeight: 400, flexShrink: 0, lineHeight: 1, cursor: "pointer" }}>{ex ? "−" : "+"}</span>
                                )}
                              </div>
                            </div>
                            {ex && ae.deals?.length > 0 && (
                              <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10, marginTop: 2, display: "flex", flexDirection: "column", gap: 5 }}>
                                {ae.deals.sort((a, b) => b.arr - a.arr).map((d, j) => (
                                  <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b" }}>
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "65%" }}>{d.name.length > 24 ? d.name.slice(0, 24) + "…" : d.name}</span>
                                    <span style={{ color: "#16a34a", fontWeight: 600, flexShrink: 0 }}>{fmt(d.arr)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {pages.length > 1 && (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
                        <button onClick={() => setAEPageIndex(Math.max(0, aePageIndex - 1))} disabled={aePageIndex === 0} style={{ padding: "6px 12px", fontSize: 12, background: aePageIndex === 0 ? "#f1f5f9" : "#e2e8f0", color: aePageIndex === 0 ? "#cbd5e1" : "#475569", border: "1px solid #cbd5e1", borderRadius: 4, cursor: aePageIndex === 0 ? "default" : "pointer" }}>← Previous</button>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>Page {aePageIndex + 1} of {pages.length}</span>
                        <button onClick={() => setAEPageIndex(Math.min(pages.length - 1, aePageIndex + 1))} disabled={aePageIndex === pages.length - 1} style={{ padding: "6px 12px", fontSize: 12, background: aePageIndex === pages.length - 1 ? "#f1f5f9" : "#e2e8f0", color: aePageIndex === pages.length - 1 ? "#cbd5e1" : "#475569", border: "1px solid #cbd5e1", borderRadius: 4, cursor: aePageIndex === pages.length - 1 ? "default" : "pointer" }}>Next →</button>
                      </div>
                    )}
                    </>
                  );
                })()}
              </div>
            ) : (
              /* ---- SDR TV GRID ---- */
              <div>
                {(() => {
                  const itemsPerPage = 15; // 5 columns × 3 rows
                  const pages = [];
                  for (let i = 0; i < sdrData.length; i += itemsPerPage) {
                    pages.push(sdrData.slice(i, i + itemsPerPage));
                  }
                  const currentPage = pages[sdrPageIndex] || [];
                  return (
                    <>
                    <div className="tv-grid">
                      {currentPage.map((s, i) => {
                        const actualIndex = sdrPageIndex * itemsPerPage + i;
                        const sdrQuota = s.quota || SDR_QUOTA;
                        const att = sdrQuota > 0 ? Math.round((s.booked / sdrQuota) * 100) : (s.booked > 0 ? 100 : 0);
                        const st = getStatus(s.booked, sdrQuota);
                        const bc = statusColor(st);
                        const diff = parseFloat((s.booked - sdrQuota * pace).toFixed(1));
                        const ex = expanded === `sdr-tv-${actualIndex}`;
                  return (
                    <div className="tv-card" key={s.name}>
                      <span className="tv-rank">#{actualIndex + 1}</span>
                      <div className="tv-top">
                        <Avatar name={s.name} size={56} />
                        <div style={{ overflow: "hidden" }}>
                          <div className="tv-name">{s.name}</div>
                          <div className="tv-deals">{fmtPts(s.booked)} meeting{s.booked !== 1 ? "s" : ""}</div>
                        </div>
                      </div>
                      <div className="tv-arr">
                        <span className="tv-arr-val">{fmtPts(s.booked)}</span>
                        <span className="tv-arr-of">of {sdrQuota} mtgs</span>
                      </div>
                      <Bar value={s.booked} max={sdrQuota || s.booked || 1} color={bc} h={5} />
                      <div className="tv-stats">
                        <span className="tv-att" style={{ color: bc }}>{att}%</span>
                        <span className="tv-gap" style={{ color: diff >= 0 ? "#16a34a" : "#dc2626" }}>{diff >= 0 ? `+${fmtPts(diff)}` : fmtPts(diff)} vs pace</span>
                      </div>
                      <div className="tv-footer" style={{ justifyContent: "space-between", marginTop: "auto" }}>
                        <StatusPill status={st} compact />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {RAMP_QUOTAS[s.name] && <span style={{ fontSize: 9, fontWeight: 600, color: "#fff", background: "#3b82f6", border: "1px solid #2563eb", padding: "2px 6px", borderRadius: 3, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 }}>Ramp</span>}
                          {s.opps?.length > 0 && (
                            <span onClick={() => setExpanded(ex ? null : `sdr-tv-${i}`)} style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid #e2e8f0", background: "#f8fafc", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#94a3b8", fontWeight: 400, flexShrink: 0, lineHeight: 1, cursor: "pointer" }}>{ex ? "−" : "+"}</span>
                          )}
                        </div>
                      </div>
                      {ex && s.opps?.length > 0 && (
                        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 12px", zIndex: 20, boxShadow: "0 8px 20px rgba(15,23,42,0.12)", display: "flex", flexDirection: "column", gap: 5 }}>
                          {s.opps.sort((a, b) => (b.points || 0) - (a.points || 0)).map((o, j) => (
                            <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#64748b" }}>
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>{(o.name || "").length > 24 ? o.name.slice(0, 24) + "…" : o.name}</span>
                              <span style={{ color: "#16a34a", fontWeight: 600, flexShrink: 0 }}>{fmtPts(o.points || 0)} pt</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                    </div>
                    {pages.length > 1 && (
                      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 16 }}>
                        <button onClick={() => setSdrPageIndex(Math.max(0, sdrPageIndex - 1))} disabled={sdrPageIndex === 0} style={{ padding: "6px 12px", fontSize: 12, background: sdrPageIndex === 0 ? "#f1f5f9" : "#e2e8f0", color: sdrPageIndex === 0 ? "#cbd5e1" : "#475569", border: "1px solid #cbd5e1", borderRadius: 4, cursor: sdrPageIndex === 0 ? "default" : "pointer" }}>← Previous</button>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>Page {sdrPageIndex + 1} of {pages.length}</span>
                        <button onClick={() => setSdrPageIndex(Math.min(pages.length - 1, sdrPageIndex + 1))} disabled={sdrPageIndex === pages.length - 1} style={{ padding: "6px 12px", fontSize: 12, background: sdrPageIndex === pages.length - 1 ? "#f1f5f9" : "#e2e8f0", color: sdrPageIndex === pages.length - 1 ? "#cbd5e1" : "#475569", border: "1px solid #cbd5e1", borderRadius: 4, cursor: sdrPageIndex === pages.length - 1 ? "default" : "pointer" }}>Next →</button>
                      </div>
                    )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        ) : (
          /* ============ TABLE VIEW ============ */
          <>
            <div className="tabs">
              <button className={`tb ${tab === "ae" ? "on" : ""}`} onClick={() => { setTab("ae"); setExpanded(null); }}>Account Executives</button>
              <button className={`tb ${tab === "sdr" ? "on" : ""}`} onClick={() => { setTab("sdr"); setExpanded(null); }}>SDRs</button>
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
                  const st = getStatus(ae.closed, q, true);
                  const bc = statusColor(st);
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
                  const sdrQuota = s.quota || SDR_QUOTA;
                  const att = Math.round((s.booked / sdrQuota) * 100);
                  const st = getStatus(s.booked, sdrQuota);
                  const diff = parseFloat((s.booked - sdrQuota * pace).toFixed(1));
                  const ex = expanded === `sdr-${i}`;
                  return (
                    <div key={s.name}>
                      <div className="row-wrap" onClick={() => setExpanded(ex ? null : `sdr-${i}`)}>
                        <div className="sdr-row row-inner">
                          <div className="name-cell"><span className="rank">{i + 1}</span><Avatar name={s.name} /><div style={{ minWidth: 0 }}><div className="name-primary" style={{ whiteSpace: "nowrap" }}>{s.name}</div><div className="name-sub" style={{ whiteSpace: "nowrap" }}>{fmtPts(s.booked)}/{sdrQuota} target</div></div></div>
                          <div><span className="val">{fmtPts(s.booked)}</span></div>
                          <div><span className="val-muted">{s.pendingOpps?.length || 0}</span></div>
                          <div><span className="val">{fmtPts(s.qualified)}</span></div>
                          <div><span className="pacing-badge" style={{ color: diff >= 0 ? "#16a34a" : "#dc2626" }}>{diff >= 0 ? `+${fmtPts(diff)}` : fmtPts(diff)}</span></div>
                          <div><StatusPill status={st} /></div>
                        </div>
                      </div>
                      {ex && s.opps?.length > 0 && (
                        <div className="expand-panel">
                          {s.opps.sort((a, b) => (a.stage || "").localeCompare(b.stage || "")).map((o, j) => {
                            const sc = (o.stage || "").includes("Open") ? "#3b82f6" : (o.stage || "").includes("Qualified") || (o.stage || "").includes("Interested") ? "#16a34a" : (o.stage || "").includes("Lost") ? "#dc2626" : "#94a3b8";
                            return <span key={j} className="deal-chip"><span className="stage-dot" style={{ background: sc }} />{(o.name || "").length > 26 ? o.name.slice(0, 26) + "…" : o.name}{o.points != null && o.points !== 1 ? <span style={{ color: "#94a3b8", marginLeft: 4 }}>({fmtPts(o.points)}pt)</span> : null}</span>;
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="footer"><span>Month: Day {dom}/{dim} · SDR Quota: {SDR_QUOTA || 10}/mo</span><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div className="foot-bar"><div className="foot-fill" style={{ width: `${Math.round(pace * 100)}%` }} /></div><span>{Math.round(pace * 100)}%</span></div></div>
              </div>
            )}
          </>
        )}
        <div className="src">Source: Salesforce REST API · Opportunity_ARR__c · CloseDate in {cm} {cy}</div>
      </div>
    </div>
  );
}
