import { ActivityType } from './ActivityType';
export interface Activity {
  id: number;
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