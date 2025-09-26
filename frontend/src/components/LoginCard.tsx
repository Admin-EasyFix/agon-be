import { useContext, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import "../styles/auth.css";

function LoginCard() {
  const { logIn } = useContext(AuthContext);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    logIn();
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