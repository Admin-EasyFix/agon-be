import type { Activity } from "../types/Activity";
import { ActivityType } from "../types/ActivityType";

export const fakeActivities: Activity[] = [
  {
    id: 1,
    name: "Morning Run",
    date: "2025-10-05T06:30:00Z",
    distance: 5, // 5 km
    pace: "5:00/km",
    duration: 25, // 25 minutes
    description: "A refreshing morning run to start the day.",
    elevation: 50,
    heartRate: 150,
    type: ActivityType.Running,
  },
  {
    id: 2,
    name: "Evening Ride",
    date: "2025-10-04T17:00:00Z",
    distance: 20, // 20 km
    pace: "3:00/km",
    duration: 60, // 1 hour
    description: "A scenic evening ride through the countryside.",
    elevation: 200,
    type: ActivityType.Cycling,
  },
  {
    id: 3,
    name: "Pool Swim",
    date: "2025-10-03T07:00:00Z",
    distance: 1, // 1 km
    pace: "1:30/100m",
    duration: 15, // 15 minutes
    description: "A quick swim session at the local pool.",
    elevation: 0,
    type: ActivityType.Swimming,
  },
];
