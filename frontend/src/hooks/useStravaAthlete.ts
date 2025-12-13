import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../api/apiClient";
import type { User } from "../types/User";

interface UseAthleteResult {
  athlete: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAthlete(): UseAthleteResult {
  const [athlete, setAthlete] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAthlete = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const athleteData = await apiClient.getUserProfile().then(res => res.data);
      setAthlete(athleteData);
    } catch (err) {
      console.error("Error fetching athlete:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch athlete");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAthlete();
  }, [fetchAthlete]);

  return {
    athlete,
    loading,
    error,
    refetch: fetchAthlete,
  };
}
