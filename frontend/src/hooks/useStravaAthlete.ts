import { useState, useEffect, useCallback } from "react";
import { StravaClient } from "../api/strava/client";
import type { Athlete } from "../types/strava";

interface UseAthleteResult {
  athlete: Athlete | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAthlete(token: string | null): UseAthleteResult {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
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
      const client = new StravaClient(token);
      const athleteData = await client.fetchAthlete();
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
