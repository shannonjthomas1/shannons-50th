import React, { useState } from "react";
import { Crown, BookHeart, MessageCircle, Ticket, Tv } from "lucide-react";
import App from "./App.jsx";
import Cards from "./Cards.jsx";
import Raffle from "./Raffle.jsx";
import Wall from "./Wall.jsx";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

const TABS = [
  {
    id: "guestbook",
    label: "Guestbook",
    icon: BookHeart,
    desc: "Leave a wish or memory",
    component: App,
  },
  {
    id: "cards",
    label: "Table Games",
    icon: MessageCircle,
    desc: "Icebreakers & trivia",
    component: Cards,
  },
  {
    id: "raffle",
    label: "Raffle",
    icon: Ticket,
    desc: "Get your number",
    component: Raffle,
  },
  {
    id: "wall",
    label: "Live Wall",
    icon: Tv,
    desc: "Watch the wall fill up",
    component: Wall,
  },
];

export default function Hub() {
  const [activeTab, setActiveTab] = useState("guestbook");
  const ActiveComponent = TABS.find((t) => t.id === activeTab).component;

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Cormorant+Garamond:ital,wght@1,500;1,600&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        .tab-bar { display: flex; overflow-x: auto; gap: 0; scrollbar-width: none; -ms-overflow-style: none; }
        .tab-bar::-webkit-scrollbar { display: none; }
        .tab-btn { flex: 1; min-width: 72px; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 10px 8px; border: none; background: transparent; cursor: pointer; transition: all 0.2s; border-bottom: 2px solid transparent; }
        .tab-btn.active { border-bottom-color: ${COLORS.champagneGold}; }
        .tab-btn:hover { background: rgba(255,255,255,0.06); }
        .tab-icon { width: 22px; height: 22px; }
        .tab-label { font-size: 11px; font-weight: 500; white-space: nowrap; }
        .tab-desc { font-size: 10px; white-space: nowrap; }
      `}</style>

      {/* Hero header */}
      <div className="text-center px-6 pt-8 pb-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 0%, ${COLORS.champagneGold}33, transparent 60%)` }} />
        <div className="relative flex justify-center mb-2">
          <Crown size={24} style={{ color: COLORS.champagneGold }} strokeWidth={1.5} />
        </div>
        <p className="relative text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: COLORS.champagneGold }}>
          Honoring Dr. Shannon J. Thomas
        </p>
        <h1
          className="relative text-2xl sm:text-3xl mb-0.5"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
        >
          Favored, Fabulous &amp; Fifty
        </h1>
        <p className="relative text-sm italic" style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.mauveBlush }}>
          July 18, 2026 · Georgia Tech · Cypress Theater
        </p>
      </div>

      {/* Tab bar */}
      <div style={{ background: "rgba(0,0,0,0.25)", borderBottom: `1px solid rgba(255,255,255,0.1)` }}>
        <div className="tab-bar max-w-lg mx-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`tab-btn ${isActive ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon
                  className="tab-icon"
                  style={{ color: isActive ? COLORS.champagneGold : COLORS.mauveBlush }}
                  strokeWidth={1.5}
                />
                <span className="tab-label" style={{ color: isActive ? COLORS.champagneGold : COLORS.mauveBlush }}>
                  {tab.label}
                </span>
                <span className="tab-desc" style={{ color: isActive ? COLORS.mauveBlush : "rgba(199,154,160,0.5)" }}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active page content — rendered inline, no iframe */}
      <div className="flex-1">
        <ActiveComponent />
      </div>
    </div>
  );
}
