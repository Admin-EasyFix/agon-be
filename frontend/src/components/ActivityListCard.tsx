import React from "react";
import type { Activity } from "../types/strava";
import { Card } from "./ui/card";
import "../styles/activity.css";

/**
 * Calculate pace (min/km or min/mi) given distance (m) and time (s).
 * 
 * @param distanceMeters Distance in meters
 * @param movingTimeSeconds Moving time in seconds
 * @param unit "km" or "mi" (default: "km")
 * @returns Formatted pace string like "5:23 /km" or "8:45 /mi"
 */
function calculatePace(
  distanceMeters: number,
  movingTimeSeconds: number,
  unit: "km" | "mi" = "km"
): string {
  if (distanceMeters <= 0 || movingTimeSeconds <= 0) {
    return `0:00 /${unit}`;
  }

  const metersPerUnit = unit === "mi" ? 1609.34 : 1000;
  const paceSecondsPerUnit = movingTimeSeconds / (distanceMeters / metersPerUnit);

  const minutes = Math.floor(paceSecondsPerUnit / 60);
  const seconds = Math.round(paceSecondsPerUnit % 60);

  return `${minutes}:${seconds.toString().padStart(2, "0")} /${unit}`;
}

interface ActivityListCardProps {
  activities: Activity[];
}

export const ActivityListCard: React.FC<ActivityListCardProps> = ({ activities }) => (
  <div className="activity-list-card">
    <div className="activity-header">Activities ({activities.length})</div>
    {activities.length === 0 ? (
      <div className="text-center text-muted-foreground py-8">
        No activities found.
      </div>
    ) : (
      <ul className="space-y-4">
        {activities.map((activity) => {
          const date = new Date(activity.start_date);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          const pace = (activity.distance !== undefined && activity.moving_time !== undefined) ? calculatePace(activity.distance, activity.moving_time, 'km') : `undefined`;

          return (
            <li key={activity.id}>
              <Card className="p-4 activity-box">
                <div className="activity-header-row">
                  <div className="activity-icons">
                    <span className="activity-icon">🏃</span>
                    <span className="activity-icon">⏱️</span>
                  </div>
                  <h3 className="activity-title">
                    {activity.name}
                  </h3>
                  <div className="activity-pace">{pace}</div>
                </div>
                <div className="activity-details">
                  <span className="activity-date">{formattedDate}</span>
                  <span className="activity-distance"> {((activity.distance ?? 0)/1000).toFixed(2)} km</span>
                  <span className="activity-duration"> {((activity.moving_time ?? 0)/60).toFixed(2)} min</span>
                </div>
                <div className="activity-feedback">
                  {activity.description !== undefined && <span className="activity-comment">{activity.description}</span>}
                </div>
                <div className="activity-metrics">
                  {activity.total_elevation_gain !== undefined && <span> {activity.total_elevation_gain}m elevation</span>}
                  {activity.average_heartrate !== undefined && <span> ~{activity.average_heartrate} bpm avg</span>}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);