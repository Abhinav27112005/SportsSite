import React, { useRef, useEffect, useState, useCallback } from "react";
import { ImageSlider } from "../../components/features/gallery/ImageSlider";
import { Gallery } from "../../components/features/gallery/Gallery";
import { AboutUs } from "../../components/common/AboutUS";
import { ContactForm } from "../../components/forms/ContactForm";
import FloatingSubmenu from "../../components/layout/FloatingSubmenu";
import { motion, useScroll, useTransform } from "framer-motion";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Home.css";
import Testimonials from "../../components/common/Testimonials";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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
    quote: "My daughter's confidence and skills have soared. The club's environment is nurturing and inspiring.",
  },
];

export const Home = () => {
  // Parallax for hero background
  const heroRef = useRef(null);
  const { scrollY } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollY, [0, 300], [0, 80]);

  // Section refs
  const sectionsRef = useRef([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const scrollTriggersRef = useRef([]);
  const touchStartYRef = useRef(null);

  const sections = ['hero', 'gallery', 'testimonials', 'about', 'contact', 'footer'];

  useEffect(() => {
    if (window.location.hash) {
      const sectionId = window.location.hash.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'auto' });
        }, 100);
      }
    }
    
    // Ensure body and html don't have horizontal overflow
    document.body.style.overflowX = 'hidden';
    document.documentElement.style.overflowX = 'hidden';
    
    // Allow natural vertical scrolling
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflowY = 'auto';
    
    return () => {
      document.body.style.overflowX = '';
      document.documentElement.style.overflowX = '';
      document.body.style.overflowY = '';
      document.documentElement.style.overflowY = '';
    };
  }, []);

  // GSAP ScrollTrigger setup
  useEffect(() => {
    // Create ScrollTrigger for each section
    sectionsRef.current.forEach((sectionRef, index) => {
      if (sectionRef) {
        const trigger = ScrollTrigger.create({
          trigger: sectionRef,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            if (!isScrolling) {
              setCurrentSection(index);
            }
          },
          onEnterBack: () => {
            if (!isScrolling) {
              setCurrentSection(index);
            }
          },
          markers: false, // Set to true for debugging
        });
        scrollTriggersRef.current[index] = trigger;
      }
    });

    // Cleanup ScrollTrigger on unmount
    return () => {
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger) trigger.kill();
      });
    };
  }, [isScrolling]);

  // Function to navigate to section
  const navigateToSection = useCallback((sectionIndex) => {
    if (sectionIndex < 0 || sectionIndex >= sections.length) return;
    
    const targetSection = sectionsRef.current[sectionIndex];
    if (targetSection) {
      // Disable ScrollTrigger during manual navigation
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger) trigger.disable();
      });
      
      setIsScrolling(true);
      
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: targetSection, offsetY: 90 }, // Account for navbar height
        ease: "power2.inOut",
        onComplete: () => {
          // Re-enable ScrollTrigger after animation
          setTimeout(() => {
            scrollTriggersRef.current.forEach(trigger => {
              if (trigger) trigger.enable();
            });
            setIsScrolling(false);
          }, 100);
            }
      });
        }
  }, [sections.length]);

  // Mouse wheel handler with scrollbar integration
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    if (isScrolling) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const nextSection = currentSection + direction;
    
    // Boundary check
    if (nextSection >= 0 && nextSection < sections.length) {
      navigateToSection(nextSection);
    }
  }, [currentSection, isScrolling, sections.length, navigateToSection]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (isScrolling) return;
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      const nextSection = Math.min(sections.length - 1, currentSection + 1);
      if (nextSection !== currentSection) {
        navigateToSection(nextSection);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const nextSection = Math.max(0, currentSection - 1);
      if (nextSection !== currentSection) {
        navigateToSection(nextSection);
      }
    }
  }, [currentSection, isScrolling, sections.length, navigateToSection]);

  // Touch handlers
  const handleTouchStart = useCallback((e) => {
    touchStartYRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (isScrolling) return;
    const touchStartY = touchStartYRef.current;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 50) {
      const direction = diff > 0 ? 1 : -1;
      const currentSectionEl = sectionsRef.current[currentSection];
      if (!currentSectionEl) return;
      // Check if user is at the top or bottom of the section
      const scrollTop = currentSectionEl.scrollTop;
      const scrollHeight = currentSectionEl.scrollHeight;
      const clientHeight = currentSectionEl.clientHeight;
      const atTop = scrollTop === 0;
      const atBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 2;
      if ((direction === 1 && atBottom) || (direction === -1 && atTop)) {
        const nextSection = currentSection + direction;
        if (nextSection >= 0 && nextSection < sections.length) {
          navigateToSection(nextSection);
        }
      }
      // Otherwise, allow native scroll within the section
    }
  }, [currentSection, isScrolling, sections.length, navigateToSection]);

  // Utility to detect touch device (mobile/tablet)
  const isTouchDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
      'ontouchstart' in window ||
      (navigator && navigator.maxTouchPoints > 0)
    );
  };

  // Event listeners
  useEffect(() => {
    if (isTouchDevice()) {
      // On touch devices (mobile/tablet), do not attach any custom scroll handlers
      return;
    }
    const wheelHandler = (e) => handleWheel(e);
    const keyHandler = (e) => handleKeyDown(e);
    const touchStartHandler = (e) => handleTouchStart(e);
    const touchEndHandler = (e) => handleTouchEnd(e);

    window.addEventListener('wheel', wheelHandler, { passive: false });
    window.addEventListener('keydown', keyHandler);
    window.addEventListener('touchstart', touchStartHandler);
    window.addEventListener('touchend', touchEndHandler);

    return () => {
      window.removeEventListener('wheel', wheelHandler);
      window.removeEventListener('keydown', keyHandler);
      window.removeEventListener('touchstart', touchStartHandler);
      window.removeEventListener('touchend', touchEndHandler);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleWheel, handleKeyDown, handleTouchStart, handleTouchEnd]);

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
    <div className="d-flex flex-column min-vh-100 home-bg" style={{ 
      minHeight: '100vh', 
      width: '100%',
      maxWidth: '100vw',
      overflowX: 'hidden'
    }}>
      <main style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
        {/* Hero Section */}
        <section 
          ref={(el) => {
            sectionsRef.current[0] = el;
            heroRef.current = el;
          }}
          className="hero-section" 
          style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            minHeight: '100vh',
            width: '100%',
            maxWidth: '100vw'
          }}
        >
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
          <motion.div {...fadeInDown} style={{ position: 'relative', zIndex: 1, width: '100%' }}>
            <div className="hero-content" style={{ minHeight: '60vh', width: '100%' }}>
            <ImageSlider />
          </div>
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section 
          ref={(el) => sectionsRef.current[1] = el}
          id="gallery-section" 
          style={{ width: '100vw', maxWidth: '100vw', overflowX: 'hidden', padding: 0, margin: 0, background: 'transparent' }}
        >
          <motion.div {...fadeInRight}>
            <div style={{ minHeight: '40vh', width: '100%' }}>
          <Gallery />
        </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section 
          ref={(el) => sectionsRef.current[2] = el}
          id="testimonials-section" 
          className="py-5" 
          style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div style={{ minHeight: '40vh', width: '100%' }}>
              <Testimonials testimonials={testimonials} />
        </div>

          </motion.div>
        </section>

        {/* About Section */}
        <section 
          ref={(el) => sectionsRef.current[3] = el}
          id="about-section" 
          className="scroll-target" 
          style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
        >
          <motion.div {...fadeInLeft}>
            <AboutUs />
          </motion.div>
        </section>

        {/* Contact Section */}
        <section 
          ref={(el) => sectionsRef.current[4] = el}
          id="contact-section" 
          style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
        >
          <motion.div {...fadeInUp}>
          <ContactForm />
          </motion.div>
        </section>

        {/* Footer Section */}
        <section 
          ref={(el) => sectionsRef.current[5] = el}
          id="footer-section" 
          className="mt-auto bg-dark text-white py-5" 
          style={{ width: '100%', maxWidth: '100vw' }}
        >
        <div className="footer-grid">
          {/* Row 1 */}
          <div className="footer-logo-title">
            <img src="assets/Picture2.jpeg" alt="Sports Club Logo" className="footer-logo" />
            <span className="footer-title">Sports Club</span>
          </div>
          <div className="footer-links-heading">
            <h5>Quick Links</h5>
        </div>
          <div className="footer-admin-form" style={{ gridRow: '1 / span 3' }}>
            <div className="footer-admin-card">
              <h5 className="fw-bold mb-3" style={{ color: '#fff' }}>Request Admin Privileges</h5>
              <p className="mb-3" style={{ color: '#e3eaf7' }}>
                Want to help manage the club? Request admin access by submitting your name and email. Our team will review your request and get in touch!
              </p>
              <form onSubmit={e => { e.preventDefault(); alert('Request submitted! (Demo only)'); }} className="row g-3">
                <div className="col-12">
                  <input type="text" className="form-control" placeholder="Your Name" required style={{ borderRadius: '0.75rem', fontSize: '1.1rem' }} />
                </div>
                <div className="col-12">
                  <input type="email" className="form-control" placeholder="Your Email" required style={{ borderRadius: '0.75rem', fontSize: '1.1rem' }} />
                </div>
                <div className="col-12 d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary px-4 py-2 fw-bold" style={{ borderRadius: '0.75rem', fontSize: '1.1rem', background: '#3a6ea5', border: 'none' }}>
                    Request Access
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* Row 2 */}
          <div className="footer-about">
            <p>Founded in 1938, we've been nurturing badminton talent for over eight decades.</p>
          </div>
          <div className="footer-links-content">
            <ul className="list-unstyled mb-0">
              <li><a href="/" className="text-decoration-none text-white hover-primary fs-6"><i className="bi bi-house-door me-2"></i> Home</a></li>
              <li><a href="/members" className="text-decoration-none text-white hover-primary fs-6"><i className="bi bi-people me-2"></i> Members</a></li>
              <li><a href="/events" className="text-decoration-none text-white hover-primary fs-6"><i className="bi bi-calendar-event me-2"></i> Events</a></li>
              <li><a href="/contact" className="text-decoration-none text-white hover-primary fs-6"><i className="bi bi-envelope me-2"></i> Contact Us</a></li>
              </ul>
            </div>
          {/* Row 3 */}
          <div className="footer-connect">
            <h5 className="fw-bold mb-3">Connect With Us</h5>
            <div className="d-flex gap-3 mb-2">
              <a href="#" className="text-white "><i className="bi bi-facebook hover-scale"></i></a>
              <a href="#" className="text-white "><i className="bi bi-instagram hover-scale"></i></a>
              <a href="#" className="text-white "><i className="bi bi-twitter-x hover-scale"></i></a>
              <a href="#" className="text-white "><i className="bi bi-youtube hover-scale"></i></a>
              </div>
              <div className="text-white-50">
                <i className="bi bi-geo-alt me-2"></i>
                Ranchi, Jharkhand, India
              </div>
            </div>
          <div className="footer-admin-form-2"></div>
          {/* Row 4 */}
          <div className="footer-copyright">
            <span className="footer-signoff">© 2025 Sports Club. All rights reserved.</span>
            <span className="footer-credit">
              Made with
              <span className="footer-heart heart-beat">♥</span>
              <a href="https://abhinavjha.netlify.app/" target="_blank" rel="noopener noreferrer" className="footer-author">Abhinav</a>
              </span>
          </div>
        </div>
        </section>
      </main>
      <FloatingSubmenu navigateToSection={navigateToSection} />
    </div>
  );
};
