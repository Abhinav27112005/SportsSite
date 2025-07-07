import React from "react";
import {useEffect} from "react";
import { ImageSlider } from "../components/ImageSlider";
import { Gallery } from "../components/Gallery";
import { AboutUs } from "../components/AboutUS";
import { ContactForm } from "../components/ContactForm";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Home.css";

export const Home = () => {

    useEffect(()=>{
        if(window.location.hash){
            const sectionId=window.location.hash.substring(1);
            const element=document.getElementById(sectionId);
            if(element){
                setTimeout(()=>{
                    element.scrollIntoView({behavior:'smooth'});
                },100);
            }
        }
    },[]);
    
  return (
    <div className="d-flex flex-column min-vh-100" style={{scrollPaddingTop:'180px'}}>
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <ImageSlider />
          </div>
        </section>

        <div id="gallery-section">
          <Gallery />
        </div>

        <div id="about-section" className="scroll-target">
          <AboutUs />
        </div>

        <div id="contact-section">
          <ContactForm />
        </div>
      </main>

      {/* New Footer */}
      <footer className="mt-auto bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <h3 className="fw-bold mb-4">
                <img 
                  src="assets/Picture2.jpeg" 
                  alt="Sports Club Logo" 
                  style={{ height: '50px', marginRight: '10px' }}
                />
                Sports Club
              </h3>
              <p className="text-white-0 fs-5">
                Founded in 1938, we've been nurturing badminton talent for over eight decades.
              </p>
            </div>

            <div className="col-md-4">
              <h4 className="fw-bold mb-4">Quick Links</h4>
              <ul className="list-unstyled">
                <li> 
                  <a href="/" className="text-decoration-none text-white hover-primary fs-5">
                    <i className="bi bi-house-door me-2"></i> Home
                  </a>
                </li>
                <li >
                  <a href="/members" className="text-decoration-none text-white hover-primary fs-5">
                    <i className="bi bi-people me-2"></i> Members
                  </a>
                </li>
                <li >
                  <a href="/events" className="text-decoration-none text-white hover-primary fs-5">
                    <i className="bi bi-calendar-event me-2"></i> Events
                  </a>
                </li>
                <li >
                  <a href="/contact" className="text-decoration-none text-white hover-primary fs-5">
                    <i className="bi bi-envelope me-2"></i> Contact Us
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-md-4">
              <h4 className="fw-bold mb-4">Connect With Us</h4>
              <div className="d-flex gap-3 mb-4">
                <a href="#" className="text-white ">
                  <i className="bi bi-facebook hover-scale"></i>
                </a>
                <a href="#" className="text-white ">
                  <i className="bi bi-instagram hover-scale"></i>
                </a>
                <a href="#" className="text-white ">
                  <i className="bi bi-twitter-x hover-scale"></i>
                </a>
                <a href="#" className="text-white ">
                  <i className="bi bi-youtube hover-scale"></i>
                </a>
              </div>
              <div className="text-white-50">
                <i className="bi bi-geo-alt me-2"></i>
                Ranchi, Jharkhand, India
              </div>
            </div>
          </div>

          <hr className="my-4 bg-secondary" />
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              &copy; {new Date().getFullYear()} Sports Club. All rights reserved.
            </div>
            <div className="d-flex align-items-center">
              <span className="me-2">Made with</span>
              <span className="heart-beat text-danger fs-1">
                <i className="bi bi-heart-fill"></i>
              </span>
              <span className="ms-2">by</span>
              <a 
                href="https://abhinavjha.netlify.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none text-primary ms-2 fw-bold hover-underline cursor-pointer"
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
