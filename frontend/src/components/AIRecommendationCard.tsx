import React from "react";
import type { Activity } from "../types/strava";
import { Card } from "./ui/card";
import { GeminiClient } from "../api/gemini/client";
import "../styles/ai-recommendation.css";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

interface AIRecommendationCardProps {
  activities: Activity[];
}

export const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ activities }) => {
  const generateRecommendation = async (activities: Activity[]): Promise<{ title: string; message: string; priority: 'low' | 'medium' | 'high' }> => {
    if (activities.length === 0) {
      return {
        title: "Ready to Start Your Journey?",
        message: "Welcome to Agon! Once you have some activities logged, I'll provide personalized training insights and recommendations based on your performance data.",
        priority: 'low'
      };
    }

    try {
      const ai = new GeminiClient(apiKey);
      const suggestion = await ai.generateActivity(activities);
      return { title: "Today's suggestion", message: suggestion, priority: 'medium' };
    } catch (error) {
      console.error('Failed to generate suggestion:', error);
      // Calculate recent activity metrics
      const recentActivities = activities.slice(0, 7); // Last 7 activities
      const totalDistance = recentActivities.reduce((sum, activity) => sum + (activity.distance ?? 0), 0);
      const avgDistance = totalDistance / recentActivities.length;
      const totalDuration = recentActivities.reduce((sum, activity) => sum + (activity.moving_time ?? 0), 0);
      const avgDuration = totalDuration / recentActivities.length;
  
      // Check for patterns and generate recommendations
      if (recentActivities.length >= 3) {
        // Check for consistency in past week
        const lastActivity = new Date(recentActivities[0].start_date);
        const firstActivity = new Date(recentActivities[recentActivities.length - 1].start_date);
        const daysDiff = Math.ceil((lastActivity.getTime() - firstActivity.getTime()) / (1000 * 3600 * 24));
  
        if (daysDiff <= 7 && recentActivities.length >= 3) {
          return {
            title: "Great Training Consistency! 🔥",
            message: `You've been very active with ${recentActivities.length} workouts this week. Your average distance is ${avgDistance.toFixed(1)}km. Consider adding a recovery day to prevent overtraining.`,
            priority: 'medium'
          };
        }
  
        if (avgDistance > 8) {
          return {
            title: "Strong Endurance Base 💪",
            message: `Your recent average distance of ${avgDistance.toFixed(1)}km shows excellent endurance. Try incorporating some shorter, high-intensity sessions to improve speed.`,
            priority: 'high'
          };
        }
  
        if (avgDuration > 45) {
          return {
            title: "Building Great Stamina ⏱️",
            message: `Your ${avgDuration.toFixed(0)}-minute average sessions are building solid aerobic fitness. Consider mixing in some tempo runs to enhance your lactate threshold.`,
            priority: 'medium'
          };
        }
      }
  
      // Check for running type activities
      const runningActivities = recentActivities.filter(a => a.type === 'running');
      if (runningActivities.length > 0) {
        const avgPace = runningActivities.reduce((sum, activity) => {
          return sum + (activity.moving_time ?? 0);
        }, 0) / runningActivities.length;
  
        const avgPaceMin = Math.floor(avgPace / 60);
        const avgPaceSec = Math.round(avgPace % 60);
  
        return {
          title: "Training Analysis Ready 🏃‍♂️",
          message: `Based on ${runningActivities.length} recent runs with an average pace of ${avgPaceMin}:${avgPaceSec.toString().padStart(2, '0')}/km, focus on consistent pacing and gradual mileage increases.`,
          priority: 'medium'
        };
      }
  
      return {
        title: "Keep Up The Momentum! 🚀",
        message: `${activities.length} activities logged! Your commitment to training is paying off. Keep building consistency and listen to your body for optimal results.`,
        priority: 'low'
      };
    };
  }
  
  const [recommendation, setRecommendation] = React.useState<{ title: string; message: string; priority: 'low' | 'medium' | 'high' }>({
    title: "",
    message: "",
    priority: "low",
  });

  React.useEffect(() => {
    const fetchRecommendation = async () => {
      const result = await generateRecommendation(activities);
      setRecommendation(result);
    };
    fetchRecommendation();
  }, [activities]);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🎯';
      case 'medium': return '💡';
      default: return '✨';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#dc2626'; // red
      case 'medium': return '#f59e0b'; // amber
      default: return '#10b981'; // emerald
    }
  };



  return (
    <Card className="ai-recommendation-card">
      <div className="ai-recommendation-header">
        <div className="ai-icon-container">
          <span className="ai-icon">🤖</span>
        </div>
        <div className="ai-recommendation-content">
          <div className="ai-title-row">
            <h3 className="ai-title">{recommendation.title}</h3>
            <span 
              className="priority-badge"
              style={{ backgroundColor: getPriorityColor(recommendation.priority) }}
            >
              {getPriorityIcon(recommendation.priority)}
            </span>
          </div>
          <p className="ai-message">{recommendation.message}</p>
        </div>
      </div>
    </Card>
  );
};