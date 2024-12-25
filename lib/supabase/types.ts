export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  skill_level: number | null;
  telegram_link: string | null;
  instagram_link: string | null;
  community_rating: number;
  total_matches: number;
  email_notifications: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
}

export interface Match {
  id: string;
  host_id: string;
  venue_id: string;
  match_date: string;
  max_players: number;
  cost_per_player: number;
  is_private: boolean;
  status: 'upcoming' | 'in_progress' | 'finished' | 'cancelled';
  venue?: Venue;
  host?: Profile;
  participants?: Profile[];
}

export interface MatchRating {
  id: string;
  match_id: string;
  rated_by: string;
  rated_player: string;
  rating: number;
  is_mvp: boolean;
}