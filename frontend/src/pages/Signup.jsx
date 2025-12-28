import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !role) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      // Call the backend API to register the user
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      // Auto-login after successful signup
      login({ 
        id: data._id, 
        name: data.name, 
        email: data.email, 
        role: data.role,
        token: data.token 
      });
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      navigate(role === 'student' ? '/student-dashboard' : '/client-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to backend Google OAuth route
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join FlexTasks</h2>
        <p style={styles.subtitle}>Create your account to get started</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Create a password"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="Confirm your password"
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a...</label>
            <div style={styles.roleContainer}>
              <button
                type="button"
                onClick={() => setRole('student')}
                style={{
                  ...styles.roleButton,
                  ...(role === 'student' ? styles.roleButtonActive : {}),
                }}
              >
                <span style={styles.roleIcon}>🎓</span>
                <span style={styles.roleText}>Student</span>
                <span style={styles.roleDesc}>Looking for tasks</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                style={{
                  ...styles.roleButton,
                  ...(role === 'client' ? styles.roleButtonActive : {}),
                }}
              >
                <span style={styles.roleIcon}>👤</span>
                <span style={styles.roleText}>Client</span>
                <span style={styles.roleDesc}>Posting tasks</span>
              </button>
            </div>
          </div>

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>OR</span>
          <span style={styles.dividerLine}></span>
        </div>

        <button onClick={handleGoogleSignup} style={styles.googleButton}>
          <span style={styles.googleIcon}>🔐</span>
          Sign up with Google
        </button>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f5f5f5',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  roleContainer: {
    display: 'flex',
    gap: '16px',
  },
  roleButton: {
    flex: 1,
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid #ddd',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.2s',
  },
  roleButtonActive: {
    border: '2px solid #d7747e',
    background: '#fef3f4',
  },
  roleIcon: {
    fontSize: '28px',
  },
  roleText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  roleDesc: {
    fontSize: '12px',
    color: '#666',
  },
  button: {
    background: '#d7747e',
    color: 'white',
    padding: '14px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    background: '#fee',
    color: '#c33',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#666',
  },
  link: {
    color: '#d7747e',
    textDecoration: 'none',
    fontWeight: '500',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    gap: '12px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#ddd',
  },
  dividerText: {
    color: '#888',
    fontSize: '14px',
  },
  googleButton: {
    width: '100%',
    background: 'white',
    color: '#333',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'background 0.2s',
  },
  googleIcon: {
    fontSize: '20px',
  },
};
