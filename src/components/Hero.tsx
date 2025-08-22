import doveIcon from '../assets/dove.svg';

function Hero() {
  return (
    <header className="hero">
      <div className="app-icon" aria-hidden="true">
        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img">
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F8D566" />
              <stop offset="100%" stopColor="#8A6A2B" />
            </linearGradient>
          </defs>
          <rect x="16" y="16" width="224" height="224" rx="48" fill="url(#g)" />
          <image href={doveIcon} x="32" y="32" width="192" height="192" preserveAspectRatio="xMidYMid meet" />
        </svg>
      </div>
      <h1>Agon</h1>
      <p className="subtitle">AI-powered training insights for athletes</p>
    </header>
  );
}

export default Hero;
