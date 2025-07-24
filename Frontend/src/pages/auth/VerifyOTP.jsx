import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../../styles/Signup.css';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Get email from location state or query params
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const emailFromState = location.state?.email;
    
    if (emailFromState) {
      setEmail(emailFromState);
    } else if (emailParam) {
      setEmail(emailParam);
    } else {
      // If no email is provided, redirect to signup
      navigate('/signup');
    }
  }, [location, navigate]);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Email verified successfully!');
        // Store token if provided
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        // Redirect to login or dashboard after a short delay
        setTimeout(() => {
          navigate('/login', { state: { verified: true } });
        }, 1500);
      } else {
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Verification code resent to your email');
        // Disable resend button for 60 seconds
        setResendDisabled(true);
        setCountdown(60);
      } else {
        setError(data.error || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Resend error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container fw-normal no-scrollbar d-flex flex-column">
      <Link to="/" className="text-center cta-button control auth-logo text-decoration-none">Home</Link>
      <div className="auth-card">
        <h2 className="auth-title">Verify Your Email</h2>
        <p className="auth-subtitle">We've sent a verification code to {email}</p>
         <p className="auth-subtitle">Please Check Your Spam Folder as Well.</p>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              className="alert alert-danger" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              className="alert alert-success" 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group mb-3">
            <label htmlFor="otp" className="form-label">Verification Code</label>
            <input
              type="text"
              id="otp"
              className="form-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength={6}
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            className="cta-button" 
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
          
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              type="button"
              className="btn btn-link text-decoration-none"
              onClick={handleResend}
              disabled={isLoading || resendDisabled}
            >
              {resendDisabled 
                ? `Resend code in ${countdown}s` 
                : 'Resend code'}
            </button>
            
            <Link to="/signup" className="btn btn-link text-decoration-none">
              Change email
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;