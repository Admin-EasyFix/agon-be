import React from "react";
import type { Activity } from "../types/Activity";
import { Card } from "./ui/card";
import { apiClient } from "../api/apiClient";
import "../styles/ai-recommendation.css";

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
      const response = await apiClient.getSuggestion();
      return { title: "Today's suggestion", message: response.data.name, priority: 'medium' };
    } catch (error) {
      console.error('Failed to generate suggestion:', error);
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