import { Zap } from 'lucide-react';
import "../styles/feature.css";

function Features() {
  return (
    <section className="features">
        <div className="feature-card">
            <div className="feature-icon">
                <Zap/>
            </div>
            <div>
                <h4>Smart Training Plans</h4>
                <p className="description">AI-generated workouts based on your data</p>
            </div>
        </div>
    </section>
  );
}

export default Features;