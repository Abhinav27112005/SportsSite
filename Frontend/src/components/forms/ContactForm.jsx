import React, { useState } from 'react';
import '../../styles/ContactForm.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Validate from './ValidationContact';
export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [message,setMessage]=useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message
          }),
        });
  
        const data = await response.json();
        
        if (response.ok) {
            setMessage('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
            setErrors({});
        } else {
          // Handle server validation errors
          setErrors({ submit: data.message || 'Please Try After Sometime' });
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
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title fw-bolder fs-2 text-primary" style={{ marginTop: 0, marginBottom: '1rem', fontSize: '2rem', lineHeight: 1.2 }}>📬 Contact Us</h2>
        {message && <div className="alert alert-success fs-5 fw-4">{message}</div>}
        <form className="contact-form" onSubmit={handleSubmit}>
        <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className={`form-control fs-5 ${errors.name ? "is-invalid" : ""}`}
          />
          {errors.name && <div className="invalid-feedback fs-5 fw-4">{errors.name}</div>}

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className={`form-control fs-5 ${errors.email ? "is-invalid" : ""}`}
          />
          {errors.email && <div className="invalid-feedback fs-5 fw-4">{errors.email}</div>}

          <textarea
            name="message"
            rows="5"
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleChange}
            className={`form-control fs-5 ${errors.message ? "is-invalid" : ""}`}
          ></textarea>
          {errors.message && <div className="invalid-feedback fs-5 fw-4">{errors.message}</div>}
          <button 
            type="submit" 
            className={`cta-button hover-soft ${isLoading ? 'cursorNone' : 'cursorPointer'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};
