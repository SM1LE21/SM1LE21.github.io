// TK CHAT INTEGRATION
/*
 * ChatIcon.tsx
 * When clicked, the chat icon opens the chat interface
 */

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import './ChatIcon.css';
import { useGSAP } from '@gsap/react';

interface ChatIconProps {
  onClick: () => void;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
  const iconRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (iconRef.current) {
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 25, delay: 10 });
  
      // Jump up and rotate 360-degree animation
      timeline
        .to(iconRef.current, {
          duration: 0.6,  
          y: -40,         
          rotation: 360,  
          ease: 'power1.out',
        })
        .to(iconRef.current, {
          duration: 0.3, 
          y: 0,       
          ease: 'bounce.out',
          
        })
        .to(iconRef.current, {
          duration: 2,
          rotation: 360,
        })
        .to(iconRef.current, {
          duration: 0.6,  
          y: -40,         
          rotation: -0,  
          ease: 'power1.out',
        })
        .to(iconRef.current, {
          duration: 0.3, 
          y: 0,       
          ease: 'bounce.out',
        });
      
    }
  }, []);
  

  return (
    <div className="chat-icon" onClick={onClick} ref={iconRef}>
      <FontAwesomeIcon icon={faComment} className="chat-icon-symbol" />
    </div>
  );
};

export default ChatIcon;
