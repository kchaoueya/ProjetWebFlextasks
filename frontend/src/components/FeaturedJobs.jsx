import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/tasks?status=open`);

        if (response.ok) {
          const data = await response.json();
          setJobs(data.slice(0, 6)); // Show top 6
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatLocation = (location) => {
    if (typeof location === 'string') {
      return location;
    }
    if (location?.address) {
      return `${location.address}${location.city ? ', ' + location.city : ''}`;
    }
    return 'Location not specified';
  };

  if (loading) {
    return (
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.title}>Available Jobs</h2>
          <p style={styles.loading}>Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>Available Jobs</h2>
        <p style={styles.subtitle}>Browse open tasks and start earning</p>

        <div style={styles.grid}>
          {jobs.map(job => (
            <div key={job._id} style={styles.card}>
              <div style={styles.header}>
                <span style={styles.category}>
                  {job.category?.replace('-', ' ').toUpperCase() || 'OTHER'}
                </span>
                <span style={styles.budget}>${job.budget}</span>
              </div>
              <h3 style={styles.title}>{job.title}</h3>
              <p style={styles.description}>
                {job.description?.length > 100
                  ? job.description.substring(0, 100) + '...'
                  : job.description}
              </p>
              <div style={styles.details}>
                <span>📍 {formatLocation(job.location)}</span>
                <span>📅 {formatDate(job.scheduledDate)}</span>
                {job.estimatedDuration && <span>⏱️ {job.estimatedDuration}h</span>}
              </div>
              <Link to={`/profile/${job._id}`} style={styles.viewJob}>
                View Details
              </Link>
            </div>
          ))}
        </div>

        <div style={styles.cta}>
          <Link to="/signup?role=student" style={styles.ctaBtn}>
            Become a Student
          </Link>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '60px 20px',
    background: 'white',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  card: {
    background: '#f9f9f9',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #eee',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  category: {
    background: '#d7747e',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  budget: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#d7747e',
  },
  jobTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '16px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '14px',
    color: '#888',
    marginBottom: '16px',
  },
  viewJob: {
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