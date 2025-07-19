import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../../styles/FloatingSubmenu.css';
import { FaEnvelope, FaImages, FaInfoCircle, FaRegCopyright, FaArrowUp, FaStar, FaEllipsisH } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const primaryItems = [
  { label: 'Contact', anchor: '#contact-section', icon: <FaEnvelope /> },
  { label: 'Gallery', anchor: '#gallery-section', icon: <FaImages /> },
  { label: '', anchor: '#top', icon: <FaArrowUp />, isBackToTop: true },
  { label: 'More', anchor: '#more', icon: <FaEllipsisH />, isMore: true },
];

const secondaryItems = [
  { label: 'Testimonials', anchor: '#testimonials-section', icon: <FaStar /> },
  { label: 'About', anchor: '#about-section', icon: <FaInfoCircle /> },
  { label: 'Footer', anchor: '#footer-section', icon: <FaRegCopyright /> },
];

export default function FloatingSubmenu() {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  if (location.pathname !== '/') return null;

  const handleClick = (e, item) => {
    e.preventDefault();
    if (item.isBackToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (expanded) setExpanded(false);
    } else if (item.isMore) {
      setExpanded(true);
    } else {
      const el = document.querySelector(item.anchor);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      if (expanded && !item.isMore) setTimeout(() => setExpanded(false), 350); // collapse after navigation
    }
  };

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

  return (
    <motion.nav
      className="floating-submenu"
      initial={false}
      animate={expanded ? 'expanded' : 'collapsed'}
      variants={submenuVariants}
    >
      <AnimatePresence initial={false}>
        {(!expanded
          ? primaryItems
          : [
              ...primaryItems.filter(i => !i.isMore),
              ...secondaryItems,
            ]
        ).map((item) =>
          item.isMore && expanded ? null : (
            <motion.a
              key={item.label || 'backtotop'}
              href={item.anchor}
              className={`submenu-link${item.isBackToTop ? ' submenu-link-icon' : ''}`}
              onClick={e => handleClick(e, item)}
              title={item.label || 'Back to Top'}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              {item.icon}
              {!item.isBackToTop && <span style={{ marginLeft: 6 }}>{item.label}</span>}
            </motion.a>
          )
        )}
      </AnimatePresence>
    </motion.nav>
  );
} 