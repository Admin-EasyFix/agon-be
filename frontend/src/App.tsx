import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import LoginCard from "./components/LoginCard";
import { ActivityListCard } from "./components/ActivityListCard";
import { useStravaActivities } from "./hooks/useStravaActivities";

function App() {
  const { token, logOut, error } = useContext(AuthContext);
  const { activities, loading, error: apiError, refetch } = useStravaActivities(token);

  const isAuthenticated = !!token;

  return (
    <main className="container">
      <Hero />
      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Features />
          <LoginCard />
          {error && (
            <div className="text-red-500 text-sm mt-4">
              Authentication error: {error}
            </div>
          )}
        </div>
      ) : (
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
              <button 
                className="connect-button" 
                onClick={logOut}
                style={{maxWidth: '200px', marginTop: '8px', background: '#dc2626'}}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <div className="text-right mb-4">
                <button 
                  className="text-sm text-muted-foreground hover:text-red-500 cursor-pointer"
                  onClick={logOut}
                >
                  Logout
                </button>
              </div>
              <ActivityListCard activities={activities} />
            </>
          )}
        </div>
      )}
      <Footer />
    </main>
  );
}

export default App;