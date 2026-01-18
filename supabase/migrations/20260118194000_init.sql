create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text not null,
  color text not null,
  type text not null check (type in ('goal', 'counter')),
  frequency_type text not null check (frequency_type in ('daily', 'weekly', 'monthly')),
  target_count integer,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_target_count_check check (
    (type = 'goal' and target_count is not null and target_count > 0)
    or (type = 'counter' and target_count is null)
  )
);

create table if not exists public.task_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  performed_at timestamptz not null default now(),
  logical_date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id bigint generated always as identity primary key,
  singleton boolean not null default true unique,
  day_start_hour integer not null default 0 check (day_start_hour >= 0 and day_start_hour <= 23),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_tasks_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();

create trigger set_app_settings_updated_at
before update on public.app_settings
for each row
execute function public.set_updated_at();

create index if not exists task_logs_task_id_idx on public.task_logs (task_id);
create index if not exists task_logs_logical_date_idx on public.task_logs (logical_date);
create index if not exists task_logs_task_id_logical_date_idx on public.task_logs (task_id, logical_date);

alter table public.tasks enable row level security;
alter table public.task_logs enable row level security;
alter table public.app_settings enable row level security;

create policy "public tasks access" on public.tasks
  for all
  to public
  using (true)
  with check (true);

create policy "public task logs access" on public.task_logs
  for all
  to public
  using (true)
  with check (true);

create policy "public app settings access" on public.app_settings
  for all
  to public
  using (true)
  with check (true);

insert into public.app_settings (day_start_hour)
values (0)
on conflict do nothing;
