import { createContext, useContext, useState, useCallback } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('FlexTasks_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('FlexTasks_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('FlexTasks_user');
  }, []);

  const value = {
    user,
    login,
    logout,
    loading: false,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student',
    isClient: user?.role === 'client',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
