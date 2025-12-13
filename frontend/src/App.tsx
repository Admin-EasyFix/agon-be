import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import LoginCard from "./components/LoginCard";
import { ActivityListCard } from "./components/ActivityListCard";
import { AIRecommendationCard } from "./components/AIRecommendationCard";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { apiClient } from "./api/apiClient";
import { useStravaActivities } from "./hooks/useStravaActivities";

function App() {
  const [token, setToken] = useState<string | null>(() => {
    const localToken = localStorage.getItem("auth_token");
    if (localToken) {
      apiClient.setToken(localToken);
      return localToken;
    }
    return null;
  });
  const { activities, loading, error: apiError, refetch } = useStravaActivities(token);

  useEffect(() => {
    const authenticateUser = () => {
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace(/^#\/?/, ""));
      const urlToken = params.get("token");

      if (urlToken) {
        localStorage.setItem("auth_token", urlToken);
        setToken(urlToken);
        apiClient.setToken(urlToken);
        console.log("User authenticated with token from URL.");
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    authenticateUser();
  }, []);

  return (
    <main>
      <div className="container">
        {!apiClient.hasToken() ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Hero />
            <Features />
            <LoginCard />
          </div>
        ) : (
          <div>
            <Navbar />
            <div className="activity-center-wrapper">
              {loading ? (
                <div className="text-center">
                  <div className="text-lg font-medium mb-2">Loading activities...</div>
                  <div className="text-muted-foreground">Fetching your latest workouts from Strava</div>
                </div>
              ) : apiError ? (
                <div className="text-center">
                  <div className="text-red-500 text-lg font-medium mb-2">Error loading activities</div>
                  <div className="text-muted-foreground mb-4">{apiError}</div>
                  <button 
                    className="connect-button" 
                    onClick={refetch}
                    style={{maxWidth: '200px'}}
                  >
                    Retry
                  </button>
                </div>
              ) : (
              <div className="authenticated-content">
                  <AIRecommendationCard activities={activities} />
                  <ActivityListCard activities={activities} />
                </div>
              )}
            </div>
          </div>
        )}
        <Footer />
      </div>
    </main>
  );
}

export default App;