import React, { useState, useEffect } from "react";
import { Lock, Globe, Crown } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

// Simple passcode gate so randoms can't browse this page even if they find the URL.
// Change PASSCODE to whatever you like before deploying.
const PASSCODE = "favored50";

export default function Admin() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all"); // all | public | private

  useEffect(() => {
    if (!unlocked) return;
    const fetchAll = async () => {
      const { data, error } = await supabase
        .from("guestbook_entries")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setEntries(data);
    };
    fetchAll();
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ background: COLORS.deepPurple, fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="w-full max-w-sm text-center">
          <Crown size={28} style={{ color: COLORS.champagneGold }} className="mx-auto mb-3" />
          <h1 className="text-2xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream }}>
            Shannon's private view
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

  const filtered = entries.filter((e) => filter === "all" || e.privacy === filter);

  return (
    <div className="min-h-screen p-6" style={{ background: COLORS.deepPurple, fontFamily: "'Poppins', sans-serif" }}>
      <h1 className="text-2xl mb-1" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream }}>
        All guestbook entries
      </h1>
      <p className="text-sm mb-5" style={{ color: COLORS.mauveBlush }}>
        {entries.length} total — {entries.filter((e) => e.privacy === "private").length} private
      </p>

      <div className="flex gap-2 mb-6">
        {["all", "public", "private"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm capitalize"
            style={{
              background: filter === f ? COLORS.champagneGold : "transparent",
              color: filter === f ? COLORS.deepPurple : COLORS.mauveBlush,
              border: `1px solid ${COLORS.roseGold}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-w-2xl">
        {filtered.map((entry) => (
          <div key={entry.id} className="rounded p-4" style={{ background: COLORS.cream }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wide font-semibold" style={{ color: COLORS.plumWine }}>
                {entry.type === "memory" ? "Memory" : "Wish"}
              </span>
              {entry.privacy === "private" ? (
                <Lock size={14} style={{ color: COLORS.roseGold }} />
              ) : (
                <Globe size={14} style={{ color: COLORS.roseGold }} />
              )}
            </div>
            {entry.photo_url && (
              <img src={entry.photo_url} alt="" className="w-full rounded mb-2" style={{ maxHeight: 240, objectFit: "cover" }} />
            )}
            <p className="text-sm mb-2" style={{ color: COLORS.deepPurple }}>
              {entry.text}
            </p>
            <p className="text-xs italic text-right" style={{ color: COLORS.roseGold }}>
              — {entry.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
