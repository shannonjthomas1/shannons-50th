import React, { useState, useEffect, useRef } from "react";
import { Crown, Heart, Sparkles } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#3D0C4E",
  plumWine: "#6B2D6B",
  mauveBlush: "#C4869A",
  roseGold: "#C17A8A",
  champagneGold: "#D4A84B",
  cream: "#FDF0ED",
};

const BG_TILTS = [-4, 3, -2, 4, -3, 2, -2.5, 3.5, -1.5, 2.5];

function SpotlightCard({ entry, visible }) {
  return (
    <div
      className="rounded-md p-8 pb-9 shadow-2xl"
      style={{
        background: COLORS.cream,
        width: "min(640px, 80vw)",
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) translateY(0)" : "scale(0.93) translateY(16px)",
      }}
    >
      {entry.photo_url && (
        <div className="mb-5 -mx-2 -mt-2 overflow-hidden rounded-sm border-8" style={{ borderColor: COLORS.cream }}>
          <img src={entry.photo_url} alt="" className="w-full object-cover" style={{ maxHeight: 380 }} />
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        {entry.type === "memory" ? (
          <Sparkles size={20} style={{ color: COLORS.roseGold }} />
        ) : (
          <Heart size={20} style={{ color: COLORS.roseGold }} />
        )}
        <p className="text-sm uppercase tracking-[0.2em] font-semibold" style={{ color: COLORS.plumWine }}>
          {entry.type === "memory" ? "A memory" : "A wish"}
        </p>
      </div>
      <p className="text-3xl leading-snug mb-4" style={{ color: COLORS.deepPurple, fontFamily: "'Playfair Display', serif" }}>
        {entry.text}
      </p>
      <p className="text-right text-xl italic" style={{ color: COLORS.roseGold, fontFamily: "'Cormorant Garamond', serif" }}>
        — {entry.name || "Anonymous"}
      </p>
    </div>
  );
}

function BackgroundCard({ entry, tilt, position }) {
  return (
    <div
      className="absolute rounded-sm shadow-lg p-3 transition-all duration-700 ease-out"
      style={{
        background: COLORS.cream,
        width: 180,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${tilt}deg) scale(0.9)`,
        opacity: 0.45,
        boxShadow: "0 8px 24px -8px rgba(0,0,0,0.4)",
      }}
    >
      {entry.photo_url && (
        <div className="mb-2 overflow-hidden rounded-sm">
          <img src={entry.photo_url} alt="" className="w-full object-cover" style={{ height: 90 }} />
        </div>
      )}
      <p className="text-[11px] leading-snug line-clamp-3" style={{ color: COLORS.deepPurple, fontFamily: "'Poppins', sans-serif" }}>
        {entry.text}
      </p>
      <p className="text-[10px] italic text-right mt-1" style={{ color: COLORS.roseGold }}>
        — {entry.name || "Anonymous"}
      </p>
    </div>
  );
}

function generatePositions(count) {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / Math.max(count, 1)) * Math.PI * 2 + i * 0.7;
    const radiusX = 38 + (i % 3) * 6;
    const radiusY = 36 + (i % 4) * 5;
    positions.push({ x: Math.cos(angle) * radiusX * 10, y: Math.sin(angle) * radiusY * 8 });
  }
  return positions;
}

export default function Wall() {
  const [entries, setEntries] = useState([]);
  const [spotlightEntry, setSpotlightEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const queueRef = useRef([]);
  const showingRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("privacy", "public")
        .order("created_at", { ascending: false })
        .limit(30);
      if (mounted && !error && data) {
        setEntries(data);
        if (data.length > 0) setSpotlightEntry(data[0]);
      }
      setLoading(false);
    };

    fetchEntries();

    const processQueue = () => {
      if (showingRef.current || queueRef.current.length === 0) return;
      showingRef.current = true;
      const next = queueRef.current.shift();
      setSpotlightEntry(next);
      setEntries((prev) => [next, ...prev].slice(0, 30));
      setTimeout(() => {
        showingRef.current = false;
        processQueue();
      }, 6000);
    };

    const channel = supabase
      .channel("wall_entries_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook_entries", filter: "privacy=eq.public" },
        (payload) => {
          queueRef.current.push(payload.new);
          processQueue();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const backgroundEntries = entries.filter((e) => e.id !== spotlightEntry?.id).slice(0, 10);
  const positions = generatePositions(backgroundEntries.length);

  return (
    <div
      className="min-h-screen w-full overflow-hidden relative flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        @keyframes spotlightIn {
          0% { opacity: 0; transform: scale(0.85) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-spotlight-in {
          animation: spotlightIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Title bar */}
      <div className="absolute top-8 left-0 right-0 flex flex-col items-center z-20">
        <div className="flex items-center gap-2 mb-1">
          <Crown size={22} style={{ color: COLORS.champagneGold }} />
          <p
            className="text-xl sm:text-2xl"
            style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
          >
            Favored, Fabulous &amp; Fifty
          </p>
        </div>
        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: COLORS.champagneGold }}>
          Live from the guestbook
        </p>
      </div>

      {/* Ambient background cards */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {backgroundEntries.map((entry, i) => (
          <BackgroundCard key={entry.id} entry={entry} tilt={BG_TILTS[i % BG_TILTS.length]} position={positions[i]} />
        ))}
      </div>

      {/* Spotlight */}
      <div className="relative z-10 flex items-center justify-center">
        {loading ? (
          <p style={{ color: COLORS.mauveBlush }} className="text-lg">
            Waiting for the first entry...
          </p>
        ) : spotlightEntry ? (
          <SpotlightCard key={spotlightEntry.id} entry={spotlightEntry} />
        ) : (
          <div className="text-center">
            <p className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream }}>
              The wall is waiting
            </p>
            <p style={{ color: COLORS.mauveBlush }}>Scan the QR code to leave the first wish or memory.</p>
          </div>
        )}
      </div>
    </div>
  );
}
