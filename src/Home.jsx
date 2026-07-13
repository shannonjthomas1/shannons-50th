import { useState } from "react";

const SAMPLE_ENTRIES = [
  { name: "Dana", text: "Here's to fifty years of fabulous! Can't wait to see what's next. 🥂" },
  { name: "Marcus", text: "Never forgot the road trip where we got lost and laughed the whole time." },
  { name: "Keisha", text: "Shannon, you are the definition of grace and power. Happy 50th queen!" },
  { name: "Pastor Williams", text: "Refuge Temple is so proud of you. God has truly favored you!" },
  { name: "Tiffany", text: "25 years of marriage and still going strong — couple goals forever!" },
  { name: "Dr. Carter", text: "From Albany State to IT Director — Dr. Thomas, you are an inspiration." },
  { name: "Renee", text: "Happy birthday to the most fabulous woman I know. Love you forever!" },
];

function TickerBar({ entries }) {
  const items = entries.length ? entries : SAMPLE_ENTRIES;
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(229,193,88,0.4)", padding: "11px 0", overflow: "hidden", backdropFilter: "blur(4px)" }}>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-tt{display:flex;animation:ticker 50s linear infinite;white-space:nowrap;width:max-content}
        .ticker-tt:hover{animation-play-state:paused}
      `}</style>
      <div className="ticker-tt">
        {doubled.map((e, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 32px" }}>
            <span style={{ color: "#D4A84B", fontSize: 13, fontWeight: 600 }}>— {e.name || "Guest"}</span>
            <span style={{ color: "#FDF0ED", fontSize: 13 }}>{e.text}</span>
            <span style={{ color: "#C17A8A", fontSize: "clamp(12px,4vw,18px)", marginLeft: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home({ liveEntries = [] }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", minHeight: 460 }}>

      {/* Full banner background */}
      <img
        src="/banner.jpg"
        alt="Favored, Fabulous & Fifty"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top", display: "block", zIndex: 0,
        }}
      />

      {/* Subtle gradient at bottom only */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(20,5,28,0.55) 80%, rgba(20,5,28,0.78) 100%)",
      }} />

      {/* WiFi banner */}
      <div style={{
        background: "rgba(0,0,0,0.5)", borderTop: "1px solid rgba(229,193,88,0.3)",
        padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "center",
        gap: 10, flexWrap: "wrap", flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, color: COLORS.champagneGold, fontWeight: 600, whiteSpace: "nowrap" }}>
          📶 WiFi:
        </span>
        <span style={{ fontSize: 12, color: COLORS.cream, fontWeight: 600, whiteSpace: "nowrap" }}>
          GTvisitor
        </span>
        <span style={{ fontSize: 11, color: COLORS.mauveBlush }}>
          — Select free tier, open browser &amp; follow the prompts to connect
        </span>
      </div>

      <TickerBar entries={liveEntries} />
    </div>
  );
}
