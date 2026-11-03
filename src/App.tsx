import { useState } from "react";
import SplashScreen, { type SplashState } from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Certifications from "./components/Certifications";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  const [splashState, setSplashState] = useState<SplashState>("loading");

  return (
    <>
      {splashState !== "complete" && (
        <SplashScreen
          splashState={splashState}
          onStartTransition={() => setSplashState("transitioning")}
          onComplete={() => setSplashState("complete")}
        />
      )}

      {/* Main Portfolio */}
      <div
        className="main-portfolio-root"
        style={{
          opacity: splashState === "loading" ? 0 : 1,
          transition: splashState === "transitioning" ? "opacity 0.75s ease-out" : "none",
          pointerEvents: splashState === "complete" ? "auto" : "none",
        }}
      >
        <Navbar isLogoHidden={splashState !== "complete"} />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Certifications />
        <Contact />
        <Footer />
      </div>
    </>
  );
}

export default App;
