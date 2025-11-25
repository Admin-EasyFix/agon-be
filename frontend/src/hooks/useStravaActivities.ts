import { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import type { Activity } from '../types/Activity';

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
      const stravaActivities = await apiClient.getActivities().then(res => res.data);
      
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
  }, [token]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
}
