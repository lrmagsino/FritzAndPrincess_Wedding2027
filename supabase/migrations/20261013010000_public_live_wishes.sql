drop policy if exists "Anyone can read approved wishes" on public.wishes;
drop policy if exists "Anyone can read wishes" on public.wishes;
create policy "Anyone can read wishes"
  on public.wishes for select
  to anon, authenticated
  using (true);

drop index if exists public.wishes_approved_created_at_idx;
create index if not exists wishes_created_at_idx
  on public.wishes (created_at desc, id desc);

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
