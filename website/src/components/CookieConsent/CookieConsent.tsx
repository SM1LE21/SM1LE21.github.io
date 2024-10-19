// TK CHAT INTEGRATION
/*
 *  CookieConsent.tsx
 *  Component for displaying a cookie consent message
 *  TK Chat is only enabled if the user accepts the cookie consent
 */

import React from 'react';
import './CookieConsent.css';

interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  return (
    <div className="cookie-consent">
      <p>
        This site offers the TK Chat feature, which allows you to interact with an AI system. If you choose to use this feature, it will store conversation data, session IDs, and other relevant information. While the AI is designed to provide helpful responses, I cannot fully control its output.
      </p>
      <button onClick={onAccept}>Accept & Enable Chat</button>
    </div>
  );
};

export default CookieConsent;
