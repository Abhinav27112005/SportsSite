import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Login.css";
import * as jwt_decode from 'jwt-decode';
import { refreshAuthToken } from "../../services/api/client";
import { useAuth } from "../../context/AuthContext";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
// Import FloatingLabelInput from Home (or move to shared component if desired)
import FloatingLabelInput from '../../components/common/FloatingLabelInput';
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(loginSchema)
  });
  const [isLoading, setIsLoading] = useState(false);
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

  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        // Check if the error is due to unverified email
        if (response.status === 403 && responseData.code === 'EMAIL_NOT_VERIFIED') {
          // Redirect to OTP verification page
          navigate('/verify-otp', { 
            state: { 
                  email: data.email ,
                  fromLogin: true,
                  message: responseData.message || "Please verify your email to continue logging in."
              } 
          });
          return;
        }
        throw new Error(responseData.message || 'Login failed');
      }
      
      const { token, user } = responseData;
      login(token, user);
      navigate('/');
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server - check your internet connection';
      }
      setSubmitError(errorMessage);
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fw-normal no-scrollbar d-flex flex-column ">
      <Link to="/" className="auth-logo btn btn-primary cta-button control">Home Page</Link>
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please enter your credentials to log in.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <FloatingLabelInput
            label="Email Address"
            name="email"
            type="email"
            register={register('email')}
            error={errors.email}
            value={watch('email', '')}
          />
          <FloatingLabelInput
            label="Password"
            name="password"
            type="password"
            register={register('password')}
            error={errors.password}
            value={watch('password', '')}
          />
          {/* Show submit error if needed */}
          <AnimatePresence>
            {submitError && (
              <motion.div 
                className="alert alert-danger"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>
          <button type="submit" className="cta-button" disabled={isLoading}>{isLoading ? "Login..." : "Login"}</button>
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