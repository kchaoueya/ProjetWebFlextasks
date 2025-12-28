import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    const name = searchParams.get('name');
    const email = searchParams.get('email');

    if (token && userId && role && name && email) {
      // Store the token
      localStorage.setItem('flextasks_token', token);
      
      // Login the user
      login({
        id: userId,
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        role: role,
        token: token
      });

      // Redirect to appropriate dashboard
      navigate(role === 'student' ? '/student-dashboard' : '/client-dashboard');
    } else {
      // If missing parameters, redirect to login
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.loader}>
        <h2>Authenticating...</h2>
        <p>Please wait while we log you in.</p>
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
  },
  loader: {
    textAlign: 'center',
    color: '#333',
  },
};
