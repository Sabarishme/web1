create table public.visitors (
  anonymous_id text primary key,
  browser text,
  os text,
  device text,
  language text,
  timezone text,
  screen text,
  viewport text,
  cpu integer,
  memory numeric,
  touch integer,
  pixel_ratio numeric,
  canvas_hash text,
  webgl text,
  fingerprint_hash text not null,
  last_seen timestamptz default now()
);

alter table public.visitors enable row level security;

create index visitors_last_seen_idx
on public.visitors(last_seen desc);
