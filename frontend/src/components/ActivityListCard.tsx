import React from "react";
import type { Activity } from "../types/Activity";
import { Card } from "./ui/card";
import "../styles/activity.css";

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
          const pace = activity.pace;

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
                  <span className="activity-duration"> {((activity.duration ?? 0)/60).toFixed(2)} min</span>
                </div>
                <div className="activity-feedback">
                  {activity.description !== undefined && <span className="activity-comment">{activity.description}</span>}
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