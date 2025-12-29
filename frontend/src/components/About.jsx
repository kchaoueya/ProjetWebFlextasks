export default function About() {
  return (
    <section id="about" style={styles.section}>
      <div style={styles.container}>
        <h2 style={styles.title}>About FlexTasks</h2>
        <p style={styles.description}>
          FlexTasks is a platform that connects students with local clients for flexible, part-time work opportunities.
          Our mission is to help students earn money while providing reliable help to clients in their community.
        </p>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <h3 style={styles.statNumber}>1000+</h3>
            <p style={styles.statText}>Tasks Completed</p>
          </div>
          <div style={styles.stat}>
            <h3 style={styles.statNumber}>500+</h3>
            <p style={styles.statText}>Happy Students</p>
          </div>
          <div style={styles.stat}>
            <h3 style={styles.statNumber}>200+</h3>
            <p style={styles.statText}>Satisfied Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '80px 20px',
    background: '#f9f9f9',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '20px',
  },
  description: {
    fontSize: '18px',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '60px',
    maxWidth: '800px',
    margin: '0 auto 60px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
  },
  stat: {
    padding: '20px',
  },
  statNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#d7747e',
    marginBottom: '10px',
  },
  statText: {
    fontSize: '16px',
    color: '#666',
  },
};