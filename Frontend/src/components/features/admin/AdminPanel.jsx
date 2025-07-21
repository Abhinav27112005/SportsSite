import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, Button, Container, Spinner, Alert } from 'react-bootstrap';
import AdminContacts from './AdminContacts';
import AdminEvents from './AdminEvents';
import apiFetch from '../../../services/api/client';
import AdminAdmissions from './AdminAdmission';
import { FaEnvelope, FaCalendarAlt, FaUserGraduate, FaBars, FaBell, FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const DashboardCard = ({ icon, label, value, color }) => (
  <motion.div
    className="dashboard-card glass-card d-flex align-items-center justify-content-between p-4 mb-3"
    style={{ borderRadius: '1.5rem', background: 'rgba(255,255,255,0.18)', boxShadow: '0 4px 24px 0 rgba(79,70,229,0.10)' }}
    whileHover={{ scale: 1.04 }}
    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
  >
    <div style={{ fontSize: '2.2rem', color }}>{icon}</div>
    <div className="ms-3">
      <div className="fw-bold fs-4" style={{ color }}>{value}</div>
      <div className="text-muted fs-6">{label}</div>
    </div>
  </motion.div>
);

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => (
  <nav className={`admin-sidebar glass-card ${collapsed ? 'collapsed' : ''}`}> 
    <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
      <FaBars />
    </button>
    <ul>
      <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><FaEnvelope /> Dashboard</li>
      <li className={activeTab === 'contacts' ? 'active' : ''} onClick={() => setActiveTab('contacts')}><FaEnvelope /> Messages</li>
      <li className={activeTab === 'events' ? 'active' : ''} onClick={() => setActiveTab('events')}><FaCalendarAlt /> Events</li>
      <li className={activeTab === 'admissions' ? 'active' : ''} onClick={() => setActiveTab('admissions')}><FaUserGraduate /> Admissions</li>
    </ul>
  </nav>
);

const TopHeader = ({ onLogout, darkMode, setDarkMode }) => (
  <header className="admin-header glass-card d-flex align-items-center justify-content-between p-3 mb-4">
    <div className="d-flex align-items-center gap-3">
      <FaBell style={{ fontSize: '1.5rem', color: '#4f46e5' }} />
    </div>
    <div className="d-flex align-items-center gap-3">
      <button className="btn btn-link" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? <FaSun style={{ color: '#fbbf24' }} /> : <FaMoon style={{ color: '#4f46e5' }} />}
      </button>
      <img src="/assets/Picture2.jpeg" alt="Profile" style={{ width: 38, height: 38, borderRadius: '50%' }} />
      <Button variant="danger" onClick={onLogout}>Logout</Button>
    </div>
  </header>
);

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [metrics, setMetrics] = useState({ messages: 0, events: 0, admissions: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    // If navigated from profile, default to dashboard
    setActiveTab('dashboard');
    const checkAdmin = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user || !user.is_admin) {
          navigate('/');
          return;
        }
  
        const profile = await apiFetch('/users/profile');
        if (!profile.is_admin) {
          navigate('/');
          return;
        }
  
        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
  
    checkAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">Admin access required</Alert>
      </div>
    );
  }

  return (
    <div className={`admin-dashboard ${darkMode ? 'dark-mode' : ''}`}> 
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="admin-main-content">
        <TopHeader onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview row g-4 mb-4">
            <div className="col-md-4"><DashboardCard icon={<FaEnvelope />} label="Messages" value={metrics.messages} color="#4f46e5" /></div>
            <div className="col-md-4"><DashboardCard icon={<FaCalendarAlt />} label="Events" value={metrics.events} color="#4f46e5" /></div>
            <div className="col-md-4"><DashboardCard icon={<FaUserGraduate />} label="Admissions" value={metrics.admissions} color="#4f46e5" /></div>
          </div>
        )}
        {activeTab === 'contacts' && <AdminContacts />}
        {activeTab === 'events' && <AdminEvents />}
        {activeTab === 'admissions' && <AdminAdmissions />}
      </div>
    </div>
  );
};

export default AdminPanel;