import React, { useState, useEffect } from "react";
import { Crown, BookHeart, MessageCircle, Ticket, Tv, ShieldCheck, Lock, Heart, Grid3x3 } from "lucide-react";
import { supabase } from "./supabaseClient";
import App from "./App.jsx";
import Cards from "./Cards.jsx";
import Give from "./Give.jsx";
import Bingo from "./Bingo.jsx";
import BingoHost from "./BingoHost.jsx";
import Raffle from "./Raffle.jsx";
import Wall from "./Wall.jsx";
import Admin from "./Admin.jsx";
import RaffleHost from "./RaffleHost.jsx";
import Home from "./Home.jsx";

const COLORS = {
  deepPurple: "#3D0C4E",
  plumWine: "#6B2D6B",
  mauveBlush: "#C4869A",
  roseGold: "#C17A8A",
  champagneGold: "#D4A84B",
  cream: "#FDF0ED",
};

const BASE_URL = "https://shannons-50th-9yqe.vercel.app";
const HOST_PASSCODE = "favored50host";

const QR_URLS = {
  guestbook: BASE_URL,
  cards: `${BASE_URL}/cards`,
  bingo: `${BASE_URL}/bingo`,
  raffle: `${BASE_URL}/raffle`,
};

function QRCode({ url, label }) {
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(url)}&color=4B1D52&bgcolor=FAF3EE`;
  return (
    <div style={{ background: COLORS.cream, borderRadius: 10, padding: "10px 12px", minWidth: 110, display: "flex", flexDirection: "column", alignItems: "center" }}>
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center" }}>
      <Lock size={28} style={{ color: COLORS.champagneGold, marginBottom: 12 }} />
      <h2 style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontSize: 22, margin: "0 0 8px" }}>Host controls</h2>
      <p style={{ color: COLORS.mauveBlush, fontSize: 13, marginBottom: 20, maxWidth: 280 }}>
        Enter the host passcode to access the raffle draw and guestbook admin.
      </p>
      <input
        type="password"
        placeholder="Passcode"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && attempt()}
        style={{ width: "100%", maxWidth: 280, padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${err ? "#B33A3A" : COLORS.mauveBlush}`, color: COLORS.deepPurple, fontSize: 14, marginBottom: 10, outline: "none" }}
      />
      <button onClick={attempt} style={{ background: COLORS.champagneGold, color: COLORS.deepPurple, border: "none", borderRadius: 999, padding: "10px 28px", fontWeight: 500, fontSize: 14, cursor: "pointer" }}>
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
        {[{ id: "raffle", label: "Raffle Draw" }, { id: "bingo", label: "Bingo" }, { id: "guestbook", label: "Guestbook Admin" }].map((v) => (
          <button key={v.id} onClick={() => setHostView(v.id)} style={{
            flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
            background: hostView === v.id ? COLORS.champagneGold : "rgba(255,255,255,0.1)",
            color: hostView === v.id ? COLORS.deepPurple : COLORS.mauveBlush,
          }}>
            {v.label}
          </button>
        ))}
      </div>
      {hostView === "raffle" ? <RaffleHost embedded /> : hostView === "bingo" ? <BingoHost /> : <Admin embedded />}
    </div>
  );
}

const TABS = [
  { id: "home",      label: "Home",        icon: Crown,        qr: false },
  { id: "guestbook", label: "Guestbook",   icon: BookHeart,    qr: true,  qrLabel: "sign the guestbook" },
  { id: "cards",     label: "Table Games", icon: MessageCircle,qr: true,  qrLabel: "play table games" },
  { id: "bingo",     label: "Bingo",       icon: Grid3x3,      qr: true,  qrLabel: "play birthday bingo" },
  { id: "raffle",    label: "Raffle",      icon: Ticket,       qr: true,  qrLabel: "enter the raffle" },
  { id: "give",      label: "Give",        icon: Heart,        qr: false },
  { id: "host",      label: "Host",        icon: ShieldCheck,  qr: false },

];

export default function Hub() {
  const [activeTab, setActiveTab] = useState("home");
  const [hostUnlocked, setHostUnlocked] = useState(false);  const [liveEntries, setLiveEntries] = useState([]);

  // Fetch recent public entries for the home ticker
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("guestbook_entries")
        .select("name, text")
        .eq("privacy", "public")
        .order("created_at", { ascending: false })
        .limit(20);
      if (data && data.length) setLiveEntries(data);
    };
    fetch();

    const channel = supabase
      .channel("hub_ticker")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "guestbook_entries", filter: "privacy=eq.public" },
        (payload) => setLiveEntries((prev) => [payload.new, ...prev].slice(0, 20))
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const currentTab = TABS.find((t) => t.id === activeTab);

  const CONTENT = {
    home:      <Home liveEntries={liveEntries} />,
    guestbook: <App />,
    cards:     <Cards />,
    bingo:     <Bingo />,
    raffle:    <Raffle />,
    wall:      <Wall />,
    give:      <Give />,
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
      background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
      fontFamily: "'Poppins', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        .tab-bar{display:flex;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none}
        .tab-bar::-webkit-scrollbar{display:none}
        .tab-btn{flex:1;min-width:56px;display:flex;flex-direction:column;align-items:center;gap:2px;padding:8px 4px;border:none;background:transparent;cursor:pointer;transition:all 0.2s;border-bottom:2px solid transparent}
        .tab-btn.active{border-bottom-color:${COLORS.champagneGold}}
        .tab-btn:hover{background:rgba(255,255,255,0.06)}
        .qr-row{display:flex;align-items:center;gap:16px;padding:12px 20px;background:rgba(0,0,0,0.2);border-bottom:1px solid rgba(255,255,255,0.07)}
      `}</style>

      {/* Tab bar */}
      <div style={{ background: "rgba(44,6,64,0.88)", borderBottom: "1px solid rgba(229,193,88,0.2)", backdropFilter: "blur(6px)", position: "sticky", top: 0, zIndex: 30 }}>
        <div className="tab-bar" style={{ maxWidth: 600, margin: "0 auto" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} className={`tab-btn ${isActive ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>
                <Icon size={18} style={{ color: isActive ? COLORS.champagneGold : COLORS.mauveBlush }} strokeWidth={1.5} />
                <span style={{ fontSize: 9, fontWeight: 500, color: isActive ? COLORS.champagneGold : COLORS.mauveBlush, whiteSpace: "nowrap" }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* QR banner — only for tabs that have a QR */}
      {currentTab.qr && (
        <div className="qr-row">
          <QRCode url={QR_URLS[activeTab]} label={currentTab.label.toLowerCase()} />
          <div>
            <p style={{ color: COLORS.champagneGold, fontSize: 13, fontWeight: 500, margin: "0 0 3px" }}>
              {activeTab === "guestbook" ? "Scan to leave a wish or memory" : activeTab === "cards" ? "Scan to play table games" : "Scan to enter the raffle"}
            </p>
            <p style={{ color: COLORS.mauveBlush, fontSize: 11, margin: 0 }}>
              Or hand your phone to a friend — anyone can scan
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {activeTab === "host" ? (
          hostUnlocked ? <HostDashboard /> : <HostGate onUnlock={() => setHostUnlocked(true)} />
        ) : CONTENT[activeTab]}
      </div>
    </div>
  );
}
