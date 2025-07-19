import React, { useRef } from "react";
import { useEffect } from "react";
import { ImageSlider } from "../../components/features/gallery/ImageSlider";
import { Gallery } from "../../components/features/gallery/Gallery";
import { AboutUs } from "../../components/common/AboutUS";
import { ContactForm } from "../../components/forms/ContactForm";
import FloatingSubmenu from "../../components/layout/FloatingSubmenu";
import { motion, useScroll, useTransform } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Home.css";
import Testimonials from "../../components/common/Testimonials";

const testimonials = [
  {
    name: "Aarav Singh",
    role: "National Player",
    photo: "assets/images/gallery10.jpeg",
    quote: "The coaching and facilities here are world-class. Joining this club was the best decision for my career!",
  },
  {
    name: "Priya Sharma",
    role: "Alumni & Coach",
    photo: "assets/images/gallery14.jpeg",
    quote: "I grew from a beginner to a champion here. Now, as a coach, I love giving back to the next generation.",
  },
  {
    name: "Rahul Verma",
    role: "Parent",
    photo: "assets/images/gallery18.jpeg",
    quote: "My daughter’s confidence and skills have soared. The club’s environment is nurturing and inspiring.",
  },
];

export const Home = () => {
  // Parallax for hero background
  const heroRef = useRef(null);
  const { scrollY } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollY, [0, 300], [0, 80]);

  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  // Animation variants with staggered delays
  const fadeInDown = {
    initial: { opacity: 0, y: -30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.05 } },
    viewport: { once: true, amount: 0.2 },
  };
  const fadeInRight = {
    initial: { opacity: 0, x: 40 },
    whileInView: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.18 } },
    viewport: { once: true, amount: 0.2 },
  };
  const fadeInLeft = {
    initial: { opacity: 0, x: -40 },
    whileInView: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.32 } },
    viewport: { once: true, amount: 0.2 },
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: 0.46 } },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <div className="d-flex flex-column min-vh-100 home-bg" style={{ scrollPaddingTop: '180px' }}>
      <main>
        <section className="hero-section" ref={heroRef} style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Parallax background */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '120%',
              zIndex: 0,
              background: 'linear-gradient(120deg, #e3eaf7 0%, #f5f8fa 100%)',
              y,
              filter: 'blur(2.5px)',
            }}
            aria-hidden="true"
          />
          {/* Hero content with fade-in-down */}
          <motion.div {...fadeInDown} style={{ position: 'relative', zIndex: 1 }}>
            <div className="hero-content">
              <ImageSlider />
            </div>
          </motion.div>
        </section>

        <section id="gallery-section">
          <motion.div {...fadeInRight}>
            <Gallery />
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials-section" className="py-5">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <Testimonials testimonials={testimonials} />
          </motion.div>
        </section>

        <section id="about-section" className="scroll-target">
          <motion.div {...fadeInLeft}>
            <AboutUs />
          </motion.div>
        </section>

        <section id="contact-section">
          <motion.div {...fadeInUp}>
            <ContactForm />
          </motion.div>
        </section>
      </main>
      <FloatingSubmenu />
      {/* New Footer */}
      <footer id="footer-section" className="mt-auto bg-dark text-white py-5">
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
