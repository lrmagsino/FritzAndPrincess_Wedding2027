create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  message text not null,
  message_type text,
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  constraint wishes_guest_name_length
    check (char_length(btrim(guest_name)) between 1 and 60),
  constraint wishes_message_length
    check (char_length(btrim(message)) between 1 and 1000),
  constraint wishes_message_type_valid
    check (message_type is null or message_type in ('wish', 'prayer', 'both'))
);

create index if not exists wishes_created_at_idx
  on public.wishes (created_at desc, id desc);

alter table public.wishes enable row level security;

revoke all on public.wishes from anon, authenticated;
grant select, insert on public.wishes to anon, authenticated;
revoke update, delete on public.wishes from anon, authenticated;

drop policy if exists "Anyone can read approved wishes" on public.wishes;
drop policy if exists "Anyone can read wishes" on public.wishes;
create policy "Anyone can read wishes"
  on public.wishes for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit unapproved wishes" on public.wishes;
create policy "Anyone can submit unapproved wishes"
  on public.wishes for insert
  to anon, authenticated
  with check (is_approved = false);

do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
    and not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'wishes'
    )
  then
    alter publication supabase_realtime add table public.wishes;
  end if;
end
$$;
