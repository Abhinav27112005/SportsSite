import React, { useState,useRef,useEffect,useCallback} from 'react';
import './Gallery.css';

export const Gallery = () => {
    const [mouseDownAt,setMouseDownAt]=useState(0);
    const [prevPercentage,setPrevPercentage]=useState(0);
    const [percentage,setPercentage]=useState(0);
    const trackRef=useRef(null);
    const animationRef = useRef(null);
    const isDraggingRef = useRef(false);

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
    // Duplicate images for infinite effect
  const infiniteImages = [...images, ...images, ...images];

  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    setMouseDownAt(e.clientX || e.touches[0].clientX);
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    setMouseDownAt(0);
    setPrevPercentage(percentage);
  }, [percentage]);

  const handleMouseMove = useCallback((e) => {
    if (!isDraggingRef.current) return;

    const clientX = e.clientX || e.touches[0].clientX;
    const mouseDelta = mouseDownAt - clientX;
    const maxDelta = window.innerWidth / 2;
    const newPercentage = (mouseDelta / maxDelta) * -100;
    let nextPercentage = prevPercentage + newPercentage;

    // Infinite scrolling logic
    if (nextPercentage > 0) nextPercentage = -100;
    if (nextPercentage < -100) nextPercentage = 0;

    setPercentage(nextPercentage);

    if (trackRef.current) {
      // Cancel previous animation
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      // Apply transform with smooth transition when dragging
      trackRef.current.style.transform = `translate(${nextPercentage}%, -50%)`;

      // Apply parallax effect
      const imageElements = trackRef.current.getElementsByClassName("image");
      for (const img of imageElements) {
        img.style.objectPosition = `${100 + nextPercentage}% center`;
      }
    }
  }, [mouseDownAt, prevPercentage]);

  // Auto-scroll when not dragging
  // useEffect(() => {
  //   if (isDraggingRef.current) return;

  //   const autoScroll = () => {
  //     setPercentage(prev => {
  //       const newPercentage = prev - 0.1;
  //       return newPercentage < -100 ? 0 : newPercentage;
  //     });

  //     if (trackRef.current) {
  //       trackRef.current.style.transform = `translate(${percentage}%, -50%)`;
        
  //       const imageElements = trackRef.current.getElementsByClassName("image");
  //       for (const img of imageElements) {
  //         img.style.objectPosition = `${100 + percentage}% center`;
  //       }
  //     }
  //   };

  //   const interval = setInterval(autoScroll, 600);
  //   return () => clearInterval(interval);
  // }, [percentage]);

  // Event listeners
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchmove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseMove]);

  return (
    <section className="gallery-section">
      <div className="gallery-container container">
        <h2 className="section-title contact-title fw-bolder fs-[3rem] mb-2">Gallery</h2>
        <p className="section-subtitle text-center text-xl mb-10 text-gray-700 font-medium italic">
          Moments that define our legacy
        </p>
        <div className="imgBody">
          <div id="image-track" ref={trackRef}>
            {infiniteImages.map((image, index) => (
              <img
                key={`${image.src}-${index}`}
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