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
      style={{
        minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column",
        alignItems: "center", padding: "32px 24px 48px",
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Crown size={26} style={{ color: COLORS.champagneGold, marginBottom: 10 }} strokeWidth={1.5} />
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(24px,6vw,36px)", fontWeight: 600, color: COLORS.cream, margin: "0 0 6px", textAlign: "center" }}>
        Give to the Cause
      </h1>
      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(15px,3.5vw,20px)", fontStyle: "italic", color: COLORS.mauveBlush, margin: "0 0 28px", textAlign: "center" }}>
        Dr. Shannon J. Thomas Scholarship Fund
      </p>

      {/* Main card */}
      <div style={{ width: "100%", maxWidth: 420, background: COLORS.cream, borderRadius: 16, padding: 28, boxShadow: "0 20px 60px -10px rgba(0,0,0,0.5)", marginBottom: 0 }}>

        {/* Icon */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${COLORS.roseGold}18`, border: `2px solid ${COLORS.roseGold}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={28} style={{ color: COLORS.roseGold }} />
          </div>
        </div>

        {/* Message */}
        <p style={{ textAlign: "center", fontSize: 13, lineHeight: 1.7, color: COLORS.deepPurple, marginBottom: 20 }}>
          In honor of this milestone birthday, Dr. Shannon J. Thomas invites you to invest in the next generation. Your gift helps deserving students achieve their dreams — a true reflection of what it means to be favored, fabulous, and fifty.
        </p>

        <div style={{ background: `${COLORS.deepPurple}08`, border: `1px solid ${COLORS.mauveBlush}44`, borderRadius: 10, padding: "10px 16px", textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 600, color: COLORS.plumWine, margin: "0 0 2px" }}>Every gift makes a difference</p>
          <p style={{ fontSize: 11, color: COLORS.roseGold, margin: 0 }}>No amount is too small — your generosity is a blessing</p>
        </div>

        {/* QR Code */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 11, color: COLORS.plumWine, fontWeight: 500, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Scan to donate
          </p>
          <div style={{ background: "white", borderRadius: 10, padding: 10, border: `2px solid ${COLORS.mauveBlush}44` }}>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(DONATION_URL)}&color=4B1D52&bgcolor=ffffff`}
              alt="QR code to donate"
              width={150}
              height={150}
              style={{ display: "block", borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: `${COLORS.mauveBlush}44` }} />
          <span style={{ fontSize: 11, color: COLORS.mauveBlush }}>or</span>
          <div style={{ flex: 1, height: 1, background: `${COLORS.mauveBlush}44` }} />
        </div>

        {/* Donate button */}
        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "14px 0", borderRadius: 999,
            background: COLORS.deepPurple, color: COLORS.cream,
            textDecoration: "none", fontSize: 15, fontWeight: 600,
            boxShadow: "0 4px 16px rgba(75,29,82,0.3)",
          }}
        >
          <Heart size={18} />
          Give Now
          <ExternalLink size={13} style={{ opacity: 0.7 }} />
        </a>
      </div>
    </div>
  );
}
