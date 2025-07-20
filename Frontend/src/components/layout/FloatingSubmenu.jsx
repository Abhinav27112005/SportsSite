import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/FloatingSubmenu.css';
import { FaEnvelope, FaImages, FaInfoCircle, FaRegCopyright, FaArrowUp, FaStar, FaEllipsisH } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

// Section order must match Home.jsx
const allItems = [
  { label: 'Contact', anchor: '#contact-section', sectionIndex: 4, icon: <FaEnvelope /> },
  { label: 'Gallery', anchor: '#gallery-section', sectionIndex: 1, icon: <FaImages /> },
  { label: 'Testimonials', anchor: '#testimonials-section', sectionIndex: 2, icon: <FaStar /> },
  { label: 'About', anchor: '#about-section', sectionIndex: 3, icon: <FaInfoCircle /> },
  { label: 'Footer', anchor: '#footer-section', sectionIndex: 5, icon: <FaRegCopyright /> },
  { label: '', anchor: '#top', isBackToTop: true, icon: <FaArrowUp /> },
];
const primaryCount = 3; // Contact, Gallery, Up Arrow

function isMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 700;
}

export default function FloatingSubmenu({ navigateToSection }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false); // true = all icons, false = 3+more
  const [expandedIndex, setExpandedIndex] = useState(null); // which icon is showing label
  if (location.pathname !== '/') return null;

  // Compose items to render based on state
  let itemsToRender, indexMap;
  if (!isMobile()) {
    itemsToRender = allItems;
    indexMap = allItems.map((item, idx) => idx);
  } else if (!expanded) {
    itemsToRender = [
      ...allItems.slice(0, primaryCount),
      { label: 'More', anchor: '#more', icon: <FaEllipsisH />, isMore: true },
    ];
    indexMap = [0, 1, 2, null]; // null for 'More'
  } else {
    itemsToRender = [
      ...allItems,
    ];
    indexMap = allItems.map((item, idx) => idx);
  }

  // Handle click
  const handleClick = useCallback((e, item, idx) => {
    e.preventDefault();
    if (!isMobile()) {
      if (item.isBackToTop) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!item.isMore && typeof item.sectionIndex === 'number' && navigateToSection) {
        navigateToSection(item.sectionIndex);
      }
      return;
    }
    if (item.isMore) {
      setExpanded(true);
      setExpandedIndex(null);
    } else {
      setExpandedIndex(idx);
      setTimeout(() => {
        if (item.isBackToTop) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (typeof item.sectionIndex === 'number' && navigateToSection) {
          navigateToSection(item.sectionIndex);
        }
        setTimeout(() => {
          setExpanded(false);
          setExpandedIndex(null);
        }, 1200); // label stays visible longer
      }, 350);
    }
  }, [navigateToSection]);

  // Animation variants
  const submenuVariants = {
    collapsed: { height: 'auto', transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    expanded: { height: 'auto', transition: { staggerChildren: 0.07, staggerDirection: 1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 400, damping: 30 } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.18 } },
  };
  const labelVariants = {
    collapsed: { width: 0, opacity: 0, marginLeft: 0, transition: { duration: 0.32 } },
    expanded: { width: 'auto', opacity: 1, marginLeft: 8, transition: { duration: 0.38 } },
  };

  return (
    <motion.nav
      className="floating-submenu"
      initial={false}
      animate={expanded ? 'expanded' : 'collapsed'}
      variants={submenuVariants}
    >
      <AnimatePresence initial={false}>
        {itemsToRender.map((item, idx) => {
          if (item.isMore && expanded) return null;
          // Only show label for expandedIndex (mobile), or always on desktop
          const showLabel = (!isMobile() || expandedIndex === idx);
          return (
            <motion.div
              key={item.label || 'backtotop'}
              className="submenu-item-container"
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <motion.a
                href={item.anchor}
                className={`submenu-link${item.isBackToTop ? ' submenu-link-icon' : ''}`}
                onClick={e => handleClick(e, item, idx)}
                title={item.label || 'Back to Top'}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
              >
                {item.icon}
              </motion.a>
              {/* Label inside the bar, right of the icon, only for expandedIndex on mobile */}
              <AnimatePresence>
                {isMobile() && expandedIndex === idx && (
                  <motion.span
                    className="submenu-label-inside"
                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                    animate={{ width: 'auto', opacity: 1, marginLeft: 8 }}
                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                    transition={{ duration: 0.38 }}
                    style={{ overflow: 'hidden', display: 'inline-block', whiteSpace: 'nowrap' }}
                  >
                    {!item.isBackToTop && item.label}
                  </motion.span>
                )}
                {/* Desktop: always show label */}
                {!isMobile() && !item.isBackToTop && (
                  <span className="submenu-label-inside" style={{ marginLeft: 8 }}>{item.label}</span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.nav>
  );
} 