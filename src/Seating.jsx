import React, { useState } from "react";
import { Search, MapPin, Users, Crown } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

export default function Seating() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setSearched(false);

    // Search both primary and secondary guest columns
    const { data, error } = await supabase
      .from("seating")
      .select("*")
      .or(
        `primary_guest.ilike.%${q}%,secondary_guest.ilike.%${q}%`
      )
      .order("table_number");

    setResults(error ? [] : data || []);
    setSearched(true);
    setSearching(false);
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-10"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="flex justify-center mb-3">
        <Crown size={26} style={{ color: COLORS.champagneGold }} strokeWidth={1.5} />
      </div>
      <h1
        className="text-3xl sm:text-4xl mb-2 text-center"
        style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
      >
        Find Your Table
      </h1>
      <p className="text-sm mb-8 text-center" style={{ color: COLORS.mauveBlush }}>
        Type your name below to find your seat
      </p>

      {/* Search box */}
      <div className="w-full max-w-md mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your first or last name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 rounded-lg text-sm outline-none"
            style={{ color: COLORS.deepPurple, border: `1.5px solid ${COLORS.mauveBlush}` }}
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-opacity disabled:opacity-50"
            style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}
          >
            <Search size={16} />
            {searching ? "..." : "Find"}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-md space-y-3">
        {searched && results.length === 0 && (
          <div className="text-center py-8">
            <p style={{ color: COLORS.mauveBlush }}>No match found for "{query}"</p>
            <p className="text-xs mt-2" style={{ color: COLORS.roseGold }}>
              Try your last name, or ask a host for help
            </p>
          </div>
        )}

        {results.map((entry) => (
          <div
            key={entry.id}
            className="rounded-lg p-5 shadow-xl"
            style={{ background: COLORS.cream }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: COLORS.plumWine }}>
                  Your table
                </p>
                <p
                  className="text-5xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: COLORS.deepPurple, lineHeight: 1 }}
                >
                  {entry.table_number}
                </p>
              </div>
              <div style={{ background: `${COLORS.roseGold}18`, border: `1px solid ${COLORS.roseGold}`, borderRadius: 8, padding: "6px 12px" }}>
                <p className="text-xs font-medium" style={{ color: COLORS.roseGold }}>{entry.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Users size={14} style={{ color: COLORS.mauveBlush }} />
              <p className="text-sm" style={{ color: COLORS.deepPurple }}>
                {entry.primary_guest}
                {entry.secondary_guest ? ` & ${entry.secondary_guest}` : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <MapPin size={14} style={{ color: COLORS.champagneGold }} />
              <p className="text-xs" style={{ color: COLORS.plumWine }}>
                Party of {entry.party_size} · Look for Table {entry.table_number} sign
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
