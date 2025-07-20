import React from "react";
import { motion } from "framer-motion";

export default function Testimonials({ testimonials }) {
  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="fw-bold text-center mb-4 fs-2 text-primary contact-title" style={{ letterSpacing: 1, marginTop: 0, fontSize: '2rem', lineHeight: 1.2 }}>Testimonials</h2>
        <div className="row justify-content-center g-4">
          {testimonials.map((t) => (
            <div className="col-md-4 d-flex" key={t.name}>
              <div className="testimonial-card glass-card flex-fill p-4 d-flex flex-column align-items-center text-center h-100">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="rounded-circle mb-3 shadow"
                  style={{ width: 80, height: 80, objectFit: 'cover', border: '3px solid #e3eaf7' }}
                />
                <h5 className="fw-bold mb-1">{t.name}</h5>
                <div className="text-primary mb-2" style={{ fontWeight: 500 }}>{t.role}</div>
                <p className="fst-italic flex-grow-1" style={{ color: '#3a6ea5', fontSize: '1.08rem' }}>
                  <i className="bi bi-quote fs-3 text-primary me-2"></i>{t.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 