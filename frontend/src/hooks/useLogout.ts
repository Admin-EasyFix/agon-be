import { useCallback, useState } from "react";
import { apiClient } from "../api/apiClient";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deauthorize();
      apiClient.setToken(null);
    } catch (err) {
      console.error("Error calling deauthorize endpoint:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      try {
        localStorage.removeItem("auth_token");
      } catch (err) {
        console.error("Error removing auth token:", err);
        setError(err instanceof Error ? err.message : String(err));
      }
      setLoading(false);
      try {
        window.location.href = "/";
      } catch (err) {
        console.error("Error redirecting to home page", err);
        setError(err instanceof Error ? err.message : String(err));
      }
    }
  }, []);

  return { logout, loading, error } as const;
}

export default useLogout;
