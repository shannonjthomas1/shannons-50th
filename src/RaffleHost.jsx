import React, { useState, useEffect } from "react";
import { Crown, Sparkles, Trophy, Users } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

// Same passcode pattern as the guestbook admin page.
// Change this before deploying, and feel free to make it different from
// the guestbook passcode if you want them separate.
const PASSCODE = "favored50draw";

export default function RaffleHost() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [justDrawn, setJustDrawn] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("raffle_entries")
      .select("*")
      .order("number", { ascending: true });
    if (!error && data) setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!unlocked) return;
    fetchEntries();

    const channel = supabase
      .channel("raffle_entries_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "raffle_entries" }, fetchEntries)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [unlocked]);

  const drawWinner = async () => {
    const eligible = entries.filter((e) => !e.is_winner);
    if (eligible.length === 0) {
      alert("Everyone who has a number has already won something!");
      return;
    }
    setDrawing(true);
    setJustDrawn(null);

    // Brief suspense before revealing — feels more like an actual draw
    setTimeout(async () => {
      const winner = eligible[Math.floor(Math.random() * eligible.length)];
      const { error } = await supabase
        .from("raffle_entries")
        .update({ is_winner: true, won_at: new Date().toISOString() })
        .eq("id", winner.id);
      if (error) {
        console.error("Error marking winner:", error);
      }
      setJustDrawn(winner);
      setDrawing(false);
      fetchEntries();
    }, 1400);
  };

  if (!unlocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: COLORS.deepPurple, fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="w-full max-w-sm text-center">
          <Crown size={28} style={{ color: COLORS.champagneGold }} className="mx-auto mb-3" />
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream }}>
            Raffle host controls
          </h1>
          <input
            type="password"
            placeholder="Enter passcode"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input === PASSCODE && setUnlocked(true)}
            className="w-full px-4 py-3 rounded mb-3 outline-none"
            style={{ color: COLORS.deepPurple }}
          />
          <button
            onClick={() => setUnlocked(input === PASSCODE)}
            className="w-full py-3 rounded-full text-sm font-medium"
            style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  const totalEntries = entries.length;
  const winnersCount = entries.filter((e) => e.is_winner).length;

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-10"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Crown size={22} style={{ color: COLORS.champagneGold }} />
        <h1 className="text-2xl" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream }}>
          Raffle Draw — Host
        </h1>
      </div>
      <p className="text-sm mb-8 flex items-center gap-1.5" style={{ color: COLORS.mauveBlush }}>
        <Users size={14} /> {totalEntries} entered · {winnersCount} winners drawn
      </p>

      {/* Winner reveal */}
      <div className="w-full max-w-md mb-8">
        {drawing ? (
          <div className="rounded-lg p-10 text-center shadow-2xl" style={{ background: COLORS.cream }}>
            <Sparkles size={32} style={{ color: COLORS.roseGold }} className="mx-auto mb-3 animate-pulse" />
            <p className="text-xl" style={{ color: COLORS.deepPurple, fontFamily: "'Playfair Display', serif" }}>
              Drawing...
            </p>
          </div>
        ) : justDrawn ? (
          <div className="rounded-lg p-10 text-center shadow-2xl" style={{ background: COLORS.cream }}>
            <Trophy size={32} style={{ color: COLORS.champagneGold }} className="mx-auto mb-3" />
            <p className="text-sm mb-2" style={{ color: COLORS.plumWine }}>
              Winning number
            </p>
            <p
              className="text-7xl font-bold mb-3"
              style={{ color: COLORS.deepPurple, fontFamily: "'Playfair Display', serif" }}
            >
              {justDrawn.number}
            </p>
            <p className="text-2xl" style={{ color: COLORS.roseGold, fontFamily: "'Cormorant Garamond', serif" }}>
              {justDrawn.name}
            </p>
          </div>
        ) : (
          <div className="rounded-lg p-10 text-center shadow-2xl" style={{ background: COLORS.cream }}>
            <p style={{ color: COLORS.mauveBlush }}>Tap below to draw a winner</p>
          </div>
        )}
      </div>

      <button
        onClick={drawWinner}
        disabled={drawing || loading}
        className="px-8 py-4 rounded-full text-base font-semibold transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 mb-10"
        style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}
      >
        {drawing ? "Drawing..." : "Draw Winner"}
      </button>

      {/* Full entry list */}
      <div className="w-full max-w-md">
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color: COLORS.champagneGold }}>
          All entries
        </p>
        <div className="rounded-lg overflow-hidden" style={{ background: COLORS.cream, maxHeight: 320, overflowY: "auto" }}>
          {loading ? (
            <p className="p-4 text-sm" style={{ color: COLORS.plumWine }}>
              Loading...
            </p>
          ) : entries.length === 0 ? (
            <p className="p-4 text-sm" style={{ color: COLORS.plumWine }}>
              No one has entered yet.
            </p>
          ) : (
            entries.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0"
                style={{ borderColor: "#EFE5E0" }}
              >
                <span className="text-sm font-medium" style={{ color: COLORS.deepPurple }}>
                  #{e.number} — {e.name}
                </span>
                {e.is_winner && (
                  <span className="text-xs flex items-center gap-1" style={{ color: COLORS.roseGold }}>
                    <Trophy size={12} /> Won
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
