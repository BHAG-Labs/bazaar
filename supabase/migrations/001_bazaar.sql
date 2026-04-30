create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  role text,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz,
  active boolean default true
);
alter table public.newsletter_subscribers enable row level security;
create policy "Anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "Admins read subscribers" on public.newsletter_subscribers for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);

create table if not exists public.newsletter_issues (
  id uuid primary key default gen_random_uuid(),
  issue_number integer not null unique,
  title text not null,
  subtitle text,
  content text not null,
  tags text[] default '{}',
  highlights jsonb default '[]',
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.newsletter_issues enable row level security;
create policy "Anyone reads published issues" on public.newsletter_issues for select using (published = true);
create policy "Admins manage issues" on public.newsletter_issues for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);

-- Seed 3 sample issues
insert into public.newsletter_issues (issue_number, title, subtitle, content, tags, highlights, published, published_at) values
(1, 'The Seed Drought Is Real — Here''s How to Raise Anyway',
'Seed funding in India fell 30% in 2025. But 200+ seed rounds still closed.',
'Seed funding in India fell 30% in 2025. But 200+ seed rounds still closed. This week: what the surviving deals had in common, which VCs are still writing checks, and the three changes you can make to your deck this weekend.

## What Happened

According to Tracxn, seed-stage deals dropped from 892 in 2024 to 624 in 2025 — a 30% decline. Pre-seed was hit even harder, with a 41% drop. The total capital deployed at seed fell from $480M to $340M.

## Who''s Still Writing Checks

- **Blume Ventures** — continued deploying from Fund IV, focused on AI-native and climate tech
- **100X.VC** — maintained pace with their SAFE-note model
- **Antler India** — expanded to 3 cohorts per year
- **Titan Capital** — Snapdeal founders'' fund stayed active in D2C

## What The Survivors Had in Common

1. **Revenue traction** — even ₹2-5L MRR mattered more than TAM slides
2. **Clear wedge** — founders who could articulate exactly which 500 customers they''d serve first
3. **India-specific insight** — UPI adoption, vernacular internet, or Bharat-tier distribution

## Three Things You Can Do This Weekend

1. Add a "traction slide" with real numbers — even if small
2. Narrow your ICP to a pin code, not a persona
3. Reference a policy tailwind (ONDC, Account Aggregator, PLI)',
array['Fundraising', 'Seed', 'VCs'],
'["30% decline in seed deals", "624 seed deals in 2025", "Revenue traction > TAM slides"]'::jsonb,
true, now() - interval '21 days'),

(2, 'ONDC Just Got Interesting for Founders',
'The Open Network for Digital Commerce hit ₹1,000 Cr GMV this quarter.',
'The Open Network for Digital Commerce hit ₹1,000 Cr GMV this quarter. The three sectors where ONDC is creating distribution moats, which buyer apps are growing fastest, and how to onboard before the window closes.

## The Numbers

ONDC processed 12M+ transactions in Q1 2026, up from 4M in Q1 2025. Mobility (via Namma Yatri) accounts for 60% of volume, but food delivery and grocery are growing fastest.

## Three Sectors to Watch

1. **Food Delivery** — restaurants keeping 85% of order value vs 65% on Swiggy/Zomato
2. **Grocery** — local kiranas competing with Blinkit on equal digital footing
3. **B2B Commerce** — manufacturers listing directly, bypassing 3 layers of distribution

## How to Get Started

- Register as a seller on any ONDC-compatible seller app (mystore.in, Magicpin)
- Average onboarding takes 3-5 business days
- No platform commission — pay only for the network transaction fee (1-2%)',
array['ONDC', 'D2C', 'Distribution'],
'["₹1,000 Cr GMV", "12M+ transactions in Q1 2026", "85% revenue retention for restaurants"]'::jsonb,
true, now() - interval '14 days'),

(3, 'The New India Deep Tech Rules: What Changed',
'India doubled the deep tech startup window to 20 years and raised the revenue threshold.',
'India doubled the deep tech startup window to 20 years and raised the revenue threshold to ₹30 Cr. Which sectors benefit most, how to get DPIIT recognition, and what this means for your fundraising timeline.

## Key Changes

- **Startup recognition period**: Extended from 10 to 20 years for deep tech companies
- **Revenue threshold**: Raised from ₹100 Cr to... wait, lowered to ₹30 Cr for deep tech classification
- **Tax benefits**: Section 80-IAC tax holiday now applicable for the full extended period

## Who Benefits Most

1. **Semiconductor/chip design** — India Semiconductor Mission companies
2. **Space tech** — IN-SPACe registered startups
3. **AI/ML research** — companies with significant R&D spend (>30% of revenue)
4. **Clean energy** — battery tech, hydrogen, carbon capture

## Action Items

1. Apply for DPIIT startup recognition if you haven''t already (takes 2-3 weeks)
2. Classify your R&D spend separately in your books
3. If you''re deep tech, update your investor materials with the new policy benefits',
array['Deeptech', 'Policy', 'DPIIT'],
'["20-year startup window", "₹30 Cr revenue threshold", "Section 80-IAC extended"]'::jsonb,
true, now() - interval '7 days');
