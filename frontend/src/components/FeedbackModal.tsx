import React, { useState } from 'react';
import { X, Star, CheckCircle2, Send } from 'lucide-react';
import { financeService } from '../api/services';
import type { FeedbackRequestDTO } from '../types';

interface FeedbackModalProps {
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ onClose }) => {
  const [experience, setExperience] = useState('Excellent');
  const [recommend, setRecommend] = useState<boolean | null>(null);
  const [likedFeatures, setLikedFeatures] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const features = ['Speed', 'Interface', 'Ease of Use', 'Security', 'Customer Support'];

  const handleCheckboxChange = (feature: string) => {
    setLikedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recommend === null) {
      alert('Please select if you would recommend us.');
      return;
    }

    setIsSubmitting(true);
    try {
      const feedback: FeedbackRequestDTO = {
        experience,
        recommend,
        likedFeatures,
        comments
      };
      await financeService.submitFeedback(feedback);
      setIsSubmitted(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      alert('Failed to submit feedback. Thank you for trying!');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={modalOverlayStyle}>
        <div className="card fade-in" style={{ ...modalContainerStyle, textAlign: 'center', padding: '40px' }}>
          <div style={{ color: 'var(--accent-primary)', marginBottom: '20px' }}>
            <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '12px' }}>Thank You!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Your feedback helps us make FinanceApp better for everyone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={modalOverlayStyle}>
      <div className="card fade-in" style={modalContainerStyle}>
        <div style={modalHeaderStyle}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Feedback</h3>
          <button onClick={onClose} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={28} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <p style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}>
            Great! Your transaction was successful. How was your experience?
          </p>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Rate your experience</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="form-control"
              style={inputStyle}
            >
              <option value="Excellent">Excellent 🚀</option>
              <option value="Good">Good 👍</option>
              <option value="Average">Average 😐</option>
              <option value="Poor">Poor 👎</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ marginBottom: '10px', display: 'block' }}>Would you recommend us?</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="recommend"
                  checked={recommend === true}
                  onChange={() => setRecommend(true)}
                  style={inputResetStyle}
                />
                <span>Yes, absolutely</span>
              </label>
              <label style={radioLabelStyle}>
                <input
                  type="radio"
                  name="recommend"
                  checked={recommend === false}
                  onChange={() => setRecommend(false)}
                  style={inputResetStyle}
                />
                <span>Maybe not yet</span>
              </label>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{ marginBottom: '10px', display: 'block' }}>What did you like most?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {features.map(feature => (
                <label key={feature} style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={likedFeatures.includes(feature)}
                    onChange={() => handleCheckboxChange(feature)}
                    style={inputResetStyle}
                  />
                  <span>{feature}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Any additional comments?</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us more..."
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '12px 24px', borderRadius: '10px', fontWeight: 600 }}
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{ padding: '12px 32px', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSubmitting ? 'Sending...' : (
                <>
                  <Send size={18} />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  backdropFilter: 'blur(6px)'
};

const modalContainerStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '520px',
  padding: 0,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const modalHeaderStyle: React.CSSProperties = {
  padding: '20px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid var(--border-color)',
  position: 'sticky',
  top: 0,
  backgroundColor: 'white',
  zIndex: 10
};

const iconBadgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--accent-light)',
  color: 'var(--accent-primary)',
  padding: '10px',
  borderRadius: '12px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  fontSize: '1rem',
  marginTop: '6px'
};

const radioLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: 500
};

const checkboxLabelStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '6px 0'
};

const inputResetStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  margin: 0,
  cursor: 'pointer'
};

export default FeedbackModal;
