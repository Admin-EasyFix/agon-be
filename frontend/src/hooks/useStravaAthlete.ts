import { useState, useEffect } from "react";
import userIcon from '../assets/user.png';
import { getAthlete } from "../api/strava";
import type { Athlete } from "../types/strava";

interface UseStravaAthleteResult {
  athlete: Athlete | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStravaAthlete(token: string | null): UseStravaAthleteResult {
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAthlete = async () => {
    if (!token) {
      setAthlete(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const stravaAthlete = await getAthlete(token);

      const transformedAthlete: Athlete = {
        id: stravaAthlete.id,
        username: stravaAthlete.username || "",
        firstname: stravaAthlete.firstname || "",
        lastname: stravaAthlete.lastname || "",
        profile: stravaAthlete.profile || userIcon
      };

      setAthlete(transformedAthlete);
    } catch (err) {
      console.error("Error fetching athlete:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch athlete");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAthlete();
  }, [token]);

  return {
    athlete,
    loading,
    error,
    refetch: fetchAthlete,
  };
}
