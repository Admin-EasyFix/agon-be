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
    date: "2025-07-23T18:00:00Z",
    distance: 4.7,
    pace: "6:15",
    duration: 29,
    aiComment: "Great effort! Keep up the consistent training.",
    elevation: 23,
    heartRate: 137,
    name: "Night Run",
    type: "running",
  },
  {
    id: "2",
    date: "2025-07-20T18:00:00Z",
    distance: 6.2,
    pace: "9:55",
    duration: 60,
    aiComment: "Great effort! Keep up the consistent training.",
    elevation: 13,
    heartRate: 99,
    name: "Night Run",
    type: "running",
  },
  {
    id: "3",
    date: "2025-07-19T06:00:00Z",
    distance: 6.0,
    pace: "4:05",
    duration: 30,
    aiComment: "Great effort! Keep up the consistent training.",
    elevation: undefined,
    heartRate: 183,
    name: "Morning Run",
    type: "running",
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
        <div className="activity-center-wrapper">
          <ActivityListCard activities={fakeActivities} />
        </div>
      )}
      <Footer />
    </main>
  );
}

export default App;