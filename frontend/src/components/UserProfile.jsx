import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function UserProfile({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data
    const storedUsers = JSON.parse(localStorage.getItem('flextasks_users') || '[]');
    const foundUser = storedUsers.find(u => u.id === userId);
    setUser(foundUser);

    // Load ratings for this user
    const storedRatings = JSON.parse(localStorage.getItem('flextasks_ratings') || '[]');
    const userRatings = storedRatings.filter(r => r.ratedUserId === userId);
    setRatings(userRatings);
    
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <p>User not found</p>
          <button onClick={onClose} style={styles.closeButton}>Close</button>
        </div>
      </div>
    );
  }

  const calculateAverageRating = () => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => {
      const avg = (r.punctuality + r.professionalism + r.quality + r.communication) / 4;
      return acc + avg;
    }, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const calculateCategoryAverage = (category) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r[category] || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} style={styles.star}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" style={styles.star}>★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={styles.emptyStar}>☆</span>);
    }
    return stars;
  };

  return (
    <div style={styles.modal} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{user.name}&apos;s Profile</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.profileSection}>
          <div style={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <h3 style={styles.userName}>{user.name}</h3>
            <p style={styles.userRole}>{user.role === 'client' ? '👤 Client' : '🎓 Student'}</p>
            <p style={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <div style={styles.ratingsOverview}>
          <div style={styles.overallRating}>
            <div style={styles.ratingNumber}>{calculateAverageRating()}</div>
            <div style={styles.stars}>{renderStars(parseFloat(calculateAverageRating()))}</div>
            <div style={styles.ratingCount}>{ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}</div>
          </div>

          {ratings.length > 0 && (
            <div style={styles.categoryRatings}>
              <div style={styles.categoryItem}>
                <span style={styles.categoryLabel}>Punctuality</span>
                <div style={styles.categoryBar}>
                  <div 
                    style={{
                      ...styles.categoryFill,
                      width: `${(calculateCategoryAverage('punctuality') / 5) * 100}%`
                    }}
                  />
                </div>
                <span style={styles.categoryValue}>{calculateCategoryAverage('punctuality')}</span>
              </div>
              
              <div style={styles.categoryItem}>
                <span style={styles.categoryLabel}>Professionalism</span>
                <div style={styles.categoryBar}>
                  <div 
                    style={{
                      ...styles.categoryFill,
                      width: `${(calculateCategoryAverage('professionalism') / 5) * 100}%`
                    }}
                  />
                </div>
                <span style={styles.categoryValue}>{calculateCategoryAverage('professionalism')}</span>
              </div>
              
              <div style={styles.categoryItem}>
                <span style={styles.categoryLabel}>Quality</span>
                <div style={styles.categoryBar}>
                  <div 
                    style={{
                      ...styles.categoryFill,
                      width: `${(calculateCategoryAverage('quality') / 5) * 100}%`
                    }}
                  />
                </div>
                <span style={styles.categoryValue}>{calculateCategoryAverage('quality')}</span>
              </div>
              
              <div style={styles.categoryItem}>
                <span style={styles.categoryLabel}>Communication</span>
                <div style={styles.categoryBar}>
                  <div 
                    style={{
                      ...styles.categoryFill,
                      width: `${(calculateCategoryAverage('communication') / 5) * 100}%`
                    }}
                  />
                </div>
                <span style={styles.categoryValue}>{calculateCategoryAverage('communication')}</span>
              </div>
            </div>
          )}
        </div>

        {ratings.length > 0 && (
          <div style={styles.reviewsSection}>
            <h3 style={styles.reviewsTitle}>Reviews</h3>
            <div style={styles.reviewsList}>
              {ratings.map((rating, index) => (
                <div key={index} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <span style={styles.reviewerName}>From: {rating.raterName || 'Anonymous'}</span>
                    <div style={styles.reviewStars}>
                      {renderStars((rating.punctuality + rating.professionalism + rating.quality + rating.communication) / 4)}
                    </div>
                  </div>
                  {rating.comment && (
                    <p style={styles.reviewComment}>{rating.comment}</p>
                  )}
                  <div style={styles.reviewMeta}>
                    <span>⏱️ Punctuality: {rating.punctuality}</span>
                    <span>👔 Professional: {rating.professionalism}</span>
                    <span>✨ Quality: {rating.quality}</span>
                    <span>💬 Communication: {rating.communication}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {ratings.length === 0 && (
          <div style={styles.noReviews}>
            <p>No reviews yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
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
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '32px',
    padding: '20px',
    background: '#f9f9f9',
    borderRadius: '12px',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#d7747e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  userRole: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#888',
  },
  ratingsOverview: {
    marginBottom: '32px',
  },
  overallRating: {
    textAlign: 'center',
    padding: '20px',
    marginBottom: '24px',
  },
  ratingNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#d7747e',
    marginBottom: '8px',
  },
  stars: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  star: {
    color: '#ffc107',
  },
  emptyStar: {
    color: '#ddd',
  },
  ratingCount: {
    fontSize: '14px',
    color: '#666',
  },
  categoryRatings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  categoryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  categoryLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    width: '120px',
  },
  categoryBar: {
    flex: 1,
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    background: '#d7747e',
    transition: 'width 0.3s ease',
  },
  categoryValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    width: '40px',
    textAlign: 'right',
  },
  reviewsSection: {
    marginTop: '32px',
  },
  reviewsTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewCard: {
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  reviewerName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  reviewStars: {
    fontSize: '14px',
  },
  reviewComment: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '8px',
  },
  reviewMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#888',
    flexWrap: 'wrap',
  },
  noReviews: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
  closeButton: {
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
