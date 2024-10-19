/*
 * App.tsxs
 * Entry point of the application.
 * It uses the data.json file to get the data to display.
 */

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import data from './data.json';
import Sidebar from './components/Sidebar';
import Section from './components/Section';
import Projects from './components/Projects';
import ProjectInformation from './components/ProjectInformation';
import Footer from './components/Footer';
import Spacer from './components/Spacer';
import './App.css';
import { useGSAP } from '@gsap/react';

// TK CHAT INTEGRATION
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (sidebarRef.current) {
      gsap.from(sidebarRef.current, 
        { 
          duration: 1.5, 
          x: -50, 
          opacity: 0, 
          ease: "power3.out" 
        }
      );
    }

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('section');
      gsap.from(sections, 
        { 
          duration: 1.2, 
          y: 50, 
          opacity: 0, 
          stagger: 0.2, 
          ease: "power3.out" 
        }
      );

      const timelineItems = sectionsRef.current.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          x: -50,
          duration: 0.8,
        });
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 0);
    }
  }, []);

  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <Router>
      <div className="wrapper">
        <div className="container">
          <aside className="sidebar" ref={sidebarRef}>
            <Sidebar 
              name={data.name} 
              title={data.title} 
              description={data.description} 
              socialLinks={data.socialLinks} 
              isLightMode={isLightMode} 
              toggleLightMode={toggleLightMode} 
            />
          </aside>
          <main ref={sectionsRef}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <Section id="about" title="ABOUT">
                      {data.about.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </Section>
                    <Spacer />
                    <Projects projects={data.projects} />
                    <Spacer />
                    <Section id="experience" title="EXPERIENCE" timelineItems={data.experience} />
                    <Spacer />
                    <Section id="certificates" title="CERTIFICATES" timelineItems={data.certificates} />
                    <Spacer />
                    <Section id="education" title="EDUCATION" timelineItems={data.education} />
                    <Spacer />
                  </>
                } 
              />
              <Route path="/project/:projectId" element={<ProjectInformation />} />
            </Routes>
          </main>
        </div>
      </div>
      <ChatInterface /> {/* TK CHAT INTEGRATION */}
      <Footer />
    </Router>
  );  
};

export default App;
