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
    <div style={{ background: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(229,193,88,0.4)", padding: "11px 0", overflow: "hidden", backdropFilter: "blur(4px)", whiteSpace: "nowrap" }}>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-tt{display:inline-flex;animation:ticker 60s linear infinite;white-space:nowrap;will-change:transform;}
        .ticker-tt:hover{animation-play-state:paused}
      `}</style>
      <div className="ticker-tt">
        {doubled.map((e, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 40px", flexShrink: 0 }}>
            <span style={{ color: "#D4A84B", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>— {e.name || "Guest"}:</span>
            <span style={{ color: "#FDF0ED", fontSize: 13, whiteSpace: "nowrap" }}>{e.text}</span>
            <span style={{ color: "#C17A8A", fontSize: 16, marginLeft: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home({ liveEntries = [] }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", minHeight: 460 }}>

      <style>{`
        .banner-img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 0;
          object-fit: cover;
          object-position: top center;
        }
        @media (max-width: 640px) {
          .banner-img {
            object-fit: contain;
            object-position: top center;
            background-color: #3D0C4E;
          }
          .home-wrap {
            min-height: calc(100vw * 0.563) !important;
          }
        }
      `}</style>

      {/* Full banner background */}
      <img
        src="/banner.jpg"
        alt="Favored, Fabulous & Fifty"
        className="banner-img"
      />

      {/* Subtle gradient at bottom only */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(20,5,28,0.55) 80%, rgba(20,5,28,0.78) 100%)",
      }} />

      {/* Spacer to push ticker to bottom */}
      <div style={{ flex: 1, zIndex: 2 }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <TickerBar entries={liveEntries} />
      </div>
    </div>
  );
}
