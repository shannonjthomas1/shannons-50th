import React, { useState, useEffect, useRef } from "react";
import { Heart, Camera, X, Sparkles, Crown, Lock, Globe } from "lucide-react";
import { supabase } from "./supabaseClient";

// Official "Favored, Fabulous & Fifty" palette
const COLORS = {
  deepPurple: "#3D0C4E",
  plumWine: "#6B2D6B",
  mauveBlush: "#C4869A",
  roseGold: "#C17A8A",
  champagneGold: "#D4A84B",
  cream: "#FDF0ED",
};

const PROMPTS = {
  wish: "Leave a birthday wish",
  memory: "Share a favorite memory",
};

const STARTER_TILTS = [-3, 2, -1.5, 3, -2.5, 1, -1, 2.5];

function Card({ entry, tilt }) {
  return (
    <div
      className="break-inside-avoid mb-5 rounded-sm shadow-lg p-4 pb-5 transition-transform hover:scale-[1.02] hover:z-10"
      style={{
        background: COLORS.cream,
        transform: `rotate(${tilt}deg)`,
        boxShadow: "0 8px 20px -6px rgba(75,29,82,0.5)",
      }}
    >
      {entry.photo_url && (
        <div className="mb-3 -mx-1 -mt-1 overflow-hidden rounded-sm border-4" style={{ borderColor: COLORS.cream }}>
          <img src={entry.photo_url} alt="" className="w-full object-cover" style={{ maxHeight: 260 }} />
        </div>
      )}
      <p className="text-[10px] uppercase tracking-[0.15em] mb-1.5 font-semibold" style={{ color: COLORS.plumWine }}>
        {entry.type === "memory" ? "A memory" : "A wish"}
      </p>
      <p className="text-[15px] leading-snug mb-2" style={{ color: COLORS.deepPurple, fontFamily: "'Poppins', sans-serif" }}>
        {entry.text}
      </p>
      <p className="text-right text-sm italic" style={{ color: COLORS.roseGold, fontFamily: "'Playfair Display', serif" }}>
        — {entry.name || "Anonymous"}
      </p>
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState("wish");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [privacy, setPrivacy] = useState("public");
  const [submitting, setSubmitting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [lastPrivacy, setLastPrivacy] = useState("public");
  const fileRef = useRef(null);

  // Load public entries on mount, and subscribe to new ones in real time
  useEffect(() => {
    let mounted = true;

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("guestbook_entries")
        .select("*")
        .eq("privacy", "public")
        .order("created_at", { ascending: false });
      if (mounted && !error && data) setEntries(data);
      setLoading(false);
    };

    fetchEntries();

    const channel = supabase
      .channel("guestbook_entries_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "guestbook_entries", filter: "privacy=eq.public" },
        (payload) => {
          setEntries((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const openForm = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setName("");
    setText("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setPrivacy("public");
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);

    let photoUrl = null;
    try {
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("guestbook-photos")
          .upload(path, photoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("guestbook-photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("guestbook_entries").insert({
        type: formType,
        name: name.trim() || "Anonymous",
        text: text.trim(),
        photo_url: photoUrl,
        privacy,
      });
      if (insertError) throw insertError;

      setLastPrivacy(privacy);
      setJustAdded(true);
      closeForm();
      setTimeout(() => setJustAdded(false), 2200);
    } catch (err) {
      console.error("Error saving entry:", err);
      alert("Something went wrong saving that — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-8 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(circle at 50% 0%, ${COLORS.champagneGold}22, transparent 60%)` }}
        />
        <div className="relative flex justify-center mb-3">
          <Crown size={28} style={{ color: COLORS.champagneGold }} strokeWidth={1.5} />
        </div>
        <p className="relative text-xs tracking-[0.3em] uppercase mb-1" style={{ color: COLORS.champagneGold }}>
          Honoring Dr. Shannon J. Thomas
        </p>
        <h1
          className="relative text-4xl sm:text-5xl mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
        >
          Favored, Fabulous &amp; Fifty
        </h1>
        <p
          className="relative text-lg italic mb-4"
          style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.mauveBlush }}
        >
          The Guestbook
        </p>
        <p className="relative text-sm max-w-xs mx-auto" style={{ color: COLORS.mauveBlush }}>
          Leave a wish, share a memory, snap a photo. It's all part of the story.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center px-6 mb-8 flex-wrap">
        <button
          onClick={() => openForm("wish")}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95"
          style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}
        >
          <Heart size={16} /> Leave a wish
        </button>
        <button
          onClick={() => openForm("memory")}
          className="flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 border"
          style={{ background: "transparent", color: COLORS.mauveBlush, borderColor: COLORS.roseGold }}
        >
          <Sparkles size={16} /> Share a memory
        </button>
      </div>

      {/* Live Wall section */}
      <div className="px-5 pb-16 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6 mt-2">
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${COLORS.roseGold}66)` }} />
          <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: COLORS.champagneGold }}>
            ✦ Live Wall ✦
          </p>
          <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${COLORS.roseGold}66)` }} />
        </div>
        {loading ? (
          <p className="text-center mt-8" style={{ color: COLORS.mauveBlush }}>
            Loading the wall...
          </p>
        ) : entries.length === 0 ? (
          <p className="text-center mt-8" style={{ color: COLORS.champagneGold }}>
            Be the first to leave something here.
          </p>
        ) : (
          <div className="[column-fill:_balance] sm:[column-count:2] lg:[column-count:3] gap-5">
            {entries.map((entry, i) => (
              <Card key={entry.id} entry={entry} tilt={STARTER_TILTS[i % STARTER_TILTS.length]} />
            ))}
          </div>
        )}
      </div>

      {/* Form modal */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ background: "rgba(20,10,17,0.7)" }}
          onClick={closeForm}
        >
          <div
            className="w-full max-w-sm rounded-lg p-6 relative max-h-[90vh] overflow-y-auto"
            style={{ background: COLORS.cream }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 opacity-60 hover:opacity-100"
              style={{ color: COLORS.deepPurple }}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl mb-4" style={{ fontFamily: "'Playfair Display', serif", color: COLORS.deepPurple }}>
              {PROMPTS[formType]}
            </h2>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded text-sm outline-none border"
              style={{ borderColor: COLORS.mauveBlush, color: COLORS.deepPurple }}
            />

            <textarea
              placeholder={formType === "memory" ? "Tell the story..." : "Write your wish..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full mb-3 px-3 py-2 rounded text-sm outline-none border resize-none"
              style={{ borderColor: COLORS.mauveBlush, color: COLORS.deepPurple }}
            />

            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm border"
              style={{ borderColor: COLORS.roseGold, color: COLORS.roseGold }}
            >
              <Camera size={16} />
              {photoPreview ? "Change photo" : "Add a photo (optional)"}
            </button>

            {photoPreview && (
              <img src={photoPreview} alt="" className="w-full rounded mb-4" style={{ maxHeight: 160, objectFit: "cover" }} />
            )}

            <p className="text-xs font-medium mb-2" style={{ color: COLORS.plumWine }}>
              Who can see this?
            </p>
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setPrivacy("public")}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-sm border-2"
                style={{
                  borderColor: privacy === "public" ? COLORS.roseGold : "#E5DCD8",
                  background: privacy === "public" ? `${COLORS.roseGold}15` : "transparent",
                  color: privacy === "public" ? COLORS.deepPurple : "#9B8D94",
                }}
              >
                <Globe size={15} /> Everyone
              </button>
              <button
                onClick={() => setPrivacy("private")}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-sm border-2"
                style={{
                  borderColor: privacy === "private" ? COLORS.roseGold : "#E5DCD8",
                  background: privacy === "private" ? `${COLORS.roseGold}15` : "transparent",
                  color: privacy === "private" ? COLORS.deepPurple : "#9B8D94",
                }}
              >
                <Lock size={15} /> Just Shannon
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
              className="w-full py-3 rounded-full text-sm font-medium transition-opacity disabled:opacity-40"
              style={{ background: COLORS.deepPurple, color: COLORS.cream }}
            >
              {submitting ? "Saving..." : "Add to the guestbook"}
            </button>
          </div>
        </div>
      )}

      {justAdded && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm shadow-lg z-50 flex items-center gap-2"
          style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}
        >
          {lastPrivacy === "private" ? <Lock size={14} /> : null}
          {lastPrivacy === "private" ? "Saved privately for Shannon 🤍" : "Added to the wall — thank you! 🥂"}
        </div>
      )}
    </div>
  );
}
