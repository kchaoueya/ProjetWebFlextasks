import { useState } from 'react';
import PropTypes from 'prop-types';

export default function RatingModal({ task, ratedUser, ratedBy, onSubmit, onClose }) {
  const [punctuality, setPunctuality] = useState(5);
  const [professionalism, setProfessionalism] = useState(5);
  const [quality, setQuality] = useState(5);
  const [communication, setCommunication] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!punctuality || !professionalism || !quality || !communication) {
      setError('Please rate all categories');
      return;
    }

    const rating = {
      id: crypto.randomUUID(),
      taskId: task.id,
      ratedUserId: ratedUser.id,
      ratedByUserId: ratedBy.id,
      raterName: ratedBy.name,
      punctuality,
      professionalism,
      quality,
      communication,
      comment,
      createdAt: new Date().toISOString(),
    };

    // Save rating to localStorage
    const storedRatings = JSON.parse(localStorage.getItem('flextasks_ratings') || '[]');
    storedRatings.push(rating);
    localStorage.setItem('flextasks_ratings', JSON.stringify(storedRatings));

    onSubmit(rating);
  };

  const renderStarSelector = (value, setValue, label) => {
    return (
      <div style={styles.ratingRow}>
        <label style={styles.label}>{label}</label>
        <div style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setValue(star)}
              style={{
                ...styles.star,
                color: star <= value ? '#ffc107' : '#ddd',
              }}
            >
              ★
            </span>
          ))}
          <span style={styles.ratingValue}>{value}/5</span>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Rate {ratedUser.name}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.taskInfo}>
            <h3 style={styles.taskTitle}>{task.title}</h3>
            <p style={styles.taskDesc}>Task completed successfully! Please rate your experience.</p>
          </div>

          {renderStarSelector(punctuality, setPunctuality, '⏱️ Punctuality')}
          {renderStarSelector(professionalism, setProfessionalism, '👔 Professionalism')}
          {renderStarSelector(quality, setQuality, '✨ Quality of Work')}
          {renderStarSelector(communication, setCommunication, '💬 Communication')}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Additional Comments (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.textarea}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <div style={styles.overallRating}>
            <span style={styles.overallLabel}>Overall Rating:</span>
            <span style={styles.overallValue}>
              {((punctuality + professionalism + quality + communication) / 4).toFixed(1)} / 5.0
            </span>
          </div>

          <div style={styles.buttons}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn}>
              Submit Rating
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

RatingModal.propTypes = {
  task: PropTypes.object.isRequired,
  ratedUser: PropTypes.object.isRequired,
  ratedBy: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    background: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#888',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  taskInfo: {
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '8px',
  },
  taskTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  taskDesc: {
    fontSize: '14px',
    color: '#666',
  },
  ratingRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  stars: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  star: {
    fontSize: '32px',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  ratingValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    marginLeft: '8px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  textarea: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  overallRating: {
    padding: '16px',
    background: '#f0f8ff',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  overallValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#d7747e',
  },
  buttons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #ddd',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  submitBtn: {
    background: '#d7747e',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '16px',
  },
};
