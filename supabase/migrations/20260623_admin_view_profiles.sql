-- Allow admins to read all profiles (needed for showing customer email in admin orders).
-- A SECURITY DEFINER helper avoids infinite recursion that would occur if a profiles
-- policy queried the profiles table directly under RLS.

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());
