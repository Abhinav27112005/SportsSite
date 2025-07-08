import React, { useState, useRef, useEffect, useCallback } from 'react';
import './Gallery.css';

export const Gallery = () => {
    const [mouseDownAt, setMouseDownAt] = useState(0);
    const [prevPercentage, setPrevPercentage] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const trackRef = useRef(null);
    const isDraggingRef = useRef(false);
    const lastTimeRef = useRef(0);
    const containerRef=useRef(null);

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

    const handleStart = useCallback((clientX) => {
        isDraggingRef.current = true;
        setMouseDownAt(clientX);
        if (trackRef.current) {
            trackRef.current.style.transition = 'none';
            const images = trackRef.current.querySelectorAll('.image');
            images.forEach(img => {
                img.style.transition = 'none';
            });
        }
    }, []);

    
    const handleEnd = useCallback(() => {
        isDraggingRef.current = false;
        setMouseDownAt(0);
        setPrevPercentage(percentage);
        if (trackRef.current) {
            trackRef.current.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            const images = trackRef.current.querySelectorAll('.image');
            images.forEach(img => {
                img.style.transition = 'object-position 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            });
        }
    }, [percentage]);


    
    const handleMove = useCallback((clientX) => {
        if (!isDraggingRef.current) return;

        const now = performance.now();
        if (now - lastTimeRef.current < 16) return; // Limit to ~60fps
        lastTimeRef.current = now;

        const mouseDelta = mouseDownAt - clientX;
        const maxDelta = window.innerWidth / 2;
        const newPercentage = (mouseDelta / maxDelta) * -100;
        let nextPercentage = prevPercentage + newPercentage;

        // Restrict between 0 and -100
        nextPercentage = Math.min(nextPercentage, 0);
        nextPercentage = Math.max(nextPercentage, -100);

        setPercentage(nextPercentage);

        if (trackRef.current) {
            trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`;
            
            const images = trackRef.current.querySelectorAll('.image');
            images.forEach(img => {
                img.style.objectPosition = `${nextPercentage + 100}% center`;
            });
        }
    }, [mouseDownAt, prevPercentage]);

    // Mouse event handlers
    const handleMouseDown = useCallback((e) => handleStart(e.clientX), [handleStart]);
    const handleMouseMove = useCallback((e) => handleMove(e.clientX), [handleMove]);
    const handleMouseUp = useCallback(() => handleEnd(), [handleEnd]);

    // Touch event handlers
    const handleTouchStart = useCallback((e) => handleStart(e.touches[0].clientX), [handleStart]);
    const handleTouchMove = useCallback((e) => handleMove(e.touches[0].clientX), [handleMove]);
    const handleTouchEnd = useCallback(() => handleEnd(), [handleEnd]);

    // Event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener("mousedown", handleMouseDown);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseup", handleMouseUp);
        container.addEventListener("touchstart", handleTouchStart);
        container.addEventListener("touchmove", handleTouchMove);
        container.addEventListener("touchend", handleTouchEnd);

        return () => {
            container.removeEventListener("mousedown", handleMouseDown);
            container.removeEventListener("mousemove", handleMouseMove);
            container.removeEventListener("mouseup", handleMouseUp);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
            container.removeEventListener("touchend", handleTouchEnd);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return (
        <section className="gallery-section">
            <div className="gallery-container container">
                <h2 className="section-title contact-title fw-bolder fs-[3rem] mb-2">Gallery</h2>
                <p className="section-subtitle text-center text-xl mb-10 text-gray-700 font-medium italic">
                    Moments that define our legacy
                </p>
                <div className="imgBody" ref={containerRef}>
                    <div id="image-track" ref={trackRef}>
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                loading="lazy"
                                draggable="false"
                                className="image"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};