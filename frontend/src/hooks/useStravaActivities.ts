import { useState, useEffect } from 'react';
import { StravaClient } from '../api/strava/client';
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

  const fetchActivities = async () => {
    if (!token) {
      setActivities([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const client = new StravaClient(token);
      const stravaActivities = await client.fetchActivities(5, 1);
      
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
