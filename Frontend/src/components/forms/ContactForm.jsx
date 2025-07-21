import React, { useState } from 'react';
import '../../styles/ContactForm.css';
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingLabelInput from '../common/FloatingLabelInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    resolver: yupResolver(contactSchema)
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/contacts/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await response.json();
      if (response.ok) {
        setMessage('Message sent successfully!');
        reset();
        setTimeout(()=>setMessage(''), 5000);
      } else {
        setMessage(resData.message || 'Please Try After Sometime');
      }
    } catch (error) {
      setMessage('Network error. Please try again.' + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <h2 className="contact-title fw-bolder fs-2 text-primary" style={{ marginTop: 0, marginBottom: '1rem', fontSize: '2rem', lineHeight: 1.2 }}>📬 Contact Us</h2>
        {message && <div className="alert alert-success fs-5 fw-4">{message}</div>}
        <form className="contact-form" onSubmit={handleSubmit(onSubmit)}>
          <FloatingLabelInput
            label="Your Name"
            name="name"
            register={register('name')}
            error={errors.name}
            value={watch('name', '')}
            className="mb-1"
          />
          <FloatingLabelInput
            label="Your Email"
            name="email"
            type="email"
            register={register('email')}
            error={errors.email}
            value={watch('email', '')}
            className="mb-1"
          />
          <FloatingLabelInput
            label="Your Message"
            name="message"
            type="textarea"
            register={register('message')}
            error={errors.message}
            value={watch('message', '')}
            rows={5}
            className="mb-0"
          />
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
