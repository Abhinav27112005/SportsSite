import React from "react";
import { ImageSlider } from "../components/ImageSlider";
import { Gallery } from "../components/Gallery";
import { AboutUs } from "../components/AboutUS";
import { ContactForm } from "../components/ContactForm";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

export const Home = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <ImageSlider />
          </div>
        </section>

        <Gallery />
        <AboutUs />
        <ContactForm />
      </main>

      {/* New Footer */}
      <footer className="mt-auto bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h3 className="fs-3 fw-bold mb-4">
                <img 
                  src="assets/Picture2.png" 
                  alt="Bijoy Institute Logo" 
                  style={{ height: '50px', marginRight: '10px' }}
                />
                Bijoy Institute
              </h3>
              <p className="text-white-50">
                Founded in 1938, we've been nurturing badminton talent for over eight decades.
              </p>
            </div>

            <div className="col-md-4">
              <h4 className="fs-4 fw-bold mb-4">Quick Links</h4>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="/" className="text-decoration-none text-white hover-primary">
                    <i className="bi bi-house-door me-2"></i> Home
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/members" className="text-decoration-none text-white hover-primary">
                    <i className="bi bi-people me-2"></i> Members
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/events" className="text-decoration-none text-white hover-primary">
                    <i className="bi bi-calendar-event me-2"></i> Events
                  </a>
                </li>
                <li className="mb-2">
                  <a href="/contact" className="text-decoration-none text-white hover-primary">
                    <i className="bi bi-envelope me-2"></i> Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4">
              <h4 className="fs-4 fw-bold mb-4">Connect With Us</h4>
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="text-white fs-3">
                  <i className="bi bi-facebook hover-scale"></i>
                </a>
                <a href="#" className="text-white fs-3">
                  <i className="bi bi-instagram hover-scale"></i>
                </a>
                <a href="#" className="text-white fs-3">
                  <i className="bi bi-twitter-x hover-scale"></i>
                </a>
                <a href="#" className="text-white fs-3">
                  <i className="bi bi-youtube hover-scale"></i>
                </a>
              </div>
              <div className="text-white-50 fs-3">
                <i className="bi bi-geo-alt me-2"></i>
                Gridih, Jharkhand, India
              </div>
            </div>
          </div>

          <hr className="my-4 bg-secondary" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-3 mb-md-0 fs-4">
              &copy; {new Date().getFullYear()} Bijoy Institute. All rights reserved.
            </div>
            <div className="d-flex align-items-center fs-4">
              <span className="me-2">Made with</span>
              <span className="heart-beat text-danger fs-1">
                <i className="bi bi-heart-fill"></i>
              </span>
              <span className="ms-2">by</span>
              <a 
                href="https://abhinavjha.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none text-primary ms-2 fw-bold hover-underline"
              >
                Abhinav
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};