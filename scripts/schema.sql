create table if not exists early_access (
  id          bigint generated always as identity primary key,
  email       text        not null,
  source      text        not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

-- One row per address, case-insensitively: a repeat signup is a no-op.
create unique index if not exists early_access_email_key
  on early_access (lower(email));
