import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { motion, useCycle } from 'framer-motion';

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/members', label: 'Members' },
    { path: '/events', label: 'Events' },
    { path: '/coaching', label: 'Coaching' },
    { path: '/finances', label: 'Finances' },
    { path: '/attendance', label: 'Attendance' },
    { path: '/admission', label: 'Admission' },
];

const GlassAppBar = styled(motion(AppBar))(({ theme }) => ({
  background: 'rgba(245, 248, 250, 0.85)',
  backdropFilter: 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  boxShadow: '0 2px 8px rgba(58, 110, 165, 0.12)',
  borderBottom: '1px solid #dde6ed',
  padding: '0.7rem 0',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
}));

const Logo = styled(motion.img)({
  height: 64,
  width: 64,
  borderRadius: '50%',
  objectFit: 'cover',
  marginRight: 18,
  background: '#fff',
  boxShadow: '0 4px 24px var(--color-logo-shadow)',
  cursor: 'pointer',
  border: '2.5px solid #f7b801',
});

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  color: 'var(--color-navbar-text)',
  fontWeight: 700,
  fontSize: '1.08rem',
  textDecoration: 'none',
  padding: '10px 20px',
  borderRadius: 12,
  margin: '0 2px',
  letterSpacing: 0.2,
  transition: 'background 0.18s, color 0.18s',
  '&.active, &:hover': {
    background: '#e3eaf7',
    color: '#3a6ea5',
  },
}));

export function Navbar() {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [isMenuOpen, toggleMenuOpen] = useCycle(false, true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
    toggleMenuOpen(1);
  };
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
    toggleMenuOpen(0);
  };
  const handleAccountMenuOpen = (event) => {
    setAccountMenuAnchor(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    handleAccountMenuClose();
    navigate('/login');
  };

  // Animated border effect
  const borderVariants = {
    animate: {
      boxShadow: [
        '0 0 0 0px var(--color-animated-border)',
        '0 0 0 4px var(--color-animated-border)',
        '0 0 0 0px var(--color-animated-border)'
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Logo infinite floating/tilt
  const logoVariants = {
    initial: { scale: 1.5, rotate: -10, opacity: 0 },
    animate: {
      scale: 1,
      rotate: [0, 8, -8, 0],
      opacity: 1,
      boxShadow: '0 8px 32px var(--color-logo-shadow)',
      transition: {
        scale: { duration: 1.1, type: 'spring', bounce: 0.4 },
        rotate: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: 1.1 },
      },
    },
    whileHover: { scale: 1.08, rotate: 2 },
    whileTap: { scale: 0.95, rotate: 0 },
  };

  return (
    <GlassAppBar
      position="sticky"
      elevation={0}
      sx={{ px: { xs: 0, sm: 0, md: 0 } }}
      variants={borderVariants}
      animate="animate"
    >
      <Toolbar sx={{ minHeight: 90, px: { xs: 2, sm: 4, md: 6 } }}>
        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: { xs: 1, md: 0 } }}>
          <Logo
            src="/assets/Picture2.jpeg"
                alt="logo" 
            variants={logoVariants}
            initial="initial"
            animate="animate"
            whileHover="whileHover"
            whileTap="whileTap"
            onLoad={() => setLogoLoaded(true)}
            style={{ boxShadow: logoLoaded ? '0 8px 32px var(--color-logo-shadow)' : 'none' }}
                onClick={() => navigate('/')}
          />
          <motion.div
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1, type: 'spring', bounce: 0.3 }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Typography
              variant="h4"
              component="span"
              sx={{
                fontWeight: 900,
                fontFamily: 'Poppins, Inter, Segoe UI, Arial, sans-serif',
                fontSize: { xs: '1.45rem', sm: '2rem' },
                color: '#1a2a4d',
                letterSpacing: 0.7,
                textShadow: '0 2px 8px #dde6ed',
                ml: 0.5,
                  }}
                >
              Sports Club
            </Typography>
          </motion.div>
        </Box>
        {/* Desktop Nav Links */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}>
          {navItems.map(({ path, label }) => (
            <StyledNavLink key={label} to={path} end={path === '/'}>
              {label}
            </StyledNavLink>
          ))}
        </Box>
        {/* Desktop Account/Login */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {isLoggedIn ? (
            [
              <IconButton color="primary" onClick={handleAccountMenuOpen} size="large" key="account-btn">
                <AccountCircle fontSize="large" />
              </IconButton>,
              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleAccountMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                key="account-menu"
              >
                {[<MenuItem key="profile" onClick={() => { handleAccountMenuClose(); navigate('/profile'); }}>Profile</MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>]
                }
              </Menu>
            ]
              ) : (
            <Button variant="contained" color="primary" onClick={() => navigate('/login')} sx={{ borderRadius: 2, fontWeight: 700 }}>
                  Login
                </Button>
              )}
        </Box>
        {/* Mobile Hamburger/X */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
          <IconButton color="primary" edge="end" onClick={mobileMenuAnchor ? handleMobileMenuClose : handleMobileMenuOpen}>
            {mobileMenuAnchor ? <CloseIcon fontSize="large" /> : <MenuIcon fontSize="large" />}
          </IconButton>
        </Box>
        {/* Mobile Drawer Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: {
              background: 'rgba(255,255,255,0.98)',
              color: '#1a2a4d',
              backdropFilter: 'blur(24px)',
              minWidth: 220,
              borderRadius: 2,
              boxShadow: '0 4px 24px rgba(58, 110, 165, 0.10)',
              mt: { xs: '5rem', sm: '5rem', md: 1.5 }, // Responsive margin-top for mobile
            },
          }}
        >
          {navItems.map(({ path, label }) => (
            <MenuItem
            key={label}
              onClick={() => { handleMobileMenuClose(); navigate(path); }}
              selected={location.pathname === path}
              sx={{ fontWeight: location.pathname === path ? 800 : 600 }}
          >
            {label}
            </MenuItem>
          ))}
          <MenuItem divider sx={{ my: 1 }} />
          {isLoggedIn
            ? [
                <MenuItem key="profile-mobile" onClick={() => { handleMobileMenuClose(); navigate('/profile'); }}>Profile</MenuItem>,
                <MenuItem key="logout-mobile" onClick={() => { handleMobileMenuClose(); handleLogout(); }}>Logout</MenuItem>
              ]
            : <MenuItem onClick={() => { handleMobileMenuClose(); navigate('/login'); }}>Login</MenuItem>
          }
        </Menu>
      </Toolbar>
    </GlassAppBar>
  );
}
