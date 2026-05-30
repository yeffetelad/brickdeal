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
