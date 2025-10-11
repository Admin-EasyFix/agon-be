export interface ActivityForPromt {
  id: string;
  name: string;
  distance?: number; // Distance in kilometers
  moving_time: number; // Duration in seconds
  total_elevation_gain?: number;
  average_heartrate?: number;
  type: string;
}