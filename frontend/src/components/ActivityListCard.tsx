import React from "react";
import type { Activity } from "../types/Activity";
import "../styles/activity.css";
import { ActivityCard } from "./ui/activityCard";

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
          return (
            <li key={activity.id}>
              <ActivityCard activity={activity} />
            </li>
          );
        })}
      </ul>
    )}
  </div>
);