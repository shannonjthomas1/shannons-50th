-- Run this entire script in the Supabase SQL Editor (SQL Editor tab in your project)
-- This creates the table that stores every guestbook entry.

create table guestbook_entries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('wish', 'memory')),
  name text,
  text text not null,
  photo_url text,
  privacy text not null default 'public' check (privacy in ('public', 'private')),
  created_at timestamptz not null default now()
);

alter table guestbook_entries enable row level security;

-- Anyone visiting the site can add an entry (public or private)
create policy "Anyone can insert entries"
  on guestbook_entries for insert
  to anon
  with check (true);

-- Anyone with the anon key can READ all rows. This is required so the
-- passcode-protected /shannon admin page (which uses the same public key,
-- since this is a simple static site with no server) can show private entries.
--
-- Privacy here is enforced in two places instead of at the database level:
--   1. The public guestbook page (src/App.jsx) only ever QUERIES rows where
--      privacy = 'public', so guests browsing the wall never see private ones.
--   2. The /shannon page is gated by a passcode (set in src/Admin.jsx) and by
--      guests not knowing that URL exists.
--
-- This is appropriate for a private party guestbook, not for sensitive data.
-- If you want true server-side privacy (private entries literally unreadable
-- without a server-side key), ask Claude to set up a small serverless function
-- using Supabase's service role key instead -- that's a bit more setup but
-- closes this gap completely.
create policy "Anyone can read entries"
  on guestbook_entries for select
  to anon
  using (true);

-- Storage bucket for guest-uploaded photos. Run this part too:
insert into storage.buckets (id, name, public)
values ('guestbook-photos', 'guestbook-photos', true)
on conflict (id) do nothing;

create policy "Anyone can upload photos"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'guestbook-photos');

create policy "Anyone can view photos"
  on storage.objects for select
  to anon
  using (bucket_id = 'guestbook-photos');

-- ============================================================
-- RAFFLE / NUMBER DRAWING SYSTEM
-- ============================================================
-- Each row is one guest's claimed raffle number.

create table raffle_entries (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique check (number >= 1 and number <= 200),
  name text not null,
  contact text not null unique, -- email or phone, used to prevent duplicate entries
  is_winner boolean not null default false,
  won_at timestamptz,
  created_at timestamptz not null default now()
);

alter table raffle_entries enable row level security;

-- Anyone can insert their own entry (the app enforces the "one per contact"
-- rule in code by checking first, but this unique constraint backs it up
-- at the database level too)
create policy "Anyone can insert raffle entries"
  on raffle_entries for insert
  to anon
  with check (true);

-- Anyone can read raffle entries (needed so guests can look up their own
-- number again by contact, and so the host page can see everyone)
create policy "Anyone can read raffle entries"
  on raffle_entries for select
  to anon
  using (true);

-- Anyone can update raffle entries (needed so the host page can mark a
-- number as a winner when drawn). As with the guestbook admin page, the
-- real protection here is the passcode gate on the host page + guests not
-- knowing that URL, not a database-level restriction.
create policy "Anyone can update raffle entries"
  on raffle_entries for update
  to anon
  using (true);


-- ============================================================
-- BINGO SYSTEM
-- ============================================================
create table if not exists bingo_calls (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique check (number >= 1 and number <= 50),
  created_at timestamptz not null default now()
);

alter table bingo_calls enable row level security;

create policy "Anyone can read bingo calls"
  on bingo_calls for select to anon using (true);

create policy "Anyone can insert bingo calls"
  on bingo_calls for insert to anon with check (true);

create policy "Anyone can delete bingo calls"
  on bingo_calls for delete to anon using (true);
