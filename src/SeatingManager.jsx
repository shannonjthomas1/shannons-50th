import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#3D0C4E",
  plumWine: "#6B2D6B",
  mauveBlush: "#C4869A",
  roseGold: "#C17A8A",
  champagneGold: "#D4A84B",
  cream: "#FDF0ED",
};

const EMPTY_FORM = { table_number: "", category: "", primary_guest: "", secondary_guest: "", party_size: "1" };

function GuestRow({ entry, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...entry, table_number: String(entry.table_number), party_size: String(entry.party_size) });

  const save = async () => {
    await supabase.from("seating").update({
      table_number: parseInt(form.table_number),
      category: form.category,
      primary_guest: form.primary_guest,
      secondary_guest: form.secondary_guest || null,
      party_size: parseInt(form.party_size),
    }).eq("id", entry.id);
    onSave();
    setEditing(false);
  };

  const del = async () => {
    if (!window.confirm(`Remove ${entry.primary_guest}?`)) return;
    await supabase.from("seating").delete().eq("id", entry.id);
    onDelete();
  };

  if (editing) {
    return (
      <div className="p-3 rounded-lg mb-2" style={{ background: `${COLORS.champagneGold}15`, border: `1px solid ${COLORS.champagneGold}44` }}>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input placeholder="Table #" value={form.table_number} onChange={e => setForm(f => ({ ...f, table_number: e.target.value }))}
            className="px-2 py-1.5 rounded text-xs outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
          <input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="px-2 py-1.5 rounded text-xs outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
          <input placeholder="Primary guest" value={form.primary_guest} onChange={e => setForm(f => ({ ...f, primary_guest: e.target.value }))}
            className="px-2 py-1.5 rounded text-xs outline-none col-span-2" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
          <input placeholder="Guest 2 (optional)" value={form.secondary_guest || ""} onChange={e => setForm(f => ({ ...f, secondary_guest: e.target.value }))}
            className="px-2 py-1.5 rounded text-xs outline-none col-span-2" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
          <input placeholder="Party size" value={form.party_size} onChange={e => setForm(f => ({ ...f, party_size: e.target.value }))}
            className="px-2 py-1.5 rounded text-xs outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={() => setEditing(false)} className="p-1.5 rounded" style={{ background: "rgba(255,255,255,0.1)" }}><X size={14} style={{ color: COLORS.mauveBlush }} /></button>
          <button onClick={save} className="p-1.5 rounded" style={{ background: COLORS.champagneGold }}><Check size={14} style={{ color: COLORS.deepPurple }} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded mb-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
      <div>
        <span className="text-xs font-semibold mr-2" style={{ color: COLORS.champagneGold }}>T{entry.table_number}</span>
        <span className="text-sm" style={{ color: COLORS.cream }}>{entry.primary_guest}</span>
        {entry.secondary_guest && <span className="text-xs ml-1" style={{ color: COLORS.mauveBlush }}>& {entry.secondary_guest}</span>}
        <span className="text-xs ml-2" style={{ color: COLORS.roseGold }}>{entry.category}</span>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button onClick={() => setEditing(true)} className="p-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>
          <Pencil size={13} style={{ color: COLORS.mauveBlush }} />
        </button>
        <button onClick={del} className="p-1 rounded" style={{ background: "rgba(255,255,255,0.08)" }}>
          <Trash2 size={13} style={{ color: COLORS.roseGold }} />
        </button>
      </div>
    </div>
  );
}

export default function SeatingManager() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  const load = async () => {
    const { data } = await supabase.from("seating").select("*").order("table_number").order("primary_guest");
    setEntries(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addGuest = async () => {
    if (!form.primary_guest.trim() || !form.table_number) return;
    await supabase.from("seating").insert({
      table_number: parseInt(form.table_number),
      category: form.category,
      primary_guest: form.primary_guest.trim(),
      secondary_guest: form.secondary_guest.trim() || null,
      party_size: parseInt(form.party_size) || 1,
    });
    setForm(EMPTY_FORM);
    setShowAdd(false);
    load();
  };

  const filtered = entries.filter(e =>
    !search || e.primary_guest.toLowerCase().includes(search.toLowerCase()) ||
    (e.secondary_guest || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: COLORS.champagneGold }}>{entries.length} guests · 8 tables</p>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}>
          <Plus size={14} /> Add guest
        </button>
      </div>

      {showAdd && (
        <div className="rounded-lg p-3 mb-3" style={{ background: "rgba(229,193,88,0.1)", border: `1px solid rgba(229,193,88,0.3)` }}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input placeholder="Table #" value={form.table_number} onChange={e => setForm(f => ({ ...f, table_number: e.target.value }))}
              className="px-2 py-1.5 rounded text-xs outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
            <input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="px-2 py-1.5 rounded text-xs outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
            <input placeholder="Primary guest name *" value={form.primary_guest} onChange={e => setForm(f => ({ ...f, primary_guest: e.target.value }))}
              className="px-2 py-1.5 rounded text-xs outline-none col-span-2" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
            <input placeholder="Guest 2 (optional)" value={form.secondary_guest} onChange={e => setForm(f => ({ ...f, secondary_guest: e.target.value }))}
              className="px-2 py-1.5 rounded text-xs outline-none col-span-2" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
            <input placeholder="Party size" value={form.party_size} onChange={e => setForm(f => ({ ...f, party_size: e.target.value }))}
              className="px-2 py-1.5 rounded text-xs outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="px-3 py-1.5 rounded text-xs" style={{ color: COLORS.mauveBlush }}>Cancel</button>
            <button onClick={addGuest} className="px-3 py-1.5 rounded text-xs font-medium" style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}>Add</button>
          </div>
        </div>
      )}

      <input placeholder="Search guests..." value={search} onChange={e => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded mb-3 text-sm outline-none" style={{ color: COLORS.deepPurple, border: `1px solid ${COLORS.mauveBlush}` }} />

      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {loading ? (
          <p className="text-center text-sm py-4" style={{ color: COLORS.mauveBlush }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm py-4" style={{ color: COLORS.mauveBlush }}>No guests found</p>
        ) : (
          filtered.map(entry => <GuestRow key={entry.id} entry={entry} onSave={load} onDelete={load} />)
        )}
      </div>
    </div>
  );
}
