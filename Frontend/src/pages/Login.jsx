import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import * as jwt_decode from 'jwt-decode';
import validate from "./Loginvalidation";
import { refreshAuthToken } from "../components/api";
import { useAuth } from "../Wrapper/AuthContext";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {login}=useAuth();
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const verifyAndRefresh = async () => {
    if (!token) return;

    try {
      const decoded = jwt_decode(token);
      console.log('Token status:', {
        expires: new Date(decoded.exp * 1000),
        current: new Date()
      });

      // If token expires within 5 minutes, try to refresh
      if (decoded.exp * 1000 < Date.now() + 300000) {
        const refreshed = await refreshAuthToken();
        if (!refreshed) {
          localStorage.clear();
        }
      }
    } catch (e) {
      console.error("Token verification failed:", e);
      localStorage.clear();
    }
  };

    if (token) {
      try {
        const decoded = jwt_decode(token); // Use jwt_decode correctly
        // Verify token structure
        if (!decoded || typeof decoded !== 'object') {
          throw new Error('Invalid token format');
        }
        // Add verification logging
        console.log('Token decoded:', decoded);
        console.log('Token expires:', new Date(decoded.exp * 1000));
        
        if (decoded && decoded.exp * 1000 < Date.now()) {
          // Token expired, log out
          console.log('Token expired - clearing storage');
          localStorage.clear();
        }
      } catch (e) {
        console.error("Token verification failed:", e);
        localStorage.clear();
      }
    }
    
  verifyAndRefresh();
    // Cleanup function to clear any potential event listeners or intervals
    return () => {
    };
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate(formData);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
      }
      const { token, user } = await response.json();
      login(token, user);
      navigate('/');
      
    } catch (error) {
      // More detailed error handling
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server - check your internet connection';
      }
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }
};

  return (
    <div className="auth-container fw-normal no-scrollbar d-flex flex-column ">
      <Link to="/" className="auth-logo btn btn-primary cta-button control">Home Page</Link>
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please enter your credentials to log in.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleInput}
              name="email"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className={`form-input ${errors.password ? "is-invalid" : ""}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInput}
              name="password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
              {errors.submit && (
              <div className="alert alert-danger">
                {errors.submit}
              </div>
              )}
          <button type="submit" className="cta-button" disabled={isLoading}>{isLoading?"Login...":"Login"}</button>
        </form>
        
        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link  text-decoration-none">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;