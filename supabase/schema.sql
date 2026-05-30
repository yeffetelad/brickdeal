create table if not exists clones (
  id            bigserial primary key,
  set_num       text not null,
  brand         text not null,
  model_num     text,
  quality_rating smallint not null check (quality_rating between 1 and 5),
  ali_url       text not null,
  notes         text,
  created_at    timestamptz default now()
);

create index if not exists clones_set_num_idx on clones (set_num);

-- Stats counter
create table if not exists stats (
  key   text primary key,
  value bigint not null default 0
);

insert into stats (key, value) values ('total_searches', 0)
  on conflict (key) do nothing;

create or replace function increment_stat(stat_key text)
returns void language sql as $$
  insert into stats (key, value) values (stat_key, 1)
  on conflict (key) do update set value = stats.value + 1;
$$;
