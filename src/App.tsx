import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import LoginCard from "./components/LoginCard";

function App() {
  return (
    <main className="container">
      <Hero />
      <Features />
      <LoginCard />
      <Footer />
    </main>
  );
}

export default App;
