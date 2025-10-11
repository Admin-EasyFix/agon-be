import { ActivityType } from './activityType';
export interface Activity {
  id: string;
  name: string;
  date: string; // ISO date string
  distance: number; // Distance in kilometers
  pace: string;
  duration: number; // Duration in minutes
  description: string;
  elevation?: number;
  heartRate?: number;
  type: ActivityType;
}