import { useContext, useState } from "react";
import { apiClient } from "../api/apiClient";
import { AuthContext } from "react-oauth2-code-pkce";

export function useLogout() {
  const { logOut } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.deauthorize();
    } catch (err) {
      console.error("Error calling deauthorize endpoint:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      // Clear local auth state and call library logout if available
      try {
        localStorage.removeItem("auth_token");
      } catch (e) {
        // ignore
      }
      try {
        if (typeof logOut === "function") logOut();
      } catch (e) {
        console.error("Error calling AuthContext.logOut:", e);
      }
      setLoading(false);
      // navigate to root to reset UI
      try {
        window.location.href = "/";
      } catch (e) {
        // ignore
      }
    }
  };

  return { logout, loading, error } as const;
}

export default useLogout;
