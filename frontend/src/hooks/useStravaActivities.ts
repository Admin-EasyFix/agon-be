import { useState, useEffect } from 'react';
import { getActivities } from '../api/strava';
import type { Activity } from '../types/strava';
import type { StravaActivity } from '../types/strava-api';
import { GeminiClient } from '../api/gemini/client';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

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

  const calculatePace = (distanceMeters: number, timeSeconds: number): string => {
    if (!distanceMeters || !timeSeconds) return "--:--";
    
    const distanceKm = distanceMeters / 1000;
    const paceSecondsPerKm = timeSeconds / distanceKm;
    const minutes = Math.floor(paceSecondsPerKm / 60);
    const seconds = Math.round(paceSecondsPerKm % 60);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const mapActivityType = (stravaType: string): Activity['type'] => {
    const typeMap: Record<string, Activity['type']> = {
      'Run': 'running',
      'Ride': 'cycling',
      'Swim': 'swimming',
      'Hike': 'hiking',
      'Walk': 'hiking'
    };
    return typeMap[stravaType] || 'other';
  };

  const generateAIComment = async (activity: StravaActivity): Promise<string> => {
    try {
      const ai = new GeminiClient(apiKey);
      return await ai.generateComment(activity);
    } catch (error) {
      console.error('Failed to generate AI comment:', error);
      const distanceKm = activity.distance ? activity.distance / 1000 : 0;
      const durationMinutes = activity.moving_time ? activity.moving_time / 60 : 0;
      
      if (distanceKm > 10) {
        return "Impressive long distance workout! Your endurance is really building up.";
      } else if (distanceKm > 5) {
        return "Great mid-distance effort! Keep up the consistent training.";
      } else if (durationMinutes > 60) {
        return "Nice long training session! Time on feet is valuable.";
      } else if (activity.average_heartrate && activity.average_heartrate > 150) {
        return "High intensity workout! Great for building speed and power.";
      } else {
        const comments = [
          "Solid training session. Every workout counts!",
          "Good effort! Consistency is key to improvement.",
          "Nice work! Building that base fitness."
        ];
        return comments[Math.floor(Math.random() * comments.length)];
      }
    }
    
  };

  const fetchActivities = async () => {
    if (!token) {
      setActivities([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const stravaActivities = await getActivities(token, 5, 1);
      
      // Transform Strava activities to our Activity interface
      const transformedActivities: Activity[] = await Promise.all(
        stravaActivities.map(async (stravaActivity: StravaActivity) => ({
          id: stravaActivity.id.toString(),
          name: stravaActivity.name,
          date: stravaActivity.start_date,
          distance: stravaActivity.distance ? Math.round((stravaActivity.distance / 1000) * 10) / 10 : 0, // Convert meters to km
          pace: calculatePace(stravaActivity.distance || 0, stravaActivity.moving_time || 0),
          duration: Math.round((stravaActivity.moving_time || 0) / 60), // Convert seconds to minutes
          aiComment: await generateAIComment(stravaActivity),
          elevation: stravaActivity.total_elevation_gain,
          heartRate: stravaActivity.average_heartrate,
          type: mapActivityType(stravaActivity.type)
        }))
      );
      
      setActivities(transformedActivities);
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
