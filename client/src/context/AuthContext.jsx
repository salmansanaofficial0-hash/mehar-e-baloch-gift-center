import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('mehar-gift-center-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('mehar-gift-center-token') || '');

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('mehar-gift-center-user', JSON.stringify(user));
      localStorage.setItem('mehar-gift-center-token', token);
      return;
    }

    localStorage.removeItem('mehar-gift-center-user');
    localStorage.removeItem('mehar-gift-center-token');
  }, [user, token]);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken('');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === 'admin',
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
