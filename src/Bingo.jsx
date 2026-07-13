import React, { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#3D0C4E", plumWine: "#6B2D6B", mauveBlush: "#C4869A",
  roseGold: "#C17A8A", champagneGold: "#D4A84B", cream: "#FDF0ED",
};

const COLUMNS = [
  { letter: "B", min: 1,  max: 10 },
  { letter: "I", min: 11, max: 20 },
  { letter: "N", min: 21, max: 30 },
  { letter: "G", min: 31, max: 40 },
  { letter: "O", min: 41, max: 50 },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateCard() {
  const grid = COLUMNS.map(({ min, max }) => {
    const nums = [];
    for (let n = min; n <= max; n++) nums.push(n);
    return shuffle(nums).slice(0, 5);
  });
  const id = Math.random().toString(36).slice(2, 8).toUpperCase();
  return { grid, id };
}

function checkWin(marked) {
  for (let r = 0; r < 5; r++) if ([0,1,2,3,4].every(c => marked[r][c])) return true;
  for (let c = 0; c < 5; c++) if ([0,1,2,3,4].every(r => marked[r][c])) return true;
  if ([0,1,2,3,4].every(i => marked[i][i])) return true;
  if ([0,1,2,3,4].every(i => marked[i][4-i])) return true;
  return false;
}

function getColLetter(n) {
  return COLUMNS.find(c => n >= c.min && n <= c.max)?.letter || "";
}

export default function Bingo() {
  const [card] = useState(() => generateCard());
  const [marked, setMarked] = useState(() =>
    Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => r === 2 && c === 2))
  );
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [won, setWon] = useState(false);
  const [lastCalled, setLastCalled] = useState(null);

  // Poll Supabase for called numbers every 3 seconds
  useEffect(() => {
    const fetchCalled = async () => {
      const { data } = await supabase
        .from("bingo_calls")
        .select("number")
        .order("created_at", { ascending: true });
      if (data) {
        const nums = data.map(d => d.number);
        setCalledNumbers(nums);
        if (nums.length) setLastCalled(nums[nums.length - 1]);
      }
    };
    fetchCalled();
    const interval = setInterval(fetchCalled, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggle = (r, c) => {
    if (r === 2 && c === 2) return; // free space — always marked
    const num = card.grid[c][r];
    // Only allow marking numbers that have been called
    if (!calledNumbers.includes(num)) return;
    const next = marked.map(row => [...row]);
    next[r][c] = !next[r][c];
    setMarked(next);
    if (checkWin(next)) setWon(true);
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", overflowX: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "clamp(16px,4vw,24px) clamp(12px,4vw,16px) 48px",
      background: `linear-gradient(160deg, ${COLORS.deepPurple} 0%, #5C1F5C 40%, #7A2D6E 70%, ${COLORS.deepPurple} 100%)`,
      fontFamily: "'Poppins', sans-serif",
    }}>
      <style>{`
        .bingo-cell {
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .bingo-cell:active { transform: scale(0.92); }
        .bingo-cell.tappable { cursor: pointer; }
        .bingo-cell.not-called { cursor: not-allowed; opacity: 0.5; }
      `}</style>

      <Crown size={24} style={{ color: COLORS.champagneGold, marginBottom: 8 }} strokeWidth={1.5} />
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px,5vw,28px)", fontWeight: 700, color: COLORS.cream, margin: "0 0 2px", textAlign: "center" }}>
        Birthday Bingo
      </h1>
      <p style={{ fontSize: 11, color: COLORS.mauveBlush, margin: "0 0 16px", textAlign: "center" }}>
        Card ID: <strong style={{ color: COLORS.champagneGold }}>{card.id}</strong>
      </p>

      {/* Last called banner */}
      {lastCalled ? (
        <div style={{ background: "rgba(212,168,75,0.15)", border: `1px solid ${COLORS.champagneGold}`, borderRadius: 10, padding: "8px 24px", marginBottom: 14, textAlign: "center" }}>
          <p style={{ fontSize: 10, color: COLORS.mauveBlush, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.15em" }}>Last called</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,8vw,36px)", fontWeight: 700, color: COLORS.champagneGold, margin: 0 }}>
            {getColLetter(lastCalled)}{lastCalled}
          </p>
        </div>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 20px", marginBottom: 14, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: COLORS.mauveBlush, margin: 0 }}>
            Waiting for the host to call numbers...
          </p>
          <p style={{ fontSize: 11, color: "rgba(196,134,154,0.6)", margin: "4px 0 0" }}>
            Numbers will light up gold when called — tap to mark them!
          </p>
        </div>
      )}

      {/* Win banner */}
      {won && (
        <div style={{ background: COLORS.champagneGold, borderRadius: 12, padding: "12px 20px", textAlign: "center", marginBottom: 14, width: "100%", maxWidth: "min(380px,100%)" }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(18px,5vw,22px)", color: COLORS.deepPurple, margin: "0 0 2px", fontWeight: 700 }}>
            🎉 BINGO! You won!
          </p>
          <p style={{ fontSize: 12, color: COLORS.deepPurple, margin: 0, fontWeight: 600 }}>
            Show this screen to the host — Card ID: <strong>{card.id}</strong>
          </p>
        </div>
      )}

      {/* Bingo card */}
      <div style={{ width: "100%", maxWidth: "min(380px,100%)" }}>

        {/* BINGO header */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 4, marginBottom: 4 }}>
          {COLUMNS.map(col => (
            <div key={col.letter} style={{
              background: COLORS.champagneGold, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "clamp(6px,2vw,10px) 0",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(16px,5vw,22px)", fontWeight: 700, color: COLORS.deepPurple,
            }}>{col.letter}</div>
          ))}
        </div>

        {/* Grid rows */}
        {[0, 1, 2, 3, 4].map(r => (
          <div key={r} style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(0,1fr))", gap: 4, marginBottom: 4 }}>
            {[0, 1, 2, 3, 4].map(c => {
              const isFree = r === 2 && c === 2;
              const num = card.grid[c][r];
              const isCalled = isFree || calledNumbers.includes(num);
              const isMarked = marked[r][c];

              let bg, border, color;
              if (isMarked) {
                bg = COLORS.roseGold;
                border = COLORS.roseGold;
                color = "#fff";
              } else if (isFree) {
                bg = COLORS.champagneGold;
                border = COLORS.champagneGold;
                color = COLORS.deepPurple;
              } else if (isCalled) {
                bg = "rgba(212,168,75,0.18)";
                border = COLORS.champagneGold;
                color = COLORS.champagneGold;
              } else {
                bg = "rgba(255,255,255,0.06)";
                border = "rgba(255,255,255,0.12)";
                color = COLORS.mauveBlush;
              }

              return (
                <div
                  key={c}
                  className={`bingo-cell ${isFree ? "" : isCalled ? "tappable" : "not-called"}`}
                  onClick={() => toggle(r, c)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: bg,
                    border: `2px solid ${border}`,
                  }}
                >
                  {isFree ? (
                    <>
                      <span style={{ fontSize: "clamp(9px,2.5vw,11px)", color: COLORS.deepPurple, fontWeight: 700 }}>FREE</span>
                      <span style={{ fontSize: "clamp(7px,2vw,9px)", color: COLORS.deepPurple, fontWeight: 700, marginTop: 2, letterSpacing: "0.04em" }}>{card.id}</span>
                    </>
                  ) : (
                    <span style={{
                      fontSize: "clamp(13px,4vw,18px)",
                      fontWeight: 600,
                      fontFamily: "'Playfair Display', serif",
                      color,
                    }}>{num}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Legend */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(212,168,75,0.18)", border: `2px solid ${COLORS.champagneGold}` }} />
            <span style={{ fontSize: 11, color: COLORS.mauveBlush }}>Called — tap to mark</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: COLORS.roseGold, border: `2px solid ${COLORS.roseGold}` }} />
            <span style={{ fontSize: 11, color: COLORS.mauveBlush }}>Marked — tap to unmark</span>
          </div>
        </div>
      </div>
    </div>
  );
}
