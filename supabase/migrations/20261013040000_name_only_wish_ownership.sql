create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.wish_author_tokens (
  wish_id uuid primary key references public.wishes(id) on delete cascade,
  token_hash text not null
);

alter table public.wish_author_tokens enable row level security;
revoke all on public.wish_author_tokens from public, anon, authenticated;

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

create or replace function public.submit_wish(
  p_guest_name text,
  p_message text,
  p_author_token text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_wish_id uuid;
begin
  if char_length(btrim(p_guest_name)) not between 1 and 60 then
    raise exception 'Name must be between 1 and 60 characters.';
  end if;
  if char_length(btrim(p_message)) not between 1 and 1000 then
    raise exception 'Wish must be between 1 and 1000 characters.';
  end if;
  if p_author_token !~ '^[0-9a-f]{64}$' then
    raise exception 'A valid private wish ownership token is required.';
  end if;

  insert into public.wishes (guest_name, message)
  values (btrim(p_guest_name), btrim(p_message))
  returning id into new_wish_id;

  insert into public.wish_author_tokens (wish_id, token_hash)
  values (
    new_wish_id,
    encode(extensions.digest(convert_to(p_author_token, 'UTF8'), 'sha256'), 'hex')
  );

  return new_wish_id;
end
$$;

revoke all on function public.submit_wish(text, text, text) from public;
grant execute on function public.submit_wish(text, text, text) to anon, authenticated;

create or replace function public.manage_wish_by_token(
  p_wish_id uuid,
  p_author_token text,
  p_guest_name text,
  p_message text,
  p_delete boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  stored_token_hash text;
  updated_count integer;
begin
  if p_author_token !~ '^[0-9a-f]{64}$' then
    raise exception 'This browser does not have valid management access for the wish.';
  end if;

  select token_hash into stored_token_hash
  from public.wish_author_tokens
  where wish_id = p_wish_id;

  if stored_token_hash is null
    or stored_token_hash <> encode(extensions.digest(convert_to(p_author_token, 'UTF8'), 'sha256'), 'hex')
  then
    raise exception 'This browser does not have permission to manage this wish.';
  end if;

  if char_length(btrim(p_guest_name)) not between 1 and 60 then
    raise exception 'Name must be between 1 and 60 characters.';
  end if;
  if char_length(btrim(p_message)) not between 1 and 1000 then
    raise exception 'Wish must be between 1 and 1000 characters.';
  end if;

  update public.wishes
  set
    guest_name = btrim(p_guest_name),
    message = btrim(p_message),
    deleted_at = case when p_delete then now() else deleted_at end
  where id = p_wish_id
    and deleted_at is null;

  get diagnostics updated_count = row_count;
  if updated_count = 0 then
    raise exception 'This wish is no longer available to manage.';
  end if;

  return true;
end
$$;

revoke all on function public.manage_wish_by_token(uuid, text, text, text, boolean) from public;
grant execute on function public.manage_wish_by_token(uuid, text, text, text, boolean)
  to anon, authenticated;

revoke insert, update on public.wishes from anon, authenticated;
grant update (guest_name, message, deleted_at) on public.wishes to authenticated;

notify pgrst, 'reload schema';
