import React, { useState } from "react";
import { Crown, Ticket } from "lucide-react";
import { supabase } from "./supabaseClient";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

const MAX_NUMBER = 200;

export default function Raffle() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [myNumber, setMyNumber] = useState(null);
  const [alreadyEntered, setAlreadyEntered] = useState(false);

  const getRandomAvailableNumber = async () => {
    const { data: existing, error: fetchError } = await supabase
      .from("raffle_entries")
      .select("number");
    if (fetchError) throw fetchError;

    const taken = new Set((existing || []).map((e) => e.number));
    if (taken.size >= MAX_NUMBER) return null; // sold out

    let candidate;
    do {
      candidate = Math.floor(Math.random() * MAX_NUMBER) + 1;
    } while (taken.has(candidate));
    return candidate;
  };

  const handleSubmit = async () => {
    setError("");
    const trimmedName = name.trim();
    const trimmedContact = contact.trim().toLowerCase();

    if (!trimmedName || !trimmedContact) {
      setError("Please fill in both your name and email or phone number.");
      return;
    }

    setSubmitting(true);
    try {
      // Check if this contact already has a number
      const { data: existingEntry, error: lookupError } = await supabase
        .from("raffle_entries")
        .select("*")
        .eq("contact", trimmedContact)
        .maybeSingle();
      if (lookupError) throw lookupError;

      if (existingEntry) {
        setMyNumber(existingEntry.number);
        setAlreadyEntered(true);
        setSubmitting(false);
        return;
      }

      const number = await getRandomAvailableNumber();
      if (number === null) {
        setError("All raffle numbers have been claimed — check with the host.");
        setSubmitting(false);
        return;
      }

      const { error: insertError } = await supabase.from("raffle_entries").insert({
        number,
        name: trimmedName,
        contact: trimmedContact,
      });
      if (insertError) {
        // Unique constraint race condition — someone else grabbed the same
        // contact or number a split second earlier. Just ask them to retry.
        if (insertError.code === "23505") {
          setError("That happened just as someone else signed up — please tap the button again.");
        } else {
          throw insertError;
        }
        setSubmitting(false);
        return;
      }

      setMyNumber(number);
      setAlreadyEntered(false);
    } catch (err) {
      console.error("Raffle entry error:", err);
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-6 py-10"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-3">
          <Crown size={28} style={{ color: COLORS.champagneGold }} strokeWidth={1.5} />
        </div>
        <h1
          className="text-3xl sm:text-4xl mb-2"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
        >
          Raffle Draw
        </h1>
        <p className="text-sm mb-8" style={{ color: COLORS.mauveBlush }}>
          Get your number — the host will draw winners live during the party.
        </p>

        {myNumber !== null ? (
          <div
            className="rounded-lg p-8 shadow-2xl"
            style={{ background: COLORS.cream }}
          >
            <Ticket size={28} style={{ color: COLORS.roseGold }} className="mx-auto mb-3" />
            <p className="text-sm mb-1" style={{ color: COLORS.plumWine }}>
              {alreadyEntered ? "You're already entered. Your number is:" : "Your number is:"}
            </p>
            <p
              className="text-6xl font-bold mb-2"
              style={{ color: COLORS.deepPurple, fontFamily: "'Playfair Display', serif" }}
            >
              {myNumber}
            </p>
            <p className="text-xs" style={{ color: COLORS.roseGold }}>
              Remember this number — listen for it during the drawing!
            </p>
          </div>
        ) : (
          <div className="rounded-lg p-6 shadow-2xl" style={{ background: COLORS.cream }}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 px-3 py-2.5 rounded text-sm outline-none border"
              style={{ borderColor: COLORS.mauveBlush, color: COLORS.deepPurple }}
            />
            <input
              type="text"
              placeholder="Email or phone number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full mb-1 px-3 py-2.5 rounded text-sm outline-none border"
              style={{ borderColor: COLORS.mauveBlush, color: COLORS.deepPurple }}
            />
            <p className="text-xs text-left mb-4" style={{ color: "#9B8D94" }}>
              One number per person — this just makes sure no one double-enters.
            </p>

            {error && (
              <p className="text-xs text-left mb-3" style={{ color: "#B33A3A" }}>
                {error}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-3 rounded-full text-sm font-medium transition-opacity disabled:opacity-50"
              style={{ background: COLORS.deepPurple, color: COLORS.cream }}
            >
              {submitting ? "Getting your number..." : "Get my number"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
