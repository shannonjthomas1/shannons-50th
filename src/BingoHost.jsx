import React, { useState, useEffect, useRef } from "react";
import { Trophy } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#3D0C4E", plumWine: "#6B2D6B", mauveBlush: "#C4869A",
  roseGold: "#C17A8A", champagneGold: "#D4A84B", cream: "#FDF0ED",
};

const COLUMNS = [
  { letter: "B", min: 1,  max: 10 }, { letter: "I", min: 11, max: 20 },
  { letter: "N", min: 21, max: 30 }, { letter: "G", min: 31, max: 40 },
  { letter: "O", min: 41, max: 50 },
];

function getColLetter(n) { return COLUMNS.find(c => n >= c.min && n <= c.max)?.letter || ""; }
const ALL_NUMBERS = COLUMNS.flatMap(({ min, max }) => { const a = []; for (let n = min; n <= max; n++) a.push(n); return a; });
function shuffle(arr) { const a = [...arr]; for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

export default function BingoHost() {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [lastCalled, setLastCalled] = useState(null);
  const [calling, setCalling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winners, setWinners] = useState([]);
  const shuffledRef = useRef(shuffle(ALL_NUMBERS));

  const fetchAll = async () => {
    const [callsRes, winnersRes] = await Promise.all([
      supabase.from("bingo_calls").select("number").order("created_at", { ascending: true }),
      supabase.from("bingo_winners").select("*").order("created_at", { ascending: false }),
    ]);
    if (callsRes.data) {
      const nums = callsRes.data.map(d => d.number);
      setCalledNumbers(nums);
      if (nums.length) setLastCalled(nums[nums.length-1]);
      if (nums.length >= ALL_NUMBERS.length) setGameOver(true);
    }
    if (winnersRes.data) setWinners(winnersRes.data);
  };

  useEffect(() => {
    fetchAll();
    // Poll for new winners every 3 seconds
    const interval = setInterval(fetchAll, 3000);
    return () => clearInterval(interval);
  }, []);

  const callNext = async () => {
    const remaining = shuffledRef.current.filter(n => !calledNumbers.includes(n));
    if (!remaining.length) { setGameOver(true); return; }
    setCalling(true);
    const next = remaining[0];
    await supabase.from("bingo_calls").insert({ number: next });
    setCalledNumbers(prev => [...prev, next]);
    setLastCalled(next);
    if (remaining.length === 1) setGameOver(true);
    setCalling(false);
  };

  const resetGame = async () => {
    await Promise.all([
      supabase.from("bingo_calls").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
      supabase.from("bingo_winners").delete().neq("id", "00000000-0000-0000-0000-000000000000"),
    ]);
    shuffledRef.current = shuffle(ALL_NUMBERS);
    setCalledNumbers([]); setLastCalled(null); setGameOver(false); setWinners([]);
  };

  return (
    <div style={{ padding: "16px", maxWidth: 480, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
      <p style={{ fontSize: 11, color: COLORS.champagneGold, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 16 }}>
        Bingo — Host Controls
      </p>

      {/* Winners banner */}
      {winners.length > 0 && (
        <div style={{ background: COLORS.champagneGold, borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Trophy size={18} style={{ color: COLORS.deepPurple }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.deepPurple, margin: 0 }}>
              🎉 {winners.length === 1 ? "Winner!" : `${winners.length} Winners!`}
            </p>
          </div>
          {winners.map((w, i) => (
            <div key={i} style={{ background: "rgba(61,12,78,0.15)", borderRadius: 8, padding: "8px 12px", marginBottom: i < winners.length-1 ? 6 : 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.deepPurple, margin: "0 0 2px", fontFamily: "'Playfair Display', serif" }}>
                Card ID: {w.card_id}
              </p>
              <p style={{ fontSize: 11, color: COLORS.deepPurple, margin: 0 }}>
                Won after {w.called_count} numbers called
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Last called big display */}
      <div style={{ textAlign: "center", background: "rgba(0,0,0,0.2)", borderRadius: 12, padding: "20px 16px", marginBottom: 16 }}>
        {lastCalled ? (
          <>
            <p style={{ fontSize: 10, color: COLORS.mauveBlush, textTransform: "uppercase", letterSpacing: "0.2em", margin: "0 0 4px" }}>Last called</p>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(48px,12vw,72px)", fontWeight: 700, color: COLORS.champagneGold, margin: 0, lineHeight: 1 }}>
              {getColLetter(lastCalled)}{lastCalled}
            </p>
          </>
        ) : (
          <p style={{ color: COLORS.mauveBlush, fontSize: 14, margin: 0 }}>No numbers called — tap below to start!</p>
        )}
      </div>

      {!gameOver ? (
        <button onClick={callNext} disabled={calling} style={{ width: "100%", padding: "16px 0", borderRadius: 999, border: "none", background: COLORS.champagneGold, color: COLORS.deepPurple, fontSize: "clamp(14px,4vw,16px)", fontWeight: 600, cursor: "pointer", marginBottom: 12, opacity: calling ? 0.7 : 1 }}>
          {calling ? "Calling..." : `Call Next Number (${ALL_NUMBERS.length - calledNumbers.length} left)`}
        </button>
      ) : (
        <p style={{ textAlign: "center", color: COLORS.champagneGold, fontWeight: 600, marginBottom: 12 }}>All 50 numbers called!</p>
      )}

      <button onClick={resetGame} style={{ width: "100%", padding: "10px 0", borderRadius: 999, border: `1px solid ${COLORS.roseGold}`, background: "transparent", color: COLORS.roseGold, fontSize: 13, fontWeight: 500, cursor: "pointer", marginBottom: 20 }}>
        Reset Game (New Round)
      </button>

      {/* Called numbers list */}
      {calledNumbers.length > 0 && (
        <div>
          <p style={{ fontSize: 11, color: COLORS.mauveBlush, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>
            Called ({calledNumbers.length})
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {calledNumbers.map(n => (
              <div key={n} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 500, color: COLORS.cream }}>
                {getColLetter(n)}{n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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

function getColLetter(n) {
  return COLUMNS.find(c => n >= c.min && n <= c.max)?.letter || "";
}

const ALL_NUMBERS = COLUMNS.flatMap(({ min, max }) => {
  const nums = [];
  for (let n = min; n <= max; n++) nums.push(n);
  return nums;
});

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function BingoHost() {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [lastCalled, setLastCalled] = useState(null);
  const [calling, setCalling] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const shuffledRef = useRef(shuffle(ALL_NUMBERS));

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("bingo_calls")
        .select("number")
        .order("created_at", { ascending: true });
      if (data) {
        const nums = data.map(d => d.number);
        setCalledNumbers(nums);
        if (nums.length) setLastCalled(nums[nums.length - 1]);
        if (nums.length >= ALL_NUMBERS.length) setGameOver(true);
      }
    };
    fetch();
  }, []);

  const callNext = async () => {
    const remaining = shuffledRef.current.filter(n => !calledNumbers.includes(n));
    if (remaining.length === 0) { setGameOver(true); return; }
    setCalling(true);
    const next = remaining[0];
    await supabase.from("bingo_calls").insert({ number: next });
    setCalledNumbers(prev => [...prev, next]);
    setLastCalled(next);
    if (remaining.length === 1) setGameOver(true);
    setCalling(false);
  };

  const resetGame = async () => {
    await supabase.from("bingo_calls").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    shuffledRef.current = shuffle(ALL_NUMBERS);
    setCalledNumbers([]);
    setLastCalled(null);
    setGameOver(false);
  };

  return (
    <div style={{ padding:"16px" }}>
      <p style={{ fontSize:11, color:COLORS.champagneGold, textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:16 }}>
        Bingo — Host Controls
      </p>

      {/* Big display */}
      <div style={{ textAlign:"center", background:"rgba(0,0,0,0.2)", borderRadius:12, padding:"20px 16px", marginBottom:16 }}>
        {lastCalled ? (
          <>
            <p style={{ fontSize:10, color:COLORS.mauveBlush, textTransform:"uppercase", letterSpacing:"0.2em", margin:"0 0 4px" }}>Last called</p>
            <p style={{ fontFamily:"'Playfair Display',serif", fontSize:72, fontWeight:700, color:COLORS.champagneGold, margin:0, lineHeight:1 }}>
              {getColLetter(lastCalled)}{lastCalled}
            </p>
          </>
        ) : (
          <p style={{ color:COLORS.mauveBlush, fontSize:14, margin:0 }}>
            No numbers called — tap below to start!
          </p>
        )}
      </div>

      {/* Call button */}
      {!gameOver ? (
        <button
          onClick={callNext}
          disabled={calling}
          style={{
            width:"100%", padding:"16px 0", borderRadius:999, border:"none",
            background: COLORS.champagneGold, color:COLORS.deepPurple,
            fontSize:16, fontWeight:600, cursor:"pointer", marginBottom:12,
            opacity: calling ? 0.7 : 1,
          }}
        >
          {calling ? "Calling..." : `Call Next Number (${ALL_NUMBERS.length - calledNumbers.length} left)`}
        </button>
      ) : (
        <p style={{ textAlign:"center", color:COLORS.champagneGold, fontWeight:600, marginBottom:12 }}>
          All 50 numbers called!
        </p>
      )}

      {/* Reset */}
      <button
        onClick={resetGame}
        style={{
          width:"100%", padding:"10px 0", borderRadius:999, border:`1px solid ${COLORS.roseGold}`,
          background:"transparent", color:COLORS.roseGold,
          fontSize:13, fontWeight:500, cursor:"pointer", marginBottom:20,
        }}
      >
        Reset Game (New Round)
      </button>

      {/* Called numbers */}
      {calledNumbers.length > 0 && (
        <div>
          <p style={{ fontSize:11, color:COLORS.mauveBlush, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:10 }}>
            Called ({calledNumbers.length})
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {calledNumbers.map(n => (
              <div key={n} style={{
                background:"rgba(255,255,255,0.08)", borderRadius:6,
                padding:"4px 10px", fontSize:13, fontWeight:500, color:COLORS.cream,
              }}>
                {getColLetter(n)}{n}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
