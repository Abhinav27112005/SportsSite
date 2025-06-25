import React from 'react';
import './AboutUS.css';
import "bootstrap/dist/css/bootstrap.min.css";
export const AboutUs = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        <h2 className="about-title fs-1 fw-bolder text-info">👥 About Us</h2>
        <p className="about-description fs-4 fw-normal">
          Welcome to our organization! We are dedicated to promoting excellence through events, coaching,
          and community engagement. Our mission is to provide opportunities for growth, skill development,
          and meaningful connections among our members. Whether you're a seasoned participant or a new face,
          we're excited to have you on this journey with us.
        </p>
      </div>
    </section>
  );
};
