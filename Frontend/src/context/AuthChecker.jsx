// src/components/AuthChecker.js
import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';

export default function AuthChecker({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    
    const checkLogin = () => {
      const loggedIn = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(loggedIn === 'true');
      setIsLoading(false);
    };

    checkLogin();
  }, [location]);

  // Protected pages (need login)
  const protectedPages = [
    '/members',
    '/events',
    '/coaching',
    '/finances',
    '/attendance',
    '/register',
  ];

  // If loading, show a spinner (⏳)
  if (isLoading) return <div>Loading...</div>;

  // If trying to access protected page BUT not logged in → GO TO LOGIN!
  if (protectedPages.includes(location.pathname) && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, show the page! 🎉
  return children;
}