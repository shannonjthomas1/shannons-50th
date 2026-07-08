# Shannon's 50th — Guestbook Setup Guide

This turns the guestbook into a real, public website guests can reach by
scanning a QR code. It uses two free services:

- **Supabase** — stores the messages, photos, and privacy setting
- **Vercel** — hosts the website itself and gives you a public link

Total time: about 20–30 minutes. No coding required, just following steps.

---

## Part 1: Set up Supabase (the database) — ~10 min

1. Go to **supabase.com** and sign up for a free account.
2. Click **New Project**. Name it anything (e.g. "shannons-50th"). Choose any
   region close to you. Set a database password and save it somewhere — you
   won't need it again for this setup, but keep it just in case.
3. Wait about 2 minutes for the project to finish setting up.
4. In the left sidebar, click the **SQL Editor** icon.
5. Click **New query**, then open the file `supabase-setup.sql` (included in
   this folder), copy ALL of its contents, and paste into the SQL editor.
6. Click **Run**. You should see "Success. No rows returned."
   - This created your table (`guestbook_entries`) and a storage bucket for
     photos (`guestbook-photos`), with the right permissions.
7. In the left sidebar, click the **gear icon (Project Settings)** → **API**.
8. You'll see two values you need:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (a long string starting with `eyJ...`)
   - Keep this tab open — you'll paste these into Vercel in Part 2.

---

## Part 2: Deploy to Vercel (the website) — ~10 min

1. Go to **vercel.com** and sign up for a free account (you can sign up with
   GitHub, Google, or email).
2. You need this project's code in a place Vercel can pull from. The simplest
   way:
   - Go to **github.com**, sign up if needed, and create a **New repository**
     (name it anything, e.g. "shannons-50th-guestbook"). Keep it Private if
     you prefer.
   - On your computer, unzip the project folder I gave you, then follow
     GitHub's "push an existing repository" instructions shown on the new
     repo's page (it gives you the exact commands to copy/paste in Terminal).
     If this step is confusing, this is the one part worth asking a tech-
     comfortable friend or family member to do with you — it's literally
     copy-pasting a few lines into Terminal.
3. Back in Vercel, click **Add New... → Project**, then **Import** the GitHub
   repository you just created.
