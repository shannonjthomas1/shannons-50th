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
  const items = entries && entries.length ? entries : SAMPLE_ENTRIES;
  const doubled = [...items, ...items];
  return (
    <div style={{ background: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(229,193,88,0.4)", padding: "11px 0", overflow: "hidden", backdropFilter: "blur(4px)", flexShrink: 0 }}>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .ticker-tt{display:flex;animation:ticker 50s linear infinite;white-space:nowrap;width:max-content}
        .ticker-tt:hover{animation-play-state:paused}
      `}</style>
      <div className="ticker-tt">
        {doubled.map((e, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 32px" }}>
            <span style={{ color: "#E5C158", fontSize: 13, fontWeight: 600 }}>— {e.name || "Guest"}</span>
            <span style={{ color: "#FAF3EE", fontSize: 13 }}>{e.text}</span>
            <span style={{ color: "#B76E79", fontSize: 18, marginLeft: 8 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home({ liveEntries = [] }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", minHeight: 460 }}>

      {/* Purple gradient fallback — always visible, image layers on top when ready */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        background: "linear-gradient(135deg, #4B1D52 0%, #7B2D6E 40%, #3D1040 100%)",
      }} />

      {/* Decorative circles on fallback */}
      {!imgLoaded && (
        <>
          <div style={{ position: "absolute", top: "10%", left: "5%", width: 180, height: 180, borderRadius: "50%", background: "rgba(229,193,88,0.06)", zIndex: 1 }} />
          <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 140, height: 140, borderRadius: "50%", background: "rgba(183,110,121,0.08)", zIndex: 1 }} />
          <div style={{ position: "absolute", top: "40%", right: "20%", width: 80, height: 80, borderRadius: "50%", background: "rgba(229,193,88,0.05)", zIndex: 1 }} />
        </>
      )}

      {/* Banner image — loads async, fades in */}
      <img
        src="/banner.jpg"
        alt="Favored, Fabulous & Fifty"
        onLoad={() => setImgLoaded(true)}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center top", display: "block",
          zIndex: 1,
          opacity: imgLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(20,5,28,0.55) 80%, rgba(20,5,28,0.78) 100%)",
      }} />

      {/* Welcome text */}
      <div style={{ position: "relative", zIndex: 3, marginTop: "auto", padding: "0 24px 20px", textAlign: "center" }}>
        {!imgLoaded && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,7vw,52px)", fontWeight: 700, color: "#FAF3EE", margin: "0 0 4px", lineHeight: 1.1 }}>Favored, Fabulous</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,7vw,52px)", fontWeight: 700, color: "#E5C158", margin: "0 0 12px", lineHeight: 1.1 }}>&amp; Fifty</p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontStyle: "italic", color: "#C79AA0", margin: 0 }}>Celebrating Dr. Shannon J. Thomas</p>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 300, margin: "0 auto 10px" }}>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(229,193,88,0.6))" }} />
          <span style={{ color: "#E5C158", fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(229,193,88,0.6))" }} />
        </div>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(18px, 4vw, 26px)",
          fontStyle: "italic",
          color: "#FAF3EE",
          margin: 0,
          letterSpacing: "0.08em",
          textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        }}>
          Welcome to the celebration
        </p>
      </div>

      <TickerBar entries={liveEntries} />
    </div>
  );
}
