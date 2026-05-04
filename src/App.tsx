import { useState } from "react";
import SplashScreen from "./components/SplashScreen";
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
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <>
      {!loadingDone && <SplashScreen onComplete={() => setLoadingDone(true)} />}

      {loadingDone && (
        <>
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Certifications />
          <Contact />
          <Footer />
        </>
      )}
    </>
  );
}

export default App;