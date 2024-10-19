// src/components/ChatInterface/ChatInterface.tsx
/*
  * ChatInterface.tsx
  * The chat interface component
  * It contains the chat UI and handles chat interactions
  * Communicates with the TK Chat API (Backend)
  */

import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useRef } from 'react';
import { initializeSession, sendMessage, getConfig, Message } from '../../utils/api';
import FeedbackForm from '../FeedbackForm';
import CookieConsent from '../CookieConsent';
import ChatIcon from '../ChatIcon';
import './ChatInterface.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate, useLocation } from 'react-router-dom';
import { functionCallHandlers } from '../../utils/chatFunctions';

const ChatInterface: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  
  const navigate = useNavigate();
  const location = useLocation();

  useGSAP(() => {
    if (isChatOpen && chatRef.current) {
      const screenHeight = window.innerHeight;
      const isSmallScreen = window.innerWidth <= 600;
      const targetHeight = isSmallScreen ? `${screenHeight}px` : '500px';

      gsap.fromTo(
        chatRef.current,
        { height: 0, opacity: 0 },
        { duration: 0.5, height: targetHeight, opacity: 1 }
      );
    }
  }, [isChatOpen]);

  // Check for cookie consent
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setConsentGiven(true);
    }
  }, []);

  // Initialize session after consent is given
  useEffect(() => {
    if (!consentGiven) return;

    const storedSessionId = localStorage.getItem('sessionId');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const storedMessages = localStorage.getItem('messages');
    const now = new Date().getTime();

    if (storedSessionId && sessionTimestamp && now - parseInt(sessionTimestamp, 10) < 30 * 60 * 1000) {
      setSessionId(storedSessionId);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } else {
      initializeSession()
        .then((data) => {
          setSessionId(data.session_id);
          localStorage.setItem('sessionId', data.session_id);
          localStorage.setItem('sessionTimestamp', now.toString());
        })
        .catch((error) => {
          console.error('Error initializing session:', error);
          setError('Failed to initialize session. Please try again later.');
        });
    }
  }, [consentGiven]);

  // Save messages to local storage
  useEffect(() => {
    if (consentGiven) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages, consentGiven]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Fetch configuration from backend
  useEffect(() => {
    getConfig()
      .then((config) => {
        setShowFeedback(config.showFeedback);
      })
      .catch((error) => {
        console.error('Error fetching configuration:', error);
        // Handle error if needed
      });
  }, []);

  const isSessionValid = () => {
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const now = new Date().getTime();
    return sessionTimestamp && now - parseInt(sessionTimestamp, 10) < 30 * 60 * 1000;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isSessionValid()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'system', content: 'Session expired. Please refresh the page.' },
      ]);
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (!sessionId) throw new Error('Session ID is not set.');
      const response = await sendMessage(sessionId, input);

      if (response.function_call) {
        // Handle function call
        await handleFunctionCall(response.function_call, response.content);
      } else {
        // Add the assistant message to messages
        const aiMessage: Message = {
          role: 'assistant',
          content: response.content,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }

      // Update session timestamp on successful interaction
      const now = new Date().getTime();
      localStorage.setItem('sessionTimestamp', now.toString());
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending message:', error);
        setError(error.response?.data?.detail || 'Failed to send message. Please try again later.');
      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFunctionCall = async (
    functionCall: { name: string; arguments: any },
    assistantMessageContent: string | null | undefined
  ) => {
    const handler = functionCallHandlers[functionCall.name];
    if (handler) {
      try {
        const messagesFromHandler = await handler(functionCall.arguments, {
          navigate,
          location,
        });
        // If the assistant's initial message has content, add it first
        if (assistantMessageContent) {
          const aiMessage: Message = {
            role: 'assistant',
            content: assistantMessageContent,
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage, ...messagesFromHandler]);
        } else {
          setMessages((prevMessages) => [...prevMessages, ...messagesFromHandler]);
        }
      } catch (error) {
        console.error(`Error handling function call ${functionCall.name}:`, error);
      }
    } else {
      console.warn(`Unhandled function: ${functionCall.name}`);
      // Optionally, add the assistant message if there's content
      if (assistantMessageContent) {
        const aiMessage: Message = {
          role: 'assistant',
          content: assistantMessageContent,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setConsentGiven(true);
  };

  const handleNewChat = () => {
    // Clear messages and initialize a new session
    setMessages([]);
    setInput('');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('messages');

    initializeSession()
      .then((data) => {
        setSessionId(data.session_id);
        const now = new Date().getTime();
        localStorage.setItem('sessionId', data.session_id);
        localStorage.setItem('sessionTimestamp', now.toString());
      })
      .catch((error) => {
        console.error('Error initializing new session:', error);
        setError('Failed to start a new chat. Please try again later.');
      });
  };

  const toggleChat = () => {
    if (isChatOpen) {
      // Close chat with animation
      gsap.to(chatRef.current, {
        duration: 0.5,
        height: 0,
        opacity: 0,
        onComplete: () => setIsChatOpen(false),
      });
    } else {
      setIsChatOpen(true);
      // Scroll to bottom when chat opens
      setTimeout(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const openFeedback = () => {
    setIsFeedbackOpen(true);
  };

  const closeFeedback = () => {
    setIsFeedbackOpen(false);
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackSubmitted(true);
  };

  return (
    <div>
      {!consentGiven && <CookieConsent onAccept={handleAcceptCookies} />}

      {consentGiven && (
        <>
          {!isChatOpen && <ChatIcon onClick={toggleChat} />} {/* Display chat icon when chat is closed */}

          {isChatOpen && (
            <div className="chat-interface" ref={chatRef}>
              <div className="chat-header">
                <span>TK Chat: Curious about me? Ask away!</span>
                <button className="close-button" onClick={toggleChat} aria-label="Close Chat">
                  ✖
                </button>
              </div>
              <div className="messages" ref={messagesRef}>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    <div className="message-content">
                      {/* Render message content as Markdown */}
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content || ''}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {loading && <div className="loading">AI is typing...</div>}
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="input-area">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  placeholder="Type your message..."
                />
                <button onClick={handleSend} disabled={loading || !input.trim()} className="send-button">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
              <div className="chat-footer">
                <button onClick={handleNewChat} className="new-chat-button">
                  New Chat
                </button>
                <button
                  onClick={!feedbackSubmitted ? openFeedback : undefined}
                  className={`feedback-button ${feedbackSubmitted ? 'disabled' : ''}`}
                  disabled={feedbackSubmitted}
                >
                  {feedbackSubmitted ? 'Thank You' : 'Give Feedback'}
                </button>
              </div>

              {/* Feedback modal */}
              {isFeedbackOpen && (
                <div className="feedback-modal">
                  <div className="feedback-modal-content">
                    <button className="close-feedback" onClick={closeFeedback} aria-label="Close Feedback Form">
                      ✖
                    </button>
                    {sessionId && (
                      <FeedbackForm
                        sessionId={sessionId}
                        onClose={closeFeedback}
                        handleFeedback={handleFeedbackSubmitted}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatInterface;
