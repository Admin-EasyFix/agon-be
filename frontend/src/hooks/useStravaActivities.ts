import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/apiClient';
import type { Activity } from '../types/Activity';
import { isAxiosError } from 'axios';
import { useLogout } from './useLogout';

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
  const { logout } = useLogout();

  const fetchActivities = useCallback(async () => {
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
        if (isAxiosError(err) && err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
          logout();
          return; 
        } else {
          console.error('Error fetching activities:', err);
          setError('Failed to fetch activities. Please try again later.');
        }
        setActivities([]);
      } finally {
        setLoading(false);
      }
    },
    [token, logout],
  );

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
}
