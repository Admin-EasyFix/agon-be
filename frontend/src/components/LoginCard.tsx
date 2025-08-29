function LoginCard() {
  return (
    <div className="login-card">
      <h2>Connect with Strava</h2>
      <p className="subtitle">
        Connect your Strava account to start analyzing your training data
      </p>
      <button className="connect-button">
        Connect
      </button>
      <p className="description">By connecting, you agree to share your activity data with Agon</p>
    </div>
  );
}

export default LoginCard;
