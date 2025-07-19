import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Tabs, Button, Container, Spinner, Alert } from 'react-bootstrap';
import AdminContacts from './AdminContacts';
import AdminEvents from './AdminEvents';
import apiFetch from '../../../services/api/client';
import AdminAdmissions from './AdminAdmission';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Panel</h1>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="contacts" title="Contact Messages">
          <AdminContacts />
        </Tab>
        <Tab eventKey="events" title="Events">
          <AdminEvents />
        </Tab>
        <Tab eventKey='admissions' title="Admissions">
          <AdminAdmissions />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;