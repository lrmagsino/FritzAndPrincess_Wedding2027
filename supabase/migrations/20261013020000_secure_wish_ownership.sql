alter table public.wishes
  add column if not exists author_id uuid references auth.users(id) on delete set null,
  add column if not exists status text,
  add column if not exists updated_at timestamptz,
  add column if not exists deleted_at timestamptz,
  add column if not exists approved_at timestamptz;

update public.wishes
set
  status = coalesce(status, case when is_approved then 'approved' else 'pending' end),
  updated_at = coalesce(updated_at, created_at),
  approved_at = case
    when is_approved then coalesce(approved_at, created_at)
    else approved_at
  end;

alter table public.wishes
  alter column status set default 'pending',
  alter column status set not null,
  alter column updated_at set default now(),
  alter column updated_at set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'wishes_status_valid'
      and conrelid = 'public.wishes'::regclass
  ) then
    alter table public.wishes
      add constraint wishes_status_valid
      check (status in ('pending', 'approved', 'rejected', 'deleted'));
  end if;
end
$$;

create table if not exists public.wish_owners (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.wish_owners enable row level security;
revoke all on public.wish_owners from anon, authenticated;
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
  is_owner boolean;
  content_changed boolean;
begin
  if tg_op = 'INSERT' then
    if (select auth.uid()) is null then
      raise exception 'Sign in before submitting a wish.';
    end if;

    new.author_id := (select auth.uid());
    new.status := 'pending';
    new.is_approved := false;
    new.created_at := now();
    new.updated_at := new.created_at;
    new.deleted_at := null;
    new.approved_at := null;
    return new;
  end if;

  new.created_at := old.created_at;
  new.updated_at := now();
  new.author_id := old.author_id;
  is_owner := public.is_wish_owner();

  if is_owner then
    new.is_approved := new.status = 'approved';
    if new.status = 'approved' then
      new.approved_at := coalesce(new.approved_at, now());
    end if;
    if new.status = 'deleted' then
      new.deleted_at := coalesce(new.deleted_at, now());
    else
      new.deleted_at := null;
    end if;
    return new;
  end if;

  if (select auth.uid()) is null or old.author_id is distinct from (select auth.uid()) then
    raise exception 'You can only manage your own wishes.';
  end if;
  if old.status not in ('pending', 'approved', 'rejected') then
    raise exception 'This wish can no longer be changed by its author.';
  end if;
  if new.author_id is distinct from old.author_id then
    raise exception 'Wish ownership cannot be changed.';
  end if;
  if new.status is distinct from old.status and new.status <> 'deleted' then
    raise exception 'Authors cannot change a wish approval status.';
  end if;

  content_changed :=
    new.guest_name is distinct from old.guest_name
    or new.message is distinct from old.message
    or new.message_type is distinct from old.message_type;

  if new.status = 'deleted' then
    new.deleted_at := now();
  elsif old.status in ('approved', 'rejected') and content_changed then
    new.status := 'pending';
  end if;
  new.is_approved := new.status = 'approved';

  return new;
end
$$;

revoke all on function public.prepare_wish_write() from public, anon, authenticated;
grant execute on function public.prepare_wish_write() to authenticated;

drop trigger if exists wishes_prepare_write on public.wishes;
create trigger wishes_prepare_write
  before insert or update on public.wishes
  for each row execute function public.prepare_wish_write();

drop policy if exists "Anyone can read wishes" on public.wishes;
drop policy if exists "Anyone can read approved wishes" on public.wishes;
drop policy if exists "Anyone can submit unapproved wishes" on public.wishes;
drop policy if exists "Authenticated guests can submit wishes" on public.wishes;
drop policy if exists "Authors and owners can read wishes" on public.wishes;
drop policy if exists "Authors can edit their own wishes" on public.wishes;
drop policy if exists "Owners can manage wishes" on public.wishes;

create policy "Anyone can read approved wishes"
  on public.wishes for select
  to anon
  using (status = 'approved');

create policy "Authors and owners can read wishes"
  on public.wishes for select
  to authenticated
  using (
    status = 'approved'
    or author_id = (select auth.uid())
    or (select public.is_wish_owner())
  );

create policy "Authenticated guests can submit wishes"
  on public.wishes for insert
  to authenticated
  with check (author_id = (select auth.uid()) and status = 'pending');

create policy "Authors can edit their own wishes"
  on public.wishes for update
  to authenticated
  using (
    author_id = (select auth.uid())
    and status in ('pending', 'approved', 'rejected')
  )
  with check (
    author_id = (select auth.uid())
    and status in ('pending', 'deleted')
  );

create policy "Owners can manage wishes"
  on public.wishes for all
  to authenticated
  using ((select public.is_wish_owner()))
  with check ((select public.is_wish_owner()));

revoke all on public.wishes from anon, authenticated;
grant select on public.wishes to anon, authenticated;
grant insert (guest_name, message, message_type) on public.wishes to authenticated;
grant update (guest_name, message, message_type, status) on public.wishes to authenticated;
revoke delete on public.wishes from anon, authenticated;

create index if not exists wishes_status_created_at_idx
  on public.wishes (status, created_at desc, id desc);

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
