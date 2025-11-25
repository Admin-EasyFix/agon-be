import { useState, useEffect, useCallback } from "react";
import { ApiClient } from "../api/apiClient";
import type { User } from "../types/User";

interface UseAthleteResult {
  athlete: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAthlete(token: string | null): UseAthleteResult {
  const [athlete, setAthlete] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAthlete = useCallback(async () => {
    if (!token) {
      setAthlete(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const client = new ApiClient();
      const athleteData = await client.getUserProfile().then(res => res.data);
      setAthlete(athleteData);
    } catch (err) {
      console.error("Error fetching athlete:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch athlete");
    } finally {
      setLoading(false);
    }
  }, [token]);

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
