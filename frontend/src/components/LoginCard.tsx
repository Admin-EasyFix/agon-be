import { useState } from "react";
import { apiClient } from "../api/apiClient";
import "../styles/auth.css";

function LoginCard() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    console.log("Logging in...");
    apiClient.getAuthorizationUrl('http://localhost:5173').then((response) => {
      console.log("Authorization URL:", response.data);
      window.location.href = response.data;
    }).catch((error) => {
      console.error("Failed to get authorization URL:", error);
      setIsLoggingIn(false);
    });
  };

  return (
    <div className="login-card">
      <h2>Connect with Strava</h2>
      <p className="subtitle">
        Connect your Strava account to start analyzing your training data
      </p>
      <button className="connect-button" onClick={() => handleLogin()}>
        {isLoggingIn ? "Connecting..." : "Connect with Strava"}
      </button>
      <p className="description">By connecting, you agree to share your activity data with Agon</p>
    </div>
  );
}

export default LoginCard;