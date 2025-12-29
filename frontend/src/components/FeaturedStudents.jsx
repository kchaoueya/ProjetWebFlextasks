import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/auth/students`);

        if (response.ok) {
          const data = await response.json();
          setStudents(data.slice(0, 6)); // Show top 6
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.title}>Available Students</h2>
          <p style={styles.loading}>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Available Students</h2>
        <p style={styles.subtitle}>Find skilled students for your tasks</p>

        <div style={styles.grid}>
          {students.map(student => (
            <div key={student._id} style={styles.card}>
              <div style={styles.avatar}>
                {student.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <h3 style={styles.name}>{student.name}</h3>
              <div style={styles.rating}>
                <span style={styles.star}>★</span>
                <span>{student.averageRating?.toFixed(1) || '0.0'}</span>
                <span style={styles.reviews}>({student.totalRatings || 0})</span>
              </div>
              {student.skills && student.skills.length > 0 && (
                <div style={styles.skills}>
                  {student.skills.slice(0, 2).map(skill => (
                    <span key={skill} style={styles.skill}>{skill}</span>
                  ))}
                </div>
              )}
              {student.hourlyRate && (
                <p style={styles.rate}>${student.hourlyRate}/hr</p>
              )}
              <Link to={`/profile/${student._id}`} style={styles.viewProfile}>
                View Profile
              </Link>
            </div>
          ))}
        </div>

        <div style={styles.cta}>
          <Link to="/signup?role=client" style={styles.ctaBtn}>
            Post a Task
          </Link>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '60px 20px',
    background: '#f9f9f9',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '40px',
  },
  loading: {
    textAlign: 'center',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#d7747e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: '700',
    margin: '0 auto 16px',
  },
  name: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: '12px',
  },
  star: {
    color: '#ffc107',
  },
  reviews: {
    color: '#666',
    fontSize: '14px',
  },
  skills: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  skill: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
  },
  rate: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#d7747e',
    marginBottom: '16px',
  },
  viewProfile: {
    display: 'inline-block',
    background: '#d7747e',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '14px',
  },
  cta: {
    textAlign: 'center',
  },
  ctaBtn: {
    display: 'inline-block',
    background: '#d7747e',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '16px',
  },
};