import React, { useState } from "react";
import { Crown, BookHeart, MessageCircle, Ticket, Tv, ShieldCheck, Lock } from "lucide-react";
import App from "./App.jsx";
import Cards from "./Cards.jsx";
import Raffle from "./Raffle.jsx";
import Wall from "./Wall.jsx";
import Admin from "./Admin.jsx";
import RaffleHost from "./RaffleHost.jsx";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

const BASE_URL = "https://shannons-50th-9yqe.vercel.app";
const HOST_PASSCODE = "favored50host";

const QR_URLS = {
  guestbook: `${BASE_URL}`,
  cards: `${BASE_URL}/cards`,
  raffle: `${BASE_URL}/raffle`,
};

function QRCode({ url, label }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}&color=4B1D52&bgcolor=FAF3EE`;
  return (
    <div
      className="flex flex-col items-center"
      style={{ background: COLORS.cream, borderRadius: 10, padding: "10px 12px", minWidth: 110 }}
    >
      <img src={qrSrc} alt={`QR code for ${label}`} width={90} height={90} style={{ display: "block", borderRadius: 4 }} />
      <p style={{ fontSize: 9, color: COLORS.plumWine, marginTop: 5, textAlign: "center", fontWeight: 500, letterSpacing: "0.05em" }}>
        Scan to {label}
      </p>
    </div>
  );
}

function HostGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [err, setErr] = useState(false);
  const attempt = () => {
    if (input === HOST_PASSCODE) { onUnlock(); }
    else { setErr(true); setTimeout(() => setErr(false), 1500); }
  };
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16">
      <Lock size={28} style={{ color: COLORS.champagneGold, marginBottom: 12 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontSize: 22, marginBottom: 6 }}>
        Host controls
      </h2>
      <p style={{ color: COLORS.mauveBlush, fontSize: 13, marginBottom: 20, textAlign: "center" }}>
        Enter the host passcode to access the raffle draw and guestbook admin.
      </p>
      <input
        type="password"
        placeholder="Passcode"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && attempt()}
        style={{
          width: "100%", maxWidth: 280, padding: "10px 14px", borderRadius: 8,
          border: `1.5px solid ${err ? "#B33A3A" : COLORS.mauveBlush}`,
          color: COLORS.deepPurple, fontSize: 14, marginBottom: 10, outline: "none",
        }}
      />
      <button
        onClick={attempt}
        style={{ background: COLORS.champagneGold, color: COLORS.deepPurple, border: "none", borderRadius: 999, padding: "10px 28px", fontWeight: 500, fontSize: 14, cursor: "pointer" }}
      >
        Unlock
      </button>
      {err && <p style={{ color: "#E57373", fontSize: 12, marginTop: 8 }}>Incorrect passcode — try again</p>}
    </div>
  );
}

function HostDashboard() {
  const [hostView, setHostView] = useState("raffle");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: "12px 16px", background: "rgba(0,0,0,0.2)" }}>
        {[{ id: "raffle", label: "Raffle Draw" }, { id: "guestbook", label: "Guestbook Admin" }].map((v) => (
          <button
            key={v.id}
            onClick={() => setHostView(v.id)}
            style={{
              flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
              background: hostView === v.id ? COLORS.champagneGold : "rgba(255,255,255,0.1)",
              color: hostView === v.id ? COLORS.deepPurple : COLORS.mauveBlush,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
      {hostView === "raffle" ? <RaffleHost embedded /> : <Admin embedded />}
    </div>
  );
}

const TABS = [
  { id: "guestbook", label: "Guestbook", icon: BookHeart, desc: "Leave a wish or memory", qr: true },
  { id: "cards",     label: "Table Games", icon: MessageCircle, desc: "Icebreakers & trivia", qr: true },
  { id: "raffle",    label: "Raffle",      icon: Ticket,        desc: "Get your number",      qr: true },
  { id: "wall",      label: "Live Wall",   icon: Tv,            desc: "Entries in rotation",  qr: false },
  { id: "host",      label: "Host",        icon: ShieldCheck,   desc: "Admin controls",       qr: false },
];

const CONTENT = {
  guestbook: <App />,
  cards:     <Cards />,
  raffle:    <Raffle />,
  wall:      <Wall />,
};

export default function Hub() {
  const [activeTab, setActiveTab] = useState("guestbook");
  const [hostUnlocked, setHostUnlocked] = useState(false);

  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <div
      style={{
        minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .tab-bar{display:flex;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
        .tab-bar::-webkit-scrollbar{display:none}
        .tab-btn{flex:1;min-width:64px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 6px;border:none;background:transparent;cursor:pointer;transition:all 0.2s;border-bottom:2px solid transparent}
        .tab-btn.active{border-bottom-color:${COLORS.champagneGold}}
        .tab-btn:hover{background:rgba(255,255,255,0.06)}
        .qr-row{display:flex;align-items:center;gap:16px;padding:12px 20px;background:rgba(0,0,0,0.2);border-bottom:1px solid rgba(255,255,255,0.07)}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "24px 20px 12px", position: "relative", overflow: "hidden" }}>
        <Crown size={22} style={{ color: COLORS.champagneGold, display: "block", margin: "0 auto 6px" }} strokeWidth={1.5} />
        <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: COLORS.champagneGold, margin: "0 0 2px" }}>
          Honoring Dr. Shannon J. Thomas
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600, fontSize: "clamp(20px,5vw,30px)", margin: "0 0 2px" }}>
          Favored, Fabulous &amp; Fifty
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.mauveBlush, fontSize: 14, fontStyle: "italic", margin: 0 }}>
          July 18, 2026 · Georgia Tech · Cypress Theater
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ background: "rgba(0,0,0,0.25)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="tab-bar" style={{ maxWidth: 560, margin: "0 auto" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} className={`tab-btn ${isActive ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                <Icon size={20} style={{ color: isActive ? COLORS.champagneGold : COLORS.mauveBlush }} strokeWidth={1.5} />
                <span style={{ fontSize: 10, fontWeight: 500, color: isActive ? COLORS.champagneGold : COLORS.mauveBlush, whiteSpace: "nowrap" }}>
                  {tab.label}
                </span>
                <span style={{ fontSize: 9, color: isActive ? COLORS.mauveBlush : "rgba(199,154,160,0.45)", whiteSpace: "nowrap" }}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QR banner — only for tabs that have a QR code */}
      {currentTab.qr && (
        <div className="qr-row">
          <QRCode url={QR_URLS[activeTab]} label={currentTab.label.toLowerCase()} />
          <div>
            <p style={{ color: COLORS.champagneGold, fontSize: 13, fontWeight: 500, margin: "0 0 3px" }}>
              Scan to {activeTab === "guestbook" ? "leave a wish or memory" : activeTab === "cards" ? "play table games" : "enter the raffle"}
            </p>
            <p style={{ color: COLORS.mauveBlush, fontSize: 11, margin: 0 }}>
              Or hand your phone to a friend — anyone can scan
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1 }}>
        {activeTab === "host" ? (
          hostUnlocked ? <HostDashboard /> : <HostGate onUnlock={() => setHostUnlocked(true)} />
        ) : (
          CONTENT[activeTab]
        )}
      </div>
    </div>
  );
}
