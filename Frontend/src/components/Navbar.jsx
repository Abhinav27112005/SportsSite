import { NavLink, useNavigate,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { Button, Dropdown } from "react-bootstrap";
import './Navbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { verifySession } from "./api";
import { useCallback } from "react";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location=useLocation();
  
  const checkAuthStatus = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoggedIn(false);
      return false;
    }
    
    try {
      const isValid = await verifySession();
      setIsLoggedIn(isValid);
      return isValid;
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsLoggedIn(false);
      return false;
    }
  }, []);
  // Then useEffect can safely depend on checkAuthStatus
  useEffect(() => {
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);
    const handleFocus = () => checkAuthStatus();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuthStatus]); // Now depends on the memoized function


  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/login');
    setMenuOpen(false);
  };
  const scrollToSection=(sectionId)=>{
    if(location.pathname==='/'){
      const section = document.getElementById(sectionId);
      if (section) {
        window.location.hash = sectionId;
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }else{
      navigate(`/#${sectionId}`);
      //navigate('/');
      //setTimeout(() => {
       // const section = document.getElementById(sectionId);
        //if (section) {
          //section.scrollIntoView({ behavior: 'smooth' });
        //}
      //}, 500); // Delay to ensure navigation is complete
    }
    setMenuOpen(false);
  }
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/members', label: 'Members' },
    { path: '/events', label: 'Events' },
    { path: '/coaching', label: 'Coaching' },
    { path: '/finances', label: 'Finances' },
    { path: '/attendance', label: 'Attendance' },
    { path: '/admission', label: 'Admission' },
    { path: 'scrollToGallery', label: 'Gallery', sectionId: 'gallery-section' },
    { path: 'scrollToContact', label: 'Contact', sectionId: 'contact-section' },
    { path: 'scrollToAbout', label: 'About Us', sectionId: 'about-section' } // Changed to use scroll functionality
  ];



  return (
    <header className="navbar-header" style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(0,0,0,0.08)',
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3 text-black">
          {/* Logo Section - Enhanced */}
          <div className="d-flex align-items-center ">
            <div className="me-3">
              <img 
                src="assets/Picture2.jpeg" 
                alt="logo" 
                style={{ 
                  height: '65px',
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '50%',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  objectFit: 'cover'
                }}
                onClick={() => navigate('/')}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>
            <h1 className="mb-0 fs-3 fw-bold" style={{
              color: '#2c3e50',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}>
              Sports Club
            </h1>
          </div>
    
          <nav className="d-none d-md-flex align-items-center">
            <ul className="nav mb-0 ">
              {navItems.map(({ path, label, sectionId }) => (
                <li className="nav-item mx-2" key={label}>
                  {sectionId ? (
                    /*<button
                    onClick={() => scrollToSection(sectionId)}
                    className={`nav-link px-3 py-2 rounded text-dark fw-medium bg-transparent border-0 ${
                      location.pathname === '/' && 
                      window.location.hash === `#${sectionId}` ? 'active-nav' : ''
                    }`}
                    style={{ fontSize: '1.05rem', cursor: 'pointer' }}
                  >
                    {label}
                  </button>*/ null
                  ) : (
                    <NavLink
                      to={path}
                      className="nav-link fw-medium px-3 py-2 rounded fw-bold text-#f2f2"
                      style={({ isActive }) => isActive ? {
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        color: '#0d6efd'
                      } : {
                        fontSize: '1.1rem',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
    
            <div style={{marginRight:'1rem'}}>
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    id="dropdown-basic"
                    style={{
                      fontSize: '1.1rem',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '8px'
                    }}
                    className="fw-bold"
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    Account
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-sm border-0">
                    <Dropdown.Item 
                      onClick={() => navigate('/profile')}
                      className="py-2 fw-bold"
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item 
                      onClick={handleLogout}
                      className="py-2 text-danger fw-bold"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button 
                  variant="primary"
                  onClick={() => navigate('/login')}
                  className="py-2 fw-bold text-#f2f2"
                  style={{
                    fontSize: '1.1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(13, 110, 253, 0.25)',
                    marginLeft:'1rem'
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Button>
              )}
            </div>
          </nav>
    
          {/* Mobile Menu Button - Enhanced */}
          <div className="d-md-none">
            <button 
              onClick={toggleMenu} 
              className="btn btn-outline-secondary p-2 "
              style={{
                fontSize: '1.1rem',
                borderRadius: '8px',
                width: '44px',
                height: '44px'
              }}
              aria-label="Toggle Menu"
            >
              <RxHamburgerMenu size={24} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="d-md-none mt-3 p-4 bg-white rounded shadow-lg" style={{
            border: '1px solid rgba(0,0,0,0.1)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <ul className="nav flex-column gap-2">
              {['/', '/members', '/events', '/coaching', '/finances', '/attendance'].map((path) => (
                <li className="nav-item" key={path}>
                  <NavLink 
                    to={path} 
                    className="nav-link px-3 py-2 rounded fw-medium"
                    style={({ isActive }) => isActive ? {
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(13, 110, 253, 0.1)',
                      color: '#0d6efd'
                    } : {
                      fontSize: '1.1rem'
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {path === '/' ? 'Home' : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </NavLink>
                </li>
              ))}
            </ul>
    
            <div className="d-grid gap-3 mt-4">
              {isLoggedIn ? (
                <>
                  <Button 
                    variant="outline-primary"
                    onClick={() => {
                      navigate('/profile');
                      setMenuOpen(false);
                    }}
                    className="py-2"
                    style={{ fontSize: '1.1rem' }}
                  >
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={handleLogout}
                    className="py-2"
                    style={{ fontSize: '1.1rem' }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  variant="primary"
                  onClick={() => {
                    navigate('/login');
                    setMenuOpen(false);
                  }}
                  className="py-2"
                  style={{ fontSize: '1.1rem' }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Secondary Navbar */}
      <div className="secondary-navbar py-0 border-bottom-0 px-0" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: '80px', // Adjust based on your main navbar height
        zIndex: 990
      }}>
        <div className="container">
          <div className="d-flex justify-content-center">
            {navItems.map(({path,label,sectionId}) => {
                const isActive=location.pathname==='/' && window.location.hash===`#${sectionId}`;
              return (
                sectionId ? ( 
                    <button
            key={label}
            onClick={() => scrollToSection(sectionId)}
            className={`secondary-nav-item ${isActive ? 'active' : ''}`}
          >
            {label}
            {isActive && <div className="active-indicator"></div>}
          </button>) 
                    :
                    null
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
