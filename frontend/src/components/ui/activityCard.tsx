import React from "react";
import { Card } from "../ui/card";
import type { Activity } from "../../types/Activity";
import "../../styles/activity.css";

interface ActivityCardProps {
  activity: Activity;
  className?: string; // Added optional className prop
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, className }) => {
  const date = new Date(activity.date);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <Card className={`p-4 activity-box ${className || ""}`.trim()}>
      <div className="activity-header-row">
        <div className="activity-icons">
          <span className="activity-icon">🏃</span>
          <span className="activity-icon">⏱️</span>
        </div>
        <h3 className="activity-title">{activity.name}</h3>
        <div className="activity-pace">{activity.pace}</div>
      </div>
      <div className="activity-details">
        <span className="activity-date">{formattedDate}</span>
        {activity.distance > 0 && (
          <span className="activity-distance"> {activity.distance} km</span>
        )}
        <span className="activity-duration"> {activity.duration} min</span>
      </div>
      <div className="activity-feedback">
        {activity.description !== undefined && (
          <span className="activity-comment">{activity.description}</span>
        )}
      </div>
      <div className="activity-metrics">
        {activity.elevation !== undefined && <span> {activity.elevation}m elevation</span>}
        {activity.heartRate !== undefined && <span> ~{activity.heartRate} bpm avg</span>}
      </div>
    </Card>
  );
};