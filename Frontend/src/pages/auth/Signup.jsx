import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Signup.css";
import Validate from "./SignupValidation";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value // Store direct value instead of array
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = Validate(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });
  
        const data = await response.json();
        
        if (response.ok) {
          navigate('/login');
        } else {
          // Handle server validation errors
          setErrors({ submit: data.message || 'Signup failed' });
        }
      } catch (error) {
        setErrors({ submit: 'Network error. Please try again.'+error });
      }
      finally{
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="auth-container fw-normal no-scrollbar d-flex flex-column">
      <Link to="/" className="text-center cta-button control auth-logo text-decoration-none">Home</Link>
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Sign up to join Sports Club.</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              className={`form-input ${errors.name ? "is-invalid" : ""}`}
              placeholder="John Doe"
              name="name"
              value={formData.name}
              onChange={handleInput}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              className={`form-input ${errors.email ? "is-invalid" : ""}`}
              placeholder="you@example.com"
              name="email"
              value={formData.email}
              onChange={handleInput}
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
              name="password"
              value={formData.password}
              onChange={handleInput}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${errors.confirmPassword ? "is-invalid" : ""}`}
              placeholder="••••••••"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInput}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="cta-button"  disabled={isLoading}>{isLoading ? 'Signing Up...' : 'Sign Up'}</button>
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