4. Vercel will auto-detect it's a Vite project. Before clicking Deploy, open
   **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → paste your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` → paste your Supabase anon public key
5. Click **Deploy**. Wait about a minute.
6. You'll get a live URL like `shannons-50th-guestbook.vercel.app`. That's
   your real, public guestbook link!
   - Optional: in Vercel project settings, you can add a custom domain if you
     own one, or just use the free `.vercel.app` link — it works perfectly
     fine for a QR code.

---

## Part 3: Try it out

1. Visit your new Vercel URL on your phone.
2. Tap "Leave a wish," fill it out, submit.
3. Refresh — your message should appear on the wall.
4. Visit `your-url.vercel.app/shannon` and enter the passcode `favored50`
   (you can change this — see "Changing the passcode" below) to see ALL
   entries, including private ones.

---

## Part 3.5: The big-screen display (`/wall`)

There's a third page built for showing on a projector or TV at the party:

**`your-url.vercel.app/wall`**

What it does:
- Pulls up automatically, no clicking needed once it's open
- The newest public wish or memory takes over the center of the screen for
  about 6 seconds, large and easy to read from across the room
- It then settles into the background as a smaller card, and the next new
  entry takes the spotlight
- Private entries never appear here — same rule as the public guestbook page
- It updates live the moment someone submits on their phone — no refresh,
  no one needs to touch the screen all night

**To use it at the party:**
1. Open `your-url.vercel.app/wall` on the laptop or device connected to your
   projector/TV.
2. Make it full-screen (most browsers: press F11, or use the browser's
   full-screen option).
3. Leave it running. It just works in the background as people submit
   entries from their phones throughout the night.

A nice touch: put this on screen during dinner or a lull, rather than the
whole party — that's when people tend to actually look up and read it.

---

## Part 3.6: Conversation starter cards (`/cards`)

A separate page for tables to use as an icebreaker game:

**`your-url.vercel.app/cards`**

What it does:
- Shows one card at a time — either a classic icebreaker question
  ("Two truths and a lie," "What song gets you on the dance floor?") or a
  "How well do you know Shannon" trivia question built from facts she
  provided
- Trivia cards are a mix of multiple choice and open-ended — guests guess
  out loud, then tap to reveal the answer
- Tapping "Next card" shuffles to a new random question
- This page has its own independent QR code/link — it's meant to be printed
  on table cards or a sign, separate from the guestbook QR code

To edit or add more "how well do you know Shannon" questions later, open
`src/Cards.jsx` and edit the `SHANNON_CARDS` or `ICEBREAKER_CARDS` lists near
the top of the file — each one is a simple plain-English entry.

---

## Part 3.7: Digital raffle / number draw (`/raffle` and `/raffle/host`)

This replaces the "take a numbered ticket from a bucket" setup with a
digital version, for giveaways during the party.

**Guest side: `your-url.vercel.app/raffle`**
- Guest enters their name and an email or phone number
- They're given a random number from 1–200 that no one else has
- The system remembers them by their email/phone, so if they scan again,
  they just see their existing number instead of getting a second one
- Their number shows big on screen so they can remember or screenshot it

**Host side: `your-url.vercel.app/raffle/host`**
- Passcode-protected (default `favored50draw` — change this in
  `src/RaffleHost.jsx`, same way as the guestbook admin passcode)
- Shows how many people have entered, and the full list of names + numbers
- A big **"Draw Winner"** button picks a random number from everyone who
  has entered (and hasn't already won), reveals it with a short suspense
  pause, and marks that person as a winner so they're not eligible again
- You can draw as many separate winners as you have prizes for — each draw
  only pulls from people who haven't won yet

**Important: run the updated SQL script.** This feature needs one more
table in Supabase. If you already ran `supabase-setup.sql` before, you only
need to add the new part — open the SQL Editor in Supabase, and run just the
section of `supabase-setup.sql` starting from `-- RAFFLE / NUMBER DRAWING
SYSTEM` to the end. (If you haven't deployed yet at all, just run the whole
file once, top to bottom, as usual.)

**At the party:**
1. Have your raffle QR code/sign out for guests to scan and grab a number
   any time before the drawing.
2. When it's time to draw, open `/raffle/host` on your phone or laptop,
   unlock with the passcode, and tap "Draw Winner" for each prize.
3. Announce the number/name shown on screen.

---

## Part 4: Make the QR code

Once your site is live, come back to this chat and give me the exact URL —
I'll generate a QR code image you can print on table cards, a sign, or the
invite itself.

(Or use any free QR generator like qr-code-generator.com and paste your
Vercel URL in directly.)

---

## Changing the passcode for the private (/shannon) page

Open `src/Admin.jsx`, find this line near the top:

```
const PASSCODE = "favored50";
```

Change `"favored50"` to anything you like, save, and push the change to
GitHub (Vercel redeploys automatically). Keep this passcode private — anyone
who knows your `/shannon` URL and this passcode can read private entries.

---

## A note on privacy

Private entries are hidden from the public guestbook wall, and the `/shannon`
page is passcode-protected. This is good privacy for a party setting, but it
is not bank-level security — anyone who somehow learned both the `/shannon`
URL and the passcode could see private entries. For a birthday guestbook,
this tradeoff is normal and reasonable. If you ever want this tightened
further (so private entries are unreadable even with the passcode leaked),
just ask — there's a slightly more involved setup for that.

---

## If something breaks

Common issues:
- **Blank page after deploy** → double check the two environment variables
  in Vercel are spelled exactly right and you redeployed after adding them.
- **Photos won't upload** → recheck Part 1, step 5 ran successfully and
  created the `guestbook-photos` storage bucket.
- **"/shannon" page shows nothing** → make sure you ran the full SQL script,
  including the storage and policy sections at the bottom.

You can always come back to this conversation and describe what you're
seeing — I can help debug from here.
