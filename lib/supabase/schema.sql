-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  phone_number text,
  phone_public boolean default false,
  notifications_enabled boolean default false,
  skill_level int check (skill_level between 1 and 5),
  telegram_link text,
  instagram_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  community_rating decimal(3,1) default 0,
  total_matches int default 0
);

-- Venues table
create table public.venues (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  address text not null,
  capacity int not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Matches table
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.profiles(id) not null,
  venue_id uuid references public.venues(id) not null,
  match_date timestamp with time zone not null,
  max_players int not null,
  cost_per_player decimal(10,2) not null,
  is_private boolean default false,
  status text check (status in ('upcoming', 'in_progress', 'finished', 'cancelled')) default 'upcoming',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Match participants
create table public.match_participants (
  match_id uuid references public.matches(id) on delete cascade,
  player_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (match_id, player_id)
);

-- Match ratings
create table public.match_ratings (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references public.matches(id) on delete cascade,
  rated_by uuid references public.profiles(id),
  rated_player uuid references public.profiles(id),
  rating int check (rating between 1 and 10),
  is_mvp boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(match_id, rated_by, rated_player)
);

-- Function to update community rating
create or replace function update_community_rating()
returns trigger as $$
begin
  update profiles
  set community_rating = (
    select coalesce(avg(rating), 0)
    from match_ratings
    where rated_player = NEW.rated_player
  )
  where id = NEW.rated_player;
  return NEW;
end;
$$ language plpgsql;

-- Trigger for updating community rating
create trigger update_player_rating
after insert or update on match_ratings
for each row
execute function update_community_rating();