import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface SidebarProps {
  name: string;
  title: string;
  description: string;
  socialLinks: { title: string; url: string; icon: string }[];
  isLightMode: boolean;
  toggleLightMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ name, title, description, socialLinks, isLightMode, toggleLightMode }) => {
    const nameRef = useRef<HTMLHeadingElement>(null);
    const iconsRef = useRef<HTMLDivElement>(null);
  
    useGSAP(() => {
        const glowAnimation = () => {
          const textShadow = isLightMode
            ? '0px 0px 8px rgba(0,0,0,0.8)'
            : '0px 0px 8px rgba(255,255,255,0.8)';
    
          gsap.to(nameRef.current, {
            duration: 5,
            textShadow: textShadow,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
          });
        };
    
        const timer = setTimeout(glowAnimation, 7000);
    
        return () => clearTimeout(timer);
    }, [isLightMode]);
  
    useGSAP(() => {
        if (iconsRef.current) {
          const timeline = gsap.timeline({ repeat: -1, repeatDelay: 5 });
          timeline
            .to(iconsRef.current.children, {
              duration: 0.6,
              rotation: 10,
              x: 10,
              yoyo: true,
              repeat: 1,
              stagger: 0.2,
              ease: 'power1.inOut'
            });
        }
      }, []);
      
      return (
        <aside className="sidebar">
          <div className="name-highlight">
            <h1 ref={nameRef}>{name}</h1>
            <div className="subtitle">{title}</div>
          </div>
          <p className="description">{description}</p>
          <div className="social-icons" ref={iconsRef}>
            {socialLinks.map(link => (
              <a key={link.title} href={link.url} title={link.title} target="_blank" rel="noopener noreferrer">
                <img src={link.icon} alt={link.title} />
              </a>
            ))}
          </div>
          <button 
            onClick={toggleLightMode} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              fontSize: '24px',
              marginTop: '20px',
              padding: '0',
            }}
          >
            {isLightMode ? '🌒' : '☀️'}
          </button>
        </aside>
      );
    };
    
    export default Sidebar;
