import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import LoginCard from "./components/LoginCard";
import { ActivityListCard } from "./components/ActivityListCard";
import { AIRecommendationCard } from "./components/AIRecommendationCard";
import { useStravaActivities } from "./hooks/useStravaActivities";
import Navbar from "./components/Navbar";

function App() {
  const { token, error } = useContext(AuthContext);
  const { activities, loading, error: apiError, refetch } = useStravaActivities(token);

  const isAuthenticated = !!token;

  return (
    <main>
      <div className="container">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Hero />
            <Features />
            <LoginCard />
            {error && (
              <div className="text-red-500 text-sm mt-4">
                Authentication error: {error}
              </div>
            )}
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