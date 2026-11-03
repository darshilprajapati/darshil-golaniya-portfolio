import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolioData";
import aboutVideo from "../assets/about_video_no_gemini_logo.mp4";
import "./About.css";

// Track playback-once per page visit across potential re-renders or tab switches
let hasPlayedVideoInSession = false;

const About: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Strict autoplay policy compliance: muted and playsinline
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    // If already played during this page visit, do not trigger again
    if (hasPlayedVideoInSession) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasPlayedVideoInSession) {
            hasPlayedVideoInSession = true;

            // Respect prefers-reduced-motion
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              observer.disconnect();
              return;
            }

            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch((err) => {
                // Gracefully handle browser autoplay blocks without showing controls
                console.warn("Autoplay deferred or blocked by browser:", err);
              });
            }

            // Immediately disconnect observer so scrolling away/returning does not replay
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px",
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleVideoEnded = () => {
    // When playback reaches the end, naturally retain the final frame as a still image
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <section id="about" className="about-section">
      <div className="about-split-container">
        {/* Left Side: Heading, Description, and Existing Skill Tags */}
        <motion.div
          className="about-left-content"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <div className="about-header">
            <span className="section-label">About Me</span>
            <h2 className="section-title gradient-text">
              Who I Am
            </h2>
            <div className="section-divider" />
          </div>

          <p className="about-paragraph">
            {personalInfo.summary}
          </p>

          <p className="about-paragraph">
            I specialize in building intelligent applications using AI/ML,
            along with modern full-stack technologies like React and .NET.
            My focus is on creating scalable, real-world solutions with clean
            architecture and impactful user experience.
          </p>

          {/* Skill Tags */}
          <div className="about-tags-wrapper">
            <div className="glass-card about-tag-card">
              <span className="gradient-text about-tag-text">AI / ML</span>
            </div>
            <div className="glass-card about-tag-card">
              <span className="gradient-text about-tag-text">Full Stack</span>
            </div>
            <div className="glass-card about-tag-card">
              <span className="gradient-text about-tag-text">.NET + React</span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Prominent Diagonal Clipped Video Container */}
        <motion.div
          className="about-right-visual"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div className="diagonal-video-frame">
            <div className="diagonal-video-border">
              <div className="diagonal-video-inner">
                <video
                  ref={videoRef}
                  src={aboutVideo}
                  muted
                  playsInline
                  preload="metadata"
                  className="diagonal-video-element"
                  onEnded={handleVideoEnded}
                  aria-label="Darshil visual showcase"
                />
                {/* Subtle dark gradient cyber overlay */}
                <div className="diagonal-video-overlay" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
