import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Signup.css";
import Validate from "./SignupValidation";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingLabelInput from '../../components/common/FloatingLabelInput';

const signupSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm your password'),
});

const Signup = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(signupSchema)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setSubmitError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        }),
      });
      const resData = await response.json();
      if (response.ok) {
        // Use the success message from the backend if available
        console.log(resData.message || "Signup successful");
        // Redirect to OTP verification page with email
        navigate('/verify-otp', { state: { email: data.email } });
      } else {
        // Display the error message from the backend
        setSubmitError(resData.error || resData.message || "Signup failed. Please try again.");
        console.error("Signup error:", resData);
      }
    } catch (error) {
        setSubmitError("Something went wrong while connecting to the server");
        console.error("Signup fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="auth-container fw-normal no-scrollbar d-flex flex-column">
      <Link to="/" className="text-center cta-button control auth-logo text-decoration-none">Home</Link>
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Sign up to join Sports Club.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <FloatingLabelInput
            label="Full Name"
            name="name"
            register={register('name')}
            error={errors.name}
            value={watch('name', '')}
          />
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
          <FloatingLabelInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            register={register('confirmPassword')}
            error={errors.confirmPassword}
            value={watch('confirmPassword', '')}
          />
          
          {/* Show submit error if present */}
          {submitError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="alert alert-danger">
              {submitError}
            </motion.div>
          )}
          
          <button type="submit" className="cta-button" disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
        </form>
        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link text-decoration-none">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;