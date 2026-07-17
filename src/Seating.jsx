import React, { useState } from "react";
import { Crown, Search, MapPin, Users } from "lucide-react";

const COLORS = {
  deepPurple: "#3D0C4E", plumWine: "#6B2D6B", mauveBlush: "#C4869A",
  roseGold: "#C17A8A", champagneGold: "#D4A84B", cream: "#FDF0ED",
};

const SEATING_DATA = [
  { name: 'Victoria Thomas', party: 'Victoria Thomas & Cameron Jackman', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Cameron Jackman', party: 'Victoria Thomas & Cameron Jackman', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Cindy Thomas', party: 'Cindy Thomas & Larry Thomas Sr.', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Larry Thomas Sr.', party: 'Cindy Thomas & Larry Thomas Sr.', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Shannon Thomas (Host)', party: 'Shannon Thomas (Host)', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Larry Thomas Jr.', party: 'Larry Thomas Jr. & Caleb Thomas', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Caleb Thomas', party: 'Larry Thomas Jr. & Caleb Thomas', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Larilyn Robinson', party: 'Larilyn Robinson', table: 1, tableName: 'Thomas Family (Host Table)' },
  { name: 'Ramon Metts', party: 'Ramon Metts', table: 2, tableName: 'Metts Family' },
  { name: 'Kim Angeletta', party: 'Kim Angeletta', table: 2, tableName: 'Metts Family' },
  { name: 'Tamara Metts', party: 'Tamara Metts', table: 2, tableName: 'Metts Family' },
  { name: 'Candace Metts', party: 'Candace Metts', table: 2, tableName: 'Metts Family' },
  { name: 'Rashanna Metts', party: 'Rashanna Metts', table: 2, tableName: 'Metts Family' },
  { name: 'Kiera Metts', party: 'Kiera Metts & Torrie Burke', table: 2, tableName: 'Metts Family' },
  { name: 'Torrie Burke', party: 'Kiera Metts & Torrie Burke', table: 2, tableName: 'Metts Family' },
  { name: 'Sekita Reaves', party: 'Sekita Reaves & Semari Reaves', table: 3, tableName: 'Metts / Family' },
  { name: 'Semari Reaves', party: 'Sekita Reaves & Semari Reaves', table: 3, tableName: 'Metts / Family' },
  { name: 'Tasha Riggins', party: 'Tasha Riggins & Antwone Riggins', table: 3, tableName: 'Metts / Family' },
  { name: 'Antwone Riggins', party: 'Tasha Riggins & Antwone Riggins', table: 3, tableName: 'Metts / Family' },
  { name: 'Tasha Metts', party: 'Tasha Metts', table: 3, tableName: 'Metts / Family' },
  { name: 'Courtney Harvey', party: 'Courtney Harvey & Alex Harvey', table: 3, tableName: 'Metts / Family' },
  { name: 'Alex Harvey', party: 'Courtney Harvey & Alex Harvey', table: 3, tableName: 'Metts / Family' },
  { name: 'Raven Symone', party: 'Raven Symone', table: 3, tableName: 'Metts / Family' },
  { name: 'Betty Brown', party: 'Betty Brown & Verna Burney', table: 4, tableName: 'Church' },
  { name: 'Verna Burney', party: 'Betty Brown & Verna Burney', table: 4, tableName: 'Church' },
  { name: 'Sherica Thomas', party: 'Sherica Thomas & Jimmy Thomas', table: 4, tableName: 'Church' },
  { name: 'Jimmy Thomas', party: 'Sherica Thomas & Jimmy Thomas', table: 4, tableName: 'Church' },
  { name: 'Tiffany Gardner', party: 'Tiffany Gardner', table: 4, tableName: 'Church' },
  { name: 'Colrie Coleman', party: 'Colrie Coleman & Reba Ricks', table: 4, tableName: 'Church' },
  { name: 'Reba Ricks', party: 'Colrie Coleman & Reba Ricks', table: 4, tableName: 'Church' },
  { name: 'Juerita Barriere', party: 'Juerita Barriere', table: 4, tableName: 'Church' },
  { name: 'Schantel Mitchell', party: 'Schantel Mitchell', table: 5, tableName: 'Professional' },
  { name: 'Anthony Jenkins', party: 'Anthony Jenkins', table: 5, tableName: 'Professional' },
  { name: 'Jennifer Myles', party: 'Jennifer Myles', table: 5, tableName: 'Professional' },
  { name: 'Tiffany Sylve', party: 'Tiffany Sylve & Brandon Sylve', table: 5, tableName: 'Professional' },
  { name: 'Brandon Sylve', party: 'Tiffany Sylve & Brandon Sylve', table: 5, tableName: 'Professional' },
  { name: 'Thy Tran', party: 'Thy Tran', table: 5, tableName: 'Professional' },
  { name: 'Tiffany Ezeokonkwo', party: 'Tiffany Ezeokonkwo', table: 5, tableName: 'Professional' },
  { name: 'Roger Simms', party: 'Roger Simms', table: 5, tableName: 'Professional' },
  { name: 'India Jackson', party: 'India Jackson & Larry Cornelius', table: 6, tableName: 'Soror' },
  { name: 'Larry Cornelius', party: 'India Jackson & Larry Cornelius', table: 6, tableName: 'Soror' },
  { name: 'Shereka Wilson', party: 'Shereka Wilson', table: 6, tableName: 'Soror' },
  { name: 'Derek Hardy', party: 'Derek Hardy & Krystl Hardy', table: 6, tableName: 'Soror' },
  { name: 'Krystl Hardy', party: 'Derek Hardy & Krystl Hardy', table: 6, tableName: 'Soror' },
  { name: 'Janise Campbell Baity', party: 'Janise Campbell Baity & Godfrey Baity', table: 6, tableName: 'Soror' },
  { name: 'Godfrey Baity', party: 'Janise Campbell Baity & Godfrey Baity', table: 6, tableName: 'Soror' },
  { name: 'Marcia Teemer', party: 'Marcia Teemer', table: 6, tableName: 'Soror' },
  { name: 'Brina Cochran', party: 'Brina Cochran', table: 7, tableName: 'Friends' },
  { name: 'Ashley Jackson', party: 'Ashley Jackson', table: 7, tableName: 'Friends' },
  { name: 'Zan Cooley', party: 'Zan Cooley & Jeff Cooley', table: 7, tableName: 'Friends' },
  { name: 'Jeff Cooley', party: 'Zan Cooley & Jeff Cooley', table: 7, tableName: 'Friends' },
  { name: 'Courtney Davis', party: 'Courtney Davis & Rashard Morris', table: 7, tableName: 'Friends' },
  { name: 'Rashard Morris', party: 'Courtney Davis & Rashard Morris', table: 7, tableName: 'Friends' },
  { name: 'Stephanie Givhan', party: 'Stephanie Givhan & Reagan Givhan', table: 7, tableName: 'Friends' },
  { name: 'Reagan Givhan', party: 'Stephanie Givhan & Reagan Givhan', table: 7, tableName: 'Friends' },
  { name: 'Beverly Rushin', party: 'Beverly Rushin & Marcus Rushin', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Marcus Rushin', party: 'Beverly Rushin & Marcus Rushin', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Tonya Clinton', party: 'Tonya Clinton & Zerric Clinton', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Zerric Clinton', party: 'Tonya Clinton & Zerric Clinton', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Dr. Erica Pike', party: 'Dr. Erica Pike', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Danielle Smith', party: 'Danielle Smith & Mervan Smith', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Mervan Smith', party: 'Danielle Smith & Mervan Smith', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Sheila McGhee', party: 'Sheila McGhee', table: 8, tableName: 'Mixed Overflow (Church/Family/Friends)' },
  { name: 'Uwanna Smith', party: 'Uwanna Smith & Calvin Blackburn', table: 9, tableName: 'Professional Overflow' },
  { name: 'Calvin Blackburn', party: 'Uwanna Smith & Calvin Blackburn', table: 9, tableName: 'Professional Overflow' },
  { name: 'Ausha', party: 'Ausha & Jeffery Jackson', table: 9, tableName: 'Professional Overflow' },
  { name: 'Jeffery Jackson', party: 'Ausha & Jeffery Jackson', table: 9, tableName: 'Professional Overflow' },
  { name: 'Chris Tidrick', party: 'Chris Tidrick', table: 9, tableName: 'Professional Overflow' },
  { name: 'Mitzi Williams', party: 'Mitzi Williams & Dakiesha Lanier', table: 9, tableName: 'Professional Overflow' },
  { name: 'Dakiesha Lanier', party: 'Mitzi Williams & Dakiesha Lanier', table: 9, tableName: 'Professional Overflow' },
];

export default function Seating() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    if (!q) return;
    const found = SEATING_DATA.filter(e =>
      e.name.toLowerCase().includes(q) || e.party.toLowerCase().includes(q)
    );
    const seen = new Set();
    const deduped = found.filter(e => {
      const key = `${e.table}-${e.party}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
    setResults(deduped);
    setSearched(true);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      padding: "28px 16px 48px",
      background: `linear-gradient(160deg, ${COLORS.deepPurple} 0%, #5C1F5C 40%, #7A2D6E 70%, ${COLORS.deepPurple} 100%)`,
      fontFamily: "'Poppins', sans-serif",
    }}>
      <Crown size={24} style={{ color: COLORS.champagneGold, marginBottom: 8 }} strokeWidth={1.5} />
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,6vw,34px)", fontWeight: 600, color: COLORS.cream, margin: "0 0 4px", textAlign: "center" }}>
        Find Your Seat
      </h1>
      <p style={{ fontSize: 13, color: COLORS.mauveBlush, margin: "0 0 24px", textAlign: "center" }}>
        Type your first or last name to find your table
      </p>

      <div style={{ width: "100%", maxWidth: 420, display: "flex", gap: 8, marginBottom: 24 }}>
        <input
          type="text" placeholder="Enter your name..."
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          style={{ flex: 1, padding: "12px 16px", borderRadius: 10, outline: "none", border: `1.5px solid ${COLORS.mauveBlush}`, color: COLORS.deepPurple, fontSize: 15, fontFamily: "'Poppins', sans-serif" }}
        />
        <button onClick={handleSearch} style={{
          padding: "12px 18px", borderRadius: 10, border: "none",
          background: COLORS.champagneGold, color: COLORS.deepPurple,
          cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 600,
        }}>
          <Search size={16} /> Find
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 420 }}>
        {searched && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 16px" }}>
            <p style={{ color: COLORS.mauveBlush, fontSize: 14, margin: "0 0 6px" }}>No match found for "{query}"</p>
            <p style={{ color: COLORS.roseGold, fontSize: 12, margin: 0 }}>Try your last name, or ask a host for help</p>
          </div>
        )}
        {results.map((entry, i) => (
          <div key={i} style={{ background: COLORS.cream, borderRadius: 14, padding: "20px 20px 18px", marginBottom: 12, boxShadow: "0 12px 32px -8px rgba(0,0,0,0.4)" }}>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: COLORS.plumWine, fontWeight: 600, margin: "0 0 4px" }}>Your table</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(48px,12vw,64px)", fontWeight: 700, color: COLORS.deepPurple, margin: 0, lineHeight: 1 }}>{entry.table}</p>
            </div>
            <div style={{ height: 1, background: `${COLORS.mauveBlush}33`, marginBottom: 12 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Users size={14} style={{ color: COLORS.mauveBlush, flexShrink: 0 }} />
              <p style={{ fontSize: 13, color: COLORS.deepPurple, margin: 0, fontWeight: 500 }}>{entry.party}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MapPin size={14} style={{ color: COLORS.champagneGold, flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: COLORS.plumWine, margin: 0 }}>Look for the Table {entry.table} sign in the venue</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
