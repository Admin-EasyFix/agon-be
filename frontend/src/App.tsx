import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import React, { useState } from "react";
import LoginCard from "./components/LoginCard";
import type { Activity } from "./types/Activity";
import { ActivityListCard } from "./components/ActivityListCard";

const fakeActivities: Activity[] = [
  {
    id: "1",
    date: "2025-08-31T09:00:00Z",
    distance: 5.2,
    pace: "5:10/km",
    duration: 27,
    aiComment: "Great run! Keep it up.",
    elevation: 50,
    heartRate: 140,
    name: "Morning Run",
    type: "running",
  },
  {
    id: "2",
    date: "2025-08-30T18:00:00Z",
    distance: 20,
    pace: "3:00/km",
    duration: 60,
    aiComment: "Strong cycling session.",
    elevation: 200,
    heartRate: 130,
    name: "Evening Ride",
    type: "cycling",
  },
];

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <main className="container">
      <Hero />
      {!loggedIn ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <LoginCard />
          <button
            className="connect-button"
            onClick={() => setLoggedIn(true)}
          >
            Fake Login
          </button>
        </div>
      ) : (
        <ActivityListCard activities={fakeActivities} />
      )}
      <Footer />
    </main>
  );
}

export default App;
