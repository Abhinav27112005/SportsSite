import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Signup.css";
import Validate from "./SignupValidation";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
// Import FloatingLabelInput from Home (or move to shared component if desired)
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
  const onSubmit = async (data) => {
    setIsLoading(true);
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
        navigate('/login');
      } else {
        // Show error
        // ...
      }
    } catch (error) {
      // Show error
      // ...
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
          {/* Show submit error if needed */}
          {/* ...existing error handling... */}
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