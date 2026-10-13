alter table public.wishes
  add column if not exists author_id uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz,
  add column if not exists deleted_at timestamptz;

drop trigger if exists wishes_prepare_write on public.wishes;

update public.wishes
set updated_at = coalesce(updated_at, created_at, now());

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'wishes'
      and column_name = 'status'
  ) then
    execute $query$
      update public.wishes
      set deleted_at = coalesce(deleted_at, updated_at, created_at, now())
      where status = 'deleted'
    $query$;
  end if;
end
$$;

drop policy if exists "Anyone can read wishes" on public.wishes;
drop policy if exists "Anyone can read approved wishes" on public.wishes;
drop policy if exists "Anyone can submit unapproved wishes" on public.wishes;
drop policy if exists "Authenticated guests can submit wishes" on public.wishes;
drop policy if exists "Authors and owners can read wishes" on public.wishes;
drop policy if exists "Authors can edit their own wishes" on public.wishes;
drop policy if exists "Owners can manage wishes" on public.wishes;
drop policy if exists "Guests can read active wishes" on public.wishes;
drop policy if exists "Authors can submit wishes" on public.wishes;
drop policy if exists "Authors can manage their own wishes" on public.wishes;
drop policy if exists "Owners can manage all wishes" on public.wishes;

alter table public.wishes
  alter column updated_at set default now(),
  alter column updated_at set not null;

alter table public.wishes
  drop column if exists status,
  drop column if exists is_approved,
  drop column if exists approved_at,
  drop column if exists message_type;

create table if not exists public.wish_owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.wish_owners enable row level security;
revoke all on public.wish_owners from public, anon, authenticated;
grant select on public.wish_owners to authenticated;

drop policy if exists "Owners can view their own membership" on public.wish_owners;
create policy "Owners can view their own membership"
  on public.wish_owners for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_wish_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.wish_owners
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_wish_owner() from public, anon;
grant execute on function public.is_wish_owner() to authenticated;

create or replace function public.prepare_wish_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  owner_access boolean;
begin
  if tg_op = 'INSERT' then
    if (select auth.uid()) is null then
      raise exception 'Sign in before submitting a wish.';
    end if;

    new.author_id := (select auth.uid());
    new.created_at := now();
    new.updated_at := new.created_at;
    new.deleted_at := null;
    return new;
  end if;

  new.author_id := old.author_id;
  new.created_at := old.created_at;
  new.updated_at := now();
  owner_access := public.is_wish_owner();

  if old.deleted_at is null and new.deleted_at is not null then
    new.deleted_at := now();
  elsif old.deleted_at is not null and new.deleted_at is not null then
    new.deleted_at := old.deleted_at;
  elsif old.deleted_at is not null and new.deleted_at is null and not owner_access then
    raise exception 'Only wedding owners can restore a deleted wish.';
  end if;

  return new;
end
$$;

revoke all on function public.prepare_wish_write() from public, anon, authenticated;
grant execute on function public.prepare_wish_write() to authenticated;

drop trigger if exists wishes_prepare_write on public.wishes;
create trigger wishes_prepare_write
  before insert or update on public.wishes
  for each row execute function public.prepare_wish_write();

create policy "Guests can read active wishes"
  on public.wishes for select
  to anon
  using (deleted_at is null);

create policy "Authors and owners can read wishes"
  on public.wishes for select
  to authenticated
  using (
    deleted_at is null
    or author_id = (select auth.uid())
    or (select public.is_wish_owner())
  );

create policy "Authors can submit wishes"
  on public.wishes for insert
  to authenticated
  with check (author_id = (select auth.uid()) and deleted_at is null);

create policy "Authors can manage their own wishes"
  on public.wishes for update
  to authenticated
  using (
    author_id = (select auth.uid())
    and deleted_at is null
  )
  with check (author_id = (select auth.uid()));

create policy "Owners can manage all wishes"
  on public.wishes for all
  to authenticated
  using ((select public.is_wish_owner()))
  with check ((select public.is_wish_owner()));

revoke all on public.wishes from public, anon, authenticated;
grant select on public.wishes to anon, authenticated;
grant insert (guest_name, message) on public.wishes to authenticated;
grant update (guest_name, message, deleted_at) on public.wishes to authenticated;
revoke delete on public.wishes from anon, authenticated;

drop index if exists public.wishes_approved_created_at_idx;
drop index if exists public.wishes_status_created_at_idx;
create index if not exists wishes_active_created_at_idx
  on public.wishes (created_at desc, id desc)
  where deleted_at is null;

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

notify pgrst, 'reload schema';
