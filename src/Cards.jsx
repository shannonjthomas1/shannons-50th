import React, { useState, useRef } from "react";
import { Crown, Shuffle, Users, Sparkles } from "lucide-react";

const COLORS = {
  deepPurple: "#3D0C4E",
  plumWine: "#6B2D6B",
  mauveBlush: "#C4869A",
  roseGold: "#C17A8A",
  champagneGold: "#D4A84B",
  cream: "#FDF0ED",
};

// "How well do you know Shannon" — built from facts she provided directly.
const SHANNON_CARDS = [
  {
    kind: "trivia",
    format: "mc",
    prompt: "Where was Shannon born — and where was she actually raised?",
    options: ["Born in Decatur, raised in Atlanta", "Born in Atlanta, raised in Decatur", "Born and raised in Decatur"],
    answer: "Born in Atlanta, raised in Decatur",
  },
  {
    kind: "trivia",
    format: "open",
    prompt: "What instrument did Shannon play in her high school band?",
    answer: "Tenor drum",
  },
  {
    kind: "trivia",
    format: "mc",
    prompt: "Is Shannon the oldest, middle, or youngest child in her family?",
    options: ["Oldest", "Middle", "Youngest"],
    answer: "Middle",
  },
  {
    kind: "trivia",
    format: "open",
    prompt: "What does Shannon do for work?",
    answer: "IT Director",
  },
  {
    kind: "trivia",
    format: "open",
    prompt: "What's the name of the church Shannon grew up in?",
    answer: "Refuge Temple",
  },
  {
    kind: "trivia",
    format: "mc",
    prompt: "How many children does Shannon have?",
    options: ["One", "Two", "Three"],
    answer: "Two",
  },
  {
    kind: "trivia",
    format: "mc",
    prompt: "How many years has Shannon been married?",
    options: ["15 years", "20 years", "25 years"],
    answer: "25 years",
  },
  {
    kind: "trivia",
    format: "open",
    prompt: "What's Shannon's favorite movie of all time?",
    answer: "Love & Basketball",
  },
  {
    kind: "trivia",
    format: "open",
    prompt: "Where did Shannon work for ten years?",
    answer: "Albany State University",
  },
  {
    kind: "trivia",
    format: "mc",
    prompt: "What was Shannon's major in college?",
    options: ["Accounting", "Marketing", "Communications"],
    answer: "Marketing",
  },
  {
    kind: "trivia",
    format: "open",
    prompt: "Where did Shannon earn her bachelor's degree?",
    answer: "Albany State University",
  },
  {
    kind: "trivia",
    format: "mc",
    prompt: "What's Shannon's highest degree?",
    options: ["Master's in Business", "Doctorate in Business Administration", "Doctorate in Education"],
    answer: "Doctorate in Business Administration",
  },
  {
    kind: "trivia",
    format: "mc",
    prompt: "What's Shannon's favorite color?",
    options: ["Purple", "Gold", "Blue"],
    answer: "Purple",
  },
];

// Classic icebreakers — get tables talking to each other, not just about Shannon.
const ICEBREAKER_CARDS = [
  { kind: "icebreaker", prompt: "What's the best birthday gift you've ever received?" },
  { kind: "icebreaker", prompt: "Two truths and a lie — let the table guess which is which." },
  { kind: "icebreaker", prompt: "What song instantly gets you on the dance floor?" },
  { kind: "icebreaker", prompt: "What's a milestone birthday you're most looking forward to?" },
  { kind: "icebreaker", prompt: "If you could relive one year of your life, which would it be and why?" },
  { kind: "icebreaker", prompt: "What's the best piece of advice someone gave you in your 20s?" },
  { kind: "icebreaker", prompt: "What's a small thing that makes a party memorable for you?" },
  { kind: "icebreaker", prompt: "Share the first word that comes to mind when you think of Shannon." },
  { kind: "icebreaker", prompt: "What's a tradition you hope to still be doing at 50?" },
  { kind: "icebreaker", prompt: "What's the most fun you've had at a party in the last year?" },
];

