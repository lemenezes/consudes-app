-- ============================================================
-- CONSUDES App – Supabase Schema
-- Execute no SQL Editor do Supabase (painel > SQL Editor)
-- ============================================================

-- 1. Tabela listings
-- ============================================================
create table if not exists public.listings (
    id uuid primary key default gen_random_uuid (),
    user_id uuid not null references auth.users (id) on delete cascade,
    title text not null,
    description text not null,
    category text not null check (
        category in (
            'venda',
            'servicos',
            'indicacoes',
            'doacao',
            'imoveis'
        )
    ),
    price numeric(10, 2),
    whatsapp text not null,
    image_url text,
    author_name text not null,
    apartment text,
    status text not null default 'pending' check (
        status in (
            'pending',
            'active',
            'inactive',
            'rejected'
        )
    ),
    created_at timestamptz not null default now()
);

-- Index for common filter
create index if not exists listings_category_idx on public.listings (category);

create index if not exists listings_status_idx on public.listings (status);

create index if not exists listings_user_id_idx on public.listings (user_id);


-- ============================================================
-- 3. Profiles table (user roles)
-- ============================================================
create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    role text not null default 'user' check (role in ('user', 'admin')),
    created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "User read own profile" on public.profiles for
select using (auth.uid () = id);

-- Only service role / admin can update roles (no RLS policy for user update)
-- To grant admin: run manually in SQL Editor:
--   update public.profiles set role = 'admin' where id = '<user-uuid>';

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
    insert into public.profiles (id)
    values (new.id)
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

on conflict (id) do nothing;