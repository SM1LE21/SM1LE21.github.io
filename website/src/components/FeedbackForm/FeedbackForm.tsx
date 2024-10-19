// TK CHAT INTEGRATION
/*
 * FeedbackForm.tsx
 * Component for submitting feedback on the chat tool
 */

import React, { useState, FormEvent } from 'react';
import { submitFeedback } from '../../utils/api';
import './FeedbackForm.css';

interface FeedbackFormProps {
  sessionId: string;
  onClose: () => void;
  handleFeedback: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ sessionId, onClose, handleFeedback }) => {
  const [feedback, setFeedback] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await submitFeedback(sessionId, feedback);
      setSubmitted(true);
      handleFeedback();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h2>Feedback</h2>
      <p>I appreciate your feedback on the chat tool.</p>
      {!submitted ? (
        <>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your feedback..."
            required
          />
          <div className="button-group">
            <button type="submit">Submit Feedback</button>
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p>Thank you for your feedback!</p>
      )}
    </form>
  );
};

export default FeedbackForm;
