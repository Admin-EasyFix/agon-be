import { useState, useEffect } from 'react';
import { getActivities } from '../api/strava';
import type { Activity } from '../types/strava';
//import { GeminiClient } from '../api/gemini/client';

//const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

interface UseStravaActivitiesResult {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStravaActivities(token: string | null): UseStravaActivitiesResult {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const generateAIComment = async (activity: Activity): Promise<string> => {
  //   try {
  //     const ai = new GeminiClient(apiKey);
  //     return await ai.generateComment(activity);
  //   } catch (error) {
  //     console.error('Failed to generate AI comment:', error);
  //     const distanceKm = activity.distance ? activity.distance / 1000 : 0;
  //     const durationMinutes = activity.moving_time ? activity.moving_time / 60 : 0;
      
  //     if (distanceKm > 10) {
  //       return "Impressive long distance workout! Your endurance is really building up.";
  //     } else if (distanceKm > 5) {
  //       return "Great mid-distance effort! Keep up the consistent training.";
  //     } else if (durationMinutes > 60) {
  //       return "Nice long training session! Time on feet is valuable.";
  //     } else if (activity.average_heartrate && activity.average_heartrate > 150) {
  //       return "High intensity workout! Great for building speed and power.";
  //     } else {
  //       const comments = [
  //         "Solid training session. Every workout counts!",
  //         "Good effort! Consistency is key to improvement.",
  //         "Nice work! Building that base fitness."
  //       ];
  //       return comments[Math.floor(Math.random() * comments.length)];
  //     }
  //   }
    
  // };

  const fetchActivities = async () => {
    if (!token) {
      setActivities([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const stravaActivities = await getActivities(token, 5, 1);
      
      setActivities(stravaActivities);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
}
