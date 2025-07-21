import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { motion, AnimatePresence, calcGeneratorDuration } from 'framer-motion';
import gsap from 'gsap';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../../styles/Gallery.css';

export const Gallery = () => {
    const images = [
        { src: 'assets/images/gallery1.jpeg', alt: 'Established' },
        { src: 'assets/images/gallery2.jpeg', alt: 'Established' },
        { src: 'assets/images/gallery3.jpeg', alt: 'Established' },
        { src: 'assets/images/gallery4.jpeg', alt: 'Award Ceremony' },
        { src: 'assets/images/gallery5.jpeg', alt: 'Established' },
        { src: 'assets/images/gallery6.jpeg', alt: 'Established' },
        { src: 'assets/images/gallery13.jpeg', alt: 'Achievements' },
        { src: 'assets/images/gallery14.jpeg', alt: 'Achievements' },
        { src: 'assets/images/gallery15.jpeg', alt: 'Achievements' },
        { src: 'assets/images/gallery10.jpeg', alt: 'Alumni meet' },
        { src: 'assets/images/gallery11.jpeg', alt: 'Alumni meet' },
        { src: 'assets/images/gallery12.jpeg', alt: 'Alumni meet' },
        { src: 'assets/images/gallery16.jpeg', alt: 'Alumni meet' },
        { src: 'assets/images/gallery17.jpeg', alt: 'Alumni meet' },
        { src: 'assets/images/gallery18.jpeg', alt: 'Alumni meet' },
        { src: 'assets/images/gallery19.jpeg', alt: 'Alumni meet' },
    ];
    const swiperRef = useRef(null);
    useEffect(() => {
        if (swiperRef.current) {
            gsap.fromTo(
                swiperRef.current,
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
            );
        }
    }, []);

    // Lightbox modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const modalOverlayRef = useRef(null);

    // Open modal with selected image
    const openModal = useCallback((idx) => {
        setModalIndex(idx);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);
    // Close modal
    const closeModal = useCallback(() => {
        setModalOpen(false);
        document.body.style.overflow = '';
    }, []);
    // Navigate modal images
    const showPrev = useCallback(() => setModalIndex(idx => (idx - 1 + images.length) % images.length), [images.length]);
    const showNext = useCallback(() => setModalIndex(idx => (idx + 1) % images.length), [images.length]);

    // Keyboard navigation for modal
    useEffect(() => {
        if (!modalOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [modalOpen, closeModal, showPrev, showNext]);

    // Click outside to close
    const handleOverlayClick = (e) => {
        if (e.target === modalOverlayRef.current) closeModal();
    };

    // Touch swipe for modal
    const touchStartX = useRef(null);
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        if (deltaX > 50) showPrev();
        else if (deltaX < -50) showNext();
        touchStartX.current = null;
    };

    return (
        <section className="gallery-section">
            <div className="gallery-container container glass-bg">
                <h2 className="section-title contact-title fw-bolder fs-[3rem] mb-2" style={{ color: '#2c3e50' }}>Gallery</h2>
                <p className="section-subtitle text-center text-xl mb-10 text-gray-700 font-medium italic">
                    Moments that define our legacy
                </p>
                <div className="imgBody glass-bg" ref={swiperRef} style={{height: '160vw', maxHeight: '75vh', minHeight: '300px', padding: '1.5rem 0'}}>
                    <Swiper
                        modules={[Navigation, Pagination, Keyboard]}
                        navigation={{
                            nextEl: '.gallery-next',
                            prevEl: '.gallery-prev',
                        }}
                        pagination={{
                            clickable: true,
                            el: '.gallery-pagination',
                            renderBullet: (index, className) => `<span class=\"${className} gallery-bullet\" aria-label=\"Go to slide ${index + 1}\"></span>`
                        }}
                        keyboard={{ enabled: true }}
                        spaceBetween={32}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1400: { slidesPerView: 4 },
                        }}
                        style={{height: '100%', width: '100%'}}
                        className="gallery-swiper"
                        aria-label="Gallery Carousel"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <motion.div
                                    className="gallery-card glass-card"
                                    whileHover={{ scale: 1.04, boxShadow: '0 8px 32px 0 rgba(58,110,165,0.18)' }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    tabIndex={0}
                                    aria-label={`View image: ${image.alt}`}
                                    onClick={() => openModal(index)}
                                    style={{ cursor: 'zoom-in' }}
                                >
                                    <div className="gallery-img-wrapper parallax-bg">
                                        <img
                                            src={`/${image.src.replace(/^\//, '')}`}
                                alt={image.alt}
                                            className="gallery-image"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(58,110,165,0.10)' }}
                            />
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                        <div className="gallery-pagination" />
                        <button className="gallery-prev gallery-nav-btn" aria-label="Previous slide" tabIndex={0} />
                        <button className="gallery-next gallery-nav-btn" aria-label="Next slide" tabIndex={0} />
                    </Swiper>
                </div>
            </div>
            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div
                        className="gallery-modal-overlay"
                        ref={modalOverlayRef}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={handleOverlayClick}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        tabIndex={-1}
                        aria-modal="true"
                        role="dialog"
                        style={{
                            position: 'fixed',
                            top: 'calc(90px - 1.5rem - 2.5rem)',
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(30, 40, 60, 0.85)',
                            zIndex: 3000,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <motion.div
                            className="gallery-modal-content glass-bg"
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                            style={{
                                position: 'relative',
                                maxWidth: '90vw',
                                maxHeight: '90vh',
                                borderRadius: '2rem',
                                boxShadow: '0 8px 32px 0 rgba(58,110,165,0.18)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1.5rem',
                            }}
                        >
                            <img
                                src={`/${images[modalIndex].src.replace(/^\//, '')}`}
                                alt={images[modalIndex].alt}
                                className="gallery-modal-image"
                                style={{
                                    maxWidth: '80vw',
                                    maxHeight: '70vh',
                                    borderRadius: '1.5rem',
                                    boxShadow: '0 4px 24px rgba(58,110,165,0.18)',
                                    objectFit: 'contain',
                                    background: '#fff',
                                }}
                            />
                            {/* Caption/Description */}
                            <div style={{ marginTop: '1rem', color: '#1a2a4d', fontWeight: 500, fontSize: '1.1rem', textAlign: 'center', textShadow: '0 2px 8px #dde6ed' }}>
                                {images[modalIndex].alt}
                            </div>
                            {/* Close Button */}
                            <button
                                className="gallery-modal-close"
                                onClick={closeModal}
                                aria-label="Close modal"
                                style={{
                                    position: 'absolute',
                                    top: '1.2rem',
                                    right: '1.2rem',
                                    background: 'rgba(255,255,255,0.85)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    boxShadow: '0 2px 8px 0 rgba(58,110,165,0.10)',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    color: '#3a6ea5',
                                    zIndex: 10,
                                }}
                            >
                                &times;
                            </button>
                            {/* Prev/Next Arrows */}
                            <button
                                className="gallery-modal-arrow gallery-modal-prev"
                                onClick={showPrev}
                                aria-label="Previous image"
                                style={{
                                    position: 'absolute',
                                    left: '-2.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.85)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    boxShadow: '0 2px 8px 0 rgba(58,110,165,0.10)',
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    color: '#3a6ea5',
                                    zIndex: 10,
                                    display: images.length > 1 ? 'flex' : 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                &#8592;
                            </button>
                            <button
                                className="gallery-modal-arrow gallery-modal-next"
                                onClick={showNext}
                                aria-label="Next image"
                                style={{
                                    position: 'absolute',
                                    right: '-2.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'rgba(255,255,255,0.85)',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    boxShadow: '0 2px 8px 0 rgba(58,110,165,0.10)',
                                    cursor: 'pointer',
                                    fontSize: '2rem',
                                    color: '#3a6ea5',
                                    zIndex: 10,
                                    display: images.length > 1 ? 'flex' : 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                &#8594;
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};