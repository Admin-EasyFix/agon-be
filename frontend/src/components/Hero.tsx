import doveIcon from '../assets/dove.svg';
import "../styles/hero.css";

function Hero() {
  return (
    <header className="hero">
      <div className="app-icon" aria-hidden="true">
        <img src={doveIcon}/>
      </div>
      <h1>Agon</h1>
      <p className="subtitle">AI-powered training insights for athletes</p>
    </header>
  );
}

export default Hero;
