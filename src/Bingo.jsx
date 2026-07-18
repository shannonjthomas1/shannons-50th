import React, { useState, useEffect, useRef } from "react";
import { Crown } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#3D0C4E",
  plumWine: "#6B2D6B",
  mauveBlush: "#C4869A",
  roseGold: "#C17A8A",
  champagneGold: "#D4A84B",
  cream: "#FDF0ED",
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
  for (let r = 0; r < 5; r++) {
    if ([0,1,2,3,4].every(c => marked[r][c])) return true;
  }
  for (let c = 0; c < 5; c++) {
    if ([0,1,2,3,4].every(r => marked[r][c])) return true;
  }
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
    Array.from({length:5}, (_,r) => Array.from({length:5}, (_,c) => r===2 && c===2))
  );
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);
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
      setLoading(false);
    };
    fetchCalled();
    const interval = setInterval(fetchCalled, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggle = async (r, c) => {
    if (r===2 && c===2) return;
    const num = card.grid[c][r];
    if (!calledNumbers.includes(num)) return;
    const next = marked.map(row => [...row]);
    next[r][c] = !next[r][c];
    setMarked(next);
    if (checkWin(next)) {
      setWon(true);
      // Save winner to Supabase so host can see it
      await supabase.from("bingo_winners").insert({
        card_id: card.id,
        called_count: calledNumbers.length,
      });
    }
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center",
      padding:"24px 16px 48px",
      background:`linear-gradient(160deg, ${COLORS.deepPurple} 0%, #5C1F5C 40%, #7A2D6E 70%, ${COLORS.deepPurple} 100%)`,
      fontFamily:"'Poppins',sans-serif",
    }}>
      <Crown size={24} style={{ color:COLORS.champagneGold, marginBottom:8 }} strokeWidth={1.5}/>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:COLORS.cream, margin:"0 0 2px", textAlign:"center" }}>
        Birthday Bingo
      </h1>
      <p style={{ fontSize:11, color:COLORS.mauveBlush, margin:"0 0 16px", textAlign:"center" }}>
        Your card ID: <strong style={{ color:COLORS.champagneGold }}>{card.id}</strong>
      </p>

      {/* Last called banner */}
      {lastCalled && (
        <div style={{ background:"rgba(212,168,75,0.15)", border:`1px solid ${COLORS.champagneGold}`, borderRadius:10, padding:"8px 24px", marginBottom:14, textAlign:"center" }}>
          <p style={{ fontSize:10, color:COLORS.mauveBlush, margin:"0 0 2px", textTransform:"uppercase", letterSpacing:"0.15em" }}>Last called</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:COLORS.champagneGold, margin:0 }}>
            {getColLetter(lastCalled)}{lastCalled}
          </p>
        </div>
      )}

      {won && (
        <div style={{ background:COLORS.champagneGold, borderRadius:12, padding:"12px 20px", textAlign:"center", marginBottom:14, width:"100%", maxWidth:380 }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:COLORS.deepPurple, margin:"0 0 2px", fontWeight:700 }}>
            🎉 BINGO! You won!
          </p>
          <p style={{ fontSize:12, color:COLORS.deepPurple, margin:0, fontWeight:600 }}>
            Show this screen to the host — Card ID: <strong>{card.id}</strong>
          </p>
        </div>
      )}

      {loading ? (
        <p style={{ color:COLORS.mauveBlush }}>Waiting for the game to start...</p>
      ) : calledNumbers.length === 0 ? (
        <p style={{ color:COLORS.mauveBlush, fontSize:13, marginBottom:12, textAlign:"center" }}>
          The host hasn't called any numbers yet — get ready!
        </p>
      ) : null}

      {/* Bingo card */}
      <div style={{ width:"100%", maxWidth:380 }}>
        {/* Header row */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4, marginBottom:4 }}>
          {COLUMNS.map(col => (
            <div key={col.letter} style={{
              background:COLORS.champagneGold, borderRadius:8,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"10px 0", fontFamily:"'Playfair Display',serif",
              fontSize:22, fontWeight:700, color:COLORS.deepPurple,
            }}>{col.letter}</div>
          ))}
        </div>

        {/* Grid */}
        {[0,1,2,3,4].map(r => (
          <div key={r} style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:4, marginBottom:4 }}>
            {[0,1,2,3,4].map(c => {
              const isFree = r===2 && c===2;
              const num = card.grid[c][r];
              const isCalled = isFree || calledNumbers.includes(num);
              const isMarked = marked[r][c];
              return (
                <div key={c} onClick={() => toggle(r,c)} style={{
                  aspectRatio:"1", borderRadius:8,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  cursor: isFree ? "default" : isCalled ? "pointer" : "not-allowed",
                  background: isMarked ? COLORS.roseGold : isFree ? COLORS.champagneGold : isCalled ? `${COLORS.champagneGold}22` : "rgba(255,255,255,0.07)",
                  border:`2px solid ${isMarked ? COLORS.roseGold : isFree ? COLORS.champagneGold : isCalled ? COLORS.champagneGold : "rgba(255,255,255,0.1)"}`,
                  transition:"all 0.15s", userSelect:"none",
                }}>
                  {isFree ? (
                    <>
                      <span style={{ fontSize:11, color:COLORS.deepPurple, fontWeight:700 }}>FREE</span>
                      <span style={{ fontSize:9, color:COLORS.deepPurple, fontWeight:700, marginTop:2, letterSpacing:"0.04em" }}>{card.id}</span>
                    </>
                  ) : (
                    <span style={{
                      fontSize:18, fontWeight:600, fontFamily:"'Playfair Display',serif",
                      color: isMarked ? "#fff" : isCalled ? COLORS.champagneGold : COLORS.mauveBlush,
                    }}>{num}</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <p style={{ textAlign:"center", fontSize:11, color:COLORS.mauveBlush, marginTop:8 }}>
          Tap a number to mark it — only called numbers can be marked
        </p>
      </div>
    </div>
  );
}
