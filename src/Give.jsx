import React from "react";
import { Crown, Heart, ExternalLink, GraduationCap } from "lucide-react";

const COLORS = {
  deepPurple: "#4B1D52",
  plumWine: "#6E295F",
  mauveBlush: "#C79AA0",
  roseGold: "#B76E79",
  champagneGold: "#E5C158",
  cream: "#FAF3EE",
};

const DONATION_URL = "https://www.takingtheyard.com/offers/pGuJY88T/checkout";

export default function Give() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-10"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Header */}
      <div className="flex justify-center mb-3">
        <Crown size={26} style={{ color: COLORS.champagneGold }} strokeWidth={1.5} />
      </div>
      <h1
        className="text-3xl sm:text-4xl mb-2 text-center"
        style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
      >
        Give to the Cause
      </h1>
      <p
        className="text-lg italic text-center mb-8"
        style={{ fontFamily: "'Cormorant Garamond', serif", color: COLORS.mauveBlush }}
      >
        Dr. Shannon J. Thomas Scholarship Fund
      </p>

      {/* Main card */}
      <div
        className="w-full max-w-md rounded-xl shadow-2xl p-8 mb-6"
        style={{ background: COLORS.cream }}
      >
        <div className="flex justify-center mb-5">
          <div
            className="flex items-center justify-center rounded-full"
            style={{ width: 64, height: 64, background: `${COLORS.roseGold}18`, border: `2px solid ${COLORS.roseGold}` }}
          >
            <GraduationCap size={28} style={{ color: COLORS.roseGold }} />
          </div>
        </div>

        <p className="text-center text-sm leading-relaxed mb-6" style={{ color: COLORS.deepPurple }}>
          In honor of this milestone birthday, Dr. Shannon J. Thomas invites you to invest in the next generation. Your gift to the scholarship fund helps deserving students achieve their dreams — a true reflection of what it means to be favored, fabulous, and fifty.
        </p>

        <div
          className="rounded-lg p-4 mb-6 text-center"
          style={{ background: `${COLORS.deepPurple}08`, border: `1px solid ${COLORS.mauveBlush}44` }}
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: COLORS.plumWine }}>
            Every gift makes a difference
          </p>
          <p className="text-xs" style={{ color: COLORS.roseGold }}>
            No amount is too small — your generosity is a blessing
          </p>
        </div>

        {/* Donate button */}
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-full text-base font-semibold transition-transform hover:scale-105 active:scale-95"
          style={{ background: COLORS.deepPurple, color: COLORS.cream, textDecoration: "none" }}
        >
          <Heart size={18} />
          Give Now
          <ExternalLink size={14} style={{ opacity: 0.7 }} />
        </a>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center max-w-xs" style={{ color: COLORS.mauveBlush }}>
        Tapping "Give Now" will open the secure donation page in your browser
      </p>
    </div>
  );
}
