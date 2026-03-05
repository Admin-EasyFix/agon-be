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
  average_speed?: number; // in m/s
  max_speed?: number; // in m/s
  average_heartrate?: number; // in BPM
  max_heartrate?: number; // in BPM
  workout_type?: number;
  suffer_score?: number;
  description?: string;
  calories?: number;
}