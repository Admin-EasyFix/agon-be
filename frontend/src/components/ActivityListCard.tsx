import React from "react";
import type { Activity } from "../types/Activity";
import { Card } from "./ui/card";

interface ActivityListCardProps {
  activities: Activity[];
}

export const ActivityListCard: React.FC<ActivityListCardProps> = ({ activities }) => (
  <div className="activity-list-card">
    {activities.length === 0 ? (
      <div className="text-center text-muted-foreground py-8">
        No activities found.
      </div>
    ) : (
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id}>
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-1">{activity.name}</h3>
              <div className="text-sm text-muted-foreground mb-2">
                {activity.type} &middot; {new Date(activity.date).toLocaleDateString()}
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span>Distance: {activity.distance} km</span>
                <span>Pace: {activity.pace}</span>
                <span>Duration: {activity.duration} min</span>
                {activity.elevation !== undefined && <span>Elevation: {activity.elevation} m</span>}
                {activity.heartRate !== undefined && <span>Heart Rate: {activity.heartRate} bpm</span>}
              </div>
              <div className="mt-2 italic text-xs text-muted-foreground">
                {activity.aiComment}
              </div>
            </Card>
          </li>
        ))}
      </ul>
    )}
  </div>
);