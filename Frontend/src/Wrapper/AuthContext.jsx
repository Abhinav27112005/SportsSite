import { createContext, useContext, useEffect, useState } from 'react';
import { verifySession } from '../components/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('authToken'),
    user: JSON.parse(localStorage.getItem('user')),
    isAuthenticated: false
  });

  const login = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    setAuthState({ token, user, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    setAuthState({ token: null, user: null, isAuthenticated: false });
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (authState.token) {
          const isValid = await verifySession();
          if (!isValid) {
            logout();
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        logout();
      }
    };

    // Verify auth every 30 minutes
    const interval = setInterval(verifyAuth, 30 * 60 * 1000);

    // Initial check
    verifyAuth();
    return () => clearInterval(interval);
  }, [authState.token]);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);