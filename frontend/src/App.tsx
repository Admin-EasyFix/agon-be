import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import { useState } from "react";
import LoginCard from "./components/LoginCard";
import { fakeActivities } from "./data/mockData";

import { ActivityListCard } from "./components/ActivityListCard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <main className="container">
      <Hero />
      {!loggedIn ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Features />
          <LoginCard />
          <button
            className="connect-button"
            onClick={() => setLoggedIn(true)}
          >
            Fake Login
          </button>
        </div>
      ) : (
        <div className="activity-center-wrapper">
          <ActivityListCard activities={fakeActivities} />
        </div>
      )}
      <Footer />
    </main>
  );
}

export default App;