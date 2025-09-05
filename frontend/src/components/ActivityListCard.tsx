import React from "react";
import type { Activity } from "../types/Activity";
import { Card } from "./ui/card";

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
          const date = new Date(activity.date);
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          const [minutes, seconds] = activity.pace.split(':').map(Number);
          const totalSeconds = minutes * 60 + seconds;
          const pacePerKm = `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, '0')}/km`;

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
                  <div className="activity-pace">{pacePerKm}</div>
                </div>
                <div className="activity-details">
                  <span className="activity-date">{formattedDate}</span>
                  <span className="activity-distance"> {activity.distance} km</span>
                  <span className="activity-duration"> {activity.duration.toString().padStart(2, '0')}:${(activity.duration % 60).toString().padStart(2, '0')}</span>
                </div>
                <div className="activity-feedback">
                  <span className="activity-comment">{activity.aiComment}</span>
                </div>
                <div className="activity-metrics">
                  {activity.elevation !== undefined && <span> {activity.elevation}m elevation</span>}
                  {activity.heartRate !== undefined && <span> ~{activity.heartRate} bpm avg</span>}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    )}
  </div>
);