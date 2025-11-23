import { useState } from "react";
import { apiClient } from "../api/apiClient";
import "../styles/auth.css";

function LoginCard() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    apiClient.getAuthorizationUrl(window.location.origin)
    .then((response) => {
      const url = (response.data as { authorization_url?: string })?.authorization_url;
      if (!url) {
        throw new Error("Missing authorization_url in response");
      }
      window.location.href = url;
    })
    .catch((error) => {
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