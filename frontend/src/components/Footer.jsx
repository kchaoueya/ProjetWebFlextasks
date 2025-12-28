export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.column}>
            <h3 style={styles.title}>FlexTasks</h3>
            <p style={styles.description}>
              Connecting students with local job opportunities for flexible, rewarding work.
            </p>
          </div>
          
          <div style={styles.column}>
            <h4 style={styles.heading}>For Students</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>Find Tasks</li>
              <li style={styles.listItem}>Build Your Profile</li>
              <li style={styles.listItem}>Earn Money</li>
              <li style={styles.listItem}>Get Reviews</li>
            </ul>
          </div>
          
          <div style={styles.column}>
            <h4 style={styles.heading}>For Clients</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>Post Tasks</li>
              <li style={styles.listItem}>Find Reliable Help</li>
              <li style={styles.listItem}>Rate Workers</li>
              <li style={styles.listItem}>Secure Payments</li>
            </ul>
          </div>
          
          <div style={styles.column}>
            <h4 style={styles.heading}>Company</h4>
            <ul style={styles.list}>
              <li style={styles.listItem}>About Us</li>
              <li style={styles.listItem}>Contact</li>
              <li style={styles.listItem}>Privacy Policy</li>
              <li style={styles.listItem}>Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {new Date().getFullYear()} FlexTasks. All rights reserved.
          </p>
          <div style={styles.social}>
            <span style={styles.socialLink}>Twitter</span>
            <span style={styles.socialLink}>Facebook</span>
            <span style={styles.socialLink}>Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#2c2c2c',
    color: '#fff',
    padding: '60px 20px 20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#d7747e',
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#ccc',
  },
  heading: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    fontSize: '14px',
    color: '#ccc',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  bottom: {
    borderTop: '1px solid #444',
    paddingTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  copyright: {
    fontSize: '14px',
    color: '#888',
  },
  social: {
    display: 'flex',
    gap: '24px',
  },
  socialLink: {
    fontSize: '14px',
    color: '#ccc',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
};
