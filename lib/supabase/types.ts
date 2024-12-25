export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  phone_number_visible: boolean;
  email_notifications: boolean;
  community_rating: number | null;
  speed: number | null;
  pace: number | null;
  power: number | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  phone_number: string | null;
  created_at: string;
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