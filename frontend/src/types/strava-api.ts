// Strava API response types
// Based on Strava API v3 documentation

export interface StravaActivity {
  id: number;
  name: string;
  distance?: number; // in meters
  moving_time?: number; // in seconds
  elapsed_time?: number; // in seconds
  total_elevation_gain?: number; // in meters
  type: string; // e.g., 'Run', 'Ride', 'Swim', etc.
  start_date: string; // ISO date string
  start_date_local: string; // ISO date string in local timezone
  timezone: string;
  utc_offset: number;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: 'everyone' | 'followers_only' | 'only_me';
  flagged: boolean;
  gear_id?: string;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  average_speed?: number; // in m/s
  max_speed?: number; // in m/s
  average_cadence?: number;
  has_heartrate: boolean;
  average_heartrate?: number; // in BPM
  max_heartrate?: number; // in BPM
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high?: number; // in meters
  elev_low?: number; // in meters
  upload_id?: number;
  upload_id_str?: string;
  external_id?: string;
  from_accepted_tag: boolean;
  pr_count: number;
  total_photo_count: number;
  has_kudoed: boolean;
  workout_type?: number;
  suffer_score?: number;
  description?: string;
  calories?: number;
  perceived_exertion?: number;
  prefer_perceived_exertion?: boolean;
  segment_efforts?: StravaSegmentEffort[];
  splits_metric?: StravaSplit[];
  splits_standard?: StravaSplit[];
  laps?: StravaLap[];
  gear?: StravaGear;
  partner_brand_tag?: string;
  photos?: StravaPhotosSummary;
  highlighted_kudosers?: StravaAthleteSummary[];
  device_name?: string;
  embed_token?: string;
  segment_leaderboard_opt_out: boolean;
  leaderboard_opt_out: boolean;
}

export interface StravaSegmentEffort {
  id: number;
  resource_state: number;
  name: string;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  start_index: number;
  end_index: number;
  average_cadence?: number;
  device_watts: boolean;
  average_watts?: number;
  segment: StravaSegmentSummary;
  kom_rank?: number;
  pr_rank?: number;
  achievements: unknown[];
  hidden: boolean;
}

export interface StravaSegmentSummary {
  id: number;
  resource_state: number;
  name: string;
  climb_category: number;
  climb_category_desc: string;
  avg_grade: number;
  start_latlng: [number, number];
  end_latlng: [number, number];
  elevation_high: number;
  elevation_low: number;
  distance: number;
  points: string;
  starred: boolean;
}

export interface StravaSplit {
  distance: number;
  elapsed_time: number;
  elevation_difference: number;
  moving_time: number;
  split: number;
  average_speed: number;
  pace_zone: number;
}

export interface StravaLap {
  id: number;
  resource_state: number;
  name: string;
  elapsed_time: number;
  moving_time: number;
  start_date: string;
  start_date_local: string;
  distance: number;
  start_index: number;
  end_index: number;
  total_elevation_gain: number;
  average_speed: number;
  max_speed: number;
  average_cadence?: number;
  device_watts: boolean;
  average_watts?: number;
  lap_index: number;
  split: number;
}

export interface StravaGear {
  id: string;
  primary: boolean;
  name: string;
  nickname?: string;
  resource_state: number;
  retired: boolean;
  distance: number;
  converted_distance: number;
}

export interface StravaPhotosSummary {
  primary?: StravaPhoto;
  use_primary_photo: boolean;
  count: number;
}

export interface StravaPhoto {
  id?: number;
  unique_id: string;
  urls: Record<string, string>;
  source: number;
}

export interface StravaAthleteSummary {
  id: number;
  username?: string;
  resource_state: number;
  firstname?: string;
  lastname?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
  sex?: 'M' | 'F';
  premium?: boolean;
  summit?: boolean;
  created_at?: string;
  updated_at?: string;
  badge_type_id?: number;
  weight?: number;
  profile_medium?: string;
  profile?: string;
  friend?: string;
  follower?: string;
}
