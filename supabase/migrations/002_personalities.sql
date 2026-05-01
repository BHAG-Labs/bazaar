-- Bazaar: AI columnist personalities, their columns, and subscriber personalisation.
-- Phase 2 kickoff migration. See Notion "Bazaar App Roadmap" + "Technical Architecture".
-- Applied to the live Supabase project on 2026-05-01 via MCP.

create table if not exists public.agent_personalities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  tagline text,
  beat text,
  avatar_url text,
  avatar_style text,
  voice_spec text not null,
  backstory text not null,
  signature_opener text,
  signature_closer text,
  forbidden_phrases text[] default '{}',
  slot integer not null default 99,
  model_preference text not null default 'gemini-2.5-pro',
  active boolean not null default true,
  coming_soon boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.agent_personalities enable row level security;
create policy "Anyone reads active personalities" on public.agent_personalities
  for select using (active = true or coming_soon = true);
create policy "Admins manage personalities" on public.agent_personalities
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create table if not exists public.agent_columns (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references public.newsletter_issues(id) on delete cascade,
  personality_id uuid not null references public.agent_personalities(id) on delete restrict,
  title text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft','review','approved','published','archived')),
  model_used text,
  word_count integer,
  sources jsonb default '[]',
  editor_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);
alter table public.agent_columns enable row level security;
create policy "Anyone reads published columns" on public.agent_columns
  for select using (status = 'published');
create policy "Admins manage columns" on public.agent_columns
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));
create index if not exists agent_columns_issue_idx on public.agent_columns(issue_id);
create index if not exists agent_columns_personality_idx on public.agent_columns(personality_id);
create index if not exists agent_columns_status_idx on public.agent_columns(status);

create table if not exists public.subscriber_personality_preferences (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid not null references public.newsletter_subscribers(id) on delete cascade,
  personality_id uuid not null references public.agent_personalities(id) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz default now(),
  unique (subscriber_id, personality_id)
);
alter table public.subscriber_personality_preferences enable row level security;
create policy "Anyone can insert prefs at signup" on public.subscriber_personality_preferences
  for insert with check (true);
create policy "Admins read all prefs" on public.subscriber_personality_preferences
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create table if not exists public.content_sources (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text,
  source_name text,
  published_at timestamptz,
  fetched_at timestamptz default now(),
  raw_excerpt text,
  tags text[] default '{}',
  cluster_id text,
  unique (url)
);
alter table public.content_sources enable row level security;
create policy "Admins read sources" on public.content_sources
  for select using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create table if not exists public.research_briefs (
  id uuid primary key default gen_random_uuid(),
  issue_number integer,
  window_start date,
  window_end date,
  brief_markdown text,
  gcs_path text,
  editor_notes text,
  created_at timestamptz default now()
);
alter table public.research_briefs enable row level security;
create policy "Admins read briefs" on public.research_briefs
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  column_id uuid references public.agent_columns(id) on delete set null,
  personality_id uuid references public.agent_personalities(id),
  platform text not null check (platform in ('x','instagram','youtube','linkedin')),
  post_type text not null check (post_type in ('thread','carousel','reel','post','short')),
  body text,
  media_urls text[] default '{}',
  scheduled_for timestamptz,
  posted_at timestamptz,
  external_id text,
  status text not null default 'draft' check (status in ('draft','approved','scheduled','posted','failed')),
  created_at timestamptz default now()
);
alter table public.social_posts enable row level security;
create policy "Admins manage social" on public.social_posts
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create table if not exists public.sponsorships (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references public.newsletter_issues(id) on delete set null,
  sponsor_name text not null,
  copy text not null,
  url text,
  amount_inr integer,
  invoice_url text,
  created_at timestamptz default now()
);
alter table public.sponsorships enable row level security;
create policy "Admins manage sponsorships" on public.sponsorships
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create table if not exists public.print_editions (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references public.newsletter_issues(id) on delete cascade,
  pdf_url text,
  print_run integer,
  printer_invoice_url text,
  delivered_count integer,
  printed_on date,
  delivered_on date,
  created_at timestamptz default now()
);
alter table public.print_editions enable row level security;
create policy "Admins manage print editions" on public.print_editions
  for all using (exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','superadmin')));

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists trg_agent_personalities_updated on public.agent_personalities;
create trigger trg_agent_personalities_updated before update on public.agent_personalities
for each row execute function public.set_updated_at();

drop trigger if exists trg_agent_columns_updated on public.agent_columns;
create trigger trg_agent_columns_updated before update on public.agent_columns
for each row execute function public.set_updated_at();