const ALL_CARDS = [...SHANNON_CARDS, ...ICEBREAKER_CARDS];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Cards() {
  const deckRef = useRef(shuffle(ALL_CARDS));
  const indexRef = useRef(0);
  const [card, setCard] = useState(deckRef.current[0]);
  const [revealed, setRevealed] = useState(false);
  const [flip, setFlip] = useState(false);

  const nextCard = () => {
    setFlip(true);
    setTimeout(() => {
      indexRef.current += 1;
      if (indexRef.current >= deckRef.current.length) {
        deckRef.current = shuffle(ALL_CARDS);
        indexRef.current = 0;
      }
      setCard(deckRef.current[indexRef.current]);
      setRevealed(false);
      setFlip(false);
    }, 180);
  };

  const isTrivia = card.kind === "trivia";

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-10"
      style={{
        background: `linear-gradient(165deg, ${COLORS.deepPurple} 0%, ${COLORS.plumWine} 55%, ${COLORS.deepPurple} 100%)`,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        @keyframes cardIn {
          0% { opacity: 0; transform: scale(0.92) rotate(-1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .card-enter { animation: cardIn 0.35s cubic-bezier(0.22,1,0.36,1); }
        .card-exit { opacity: 0; transform: scale(0.92); transition: all 0.18s ease; }
      `}</style>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-2">
          <Crown size={26} style={{ color: COLORS.champagneGold }} strokeWidth={1.5} />
        </div>
        <h1
          className="text-3xl sm:text-4xl mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: COLORS.cream, fontWeight: 600 }}
        >
          Talk It Up
        </h1>
        <p className="text-sm" style={{ color: COLORS.mauveBlush }}>
          Conversation starters &amp; "how well do you know Shannon"
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md flex-1 flex items-center justify-center">
        <div
          className={`w-full rounded-lg p-7 shadow-2xl ${flip ? "card-exit" : "card-enter"}`}
          style={{ background: COLORS.cream, minHeight: 280 }}
        >
          <div className="flex items-center gap-2 mb-5">
            {isTrivia ? (
              <Sparkles size={18} style={{ color: COLORS.roseGold }} />
            ) : (
              <Users size={18} style={{ color: COLORS.roseGold }} />
            )}
            <p className="text-xs uppercase tracking-[0.2em] font-semibold" style={{ color: COLORS.plumWine }}>
              {isTrivia ? "How well do you know Shannon?" : "Talk about it"}
            </p>
          </div>

          <p
            className="text-2xl leading-snug mb-6"
            style={{ fontFamily: "'Playfair Display', serif", color: COLORS.deepPurple }}
          >
            {card.prompt}
          </p>

          {isTrivia && card.format === "mc" && (
            <div className="space-y-2 mb-2">
              {card.options.map((opt) => (
                <div
                  key={opt}
                  className="px-4 py-2.5 rounded text-sm border"
                  style={{
                    borderColor: revealed && opt === card.answer ? COLORS.roseGold : "#E5DCD8",
                    background: revealed && opt === card.answer ? `${COLORS.roseGold}18` : "transparent",
                    color: COLORS.deepPurple,
                    fontWeight: revealed && opt === card.answer ? 600 : 400,
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}

          {isTrivia && (
            <div className="mt-4">
              {revealed ? (
                <p className="text-sm font-medium" style={{ color: COLORS.roseGold }}>
                  Answer: {card.answer}
                </p>
              ) : (
                <button
                  onClick={() => setRevealed(true)}
                  className="text-sm underline"
                  style={{ color: COLORS.plumWine }}
                >
                  Guess first, then reveal the answer
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={nextCard}
        className="mt-8 flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95"
        style={{ background: COLORS.champagneGold, color: COLORS.deepPurple }}
      >
        <Shuffle size={16} /> Next card
      </button>
    </div>
  );
}
