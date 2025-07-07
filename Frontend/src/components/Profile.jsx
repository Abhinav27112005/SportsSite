import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import  apiFetch  from './api';
import { Button } from 'react-bootstrap';
const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const navigate = useNavigate();

  // Fetch user data 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch(`/users/profile`);
        setUserData({
          name: data.name,
          email: data.email,
          is_admin: data.is_admin || false
      });
        setFormData({
          name: data.name,
          email: data.email
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch(`/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      
      // Preserve the is_admin status when updating userData
      setUserData({ 
        ...formData,
        is_admin: userData.is_admin // Keep the existing admin status
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Update error:', error);
      setError(error.message);
    }
};

const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("New passwords don't match");
        return;
    }

    try {
        const response = await apiFetch(`/users/change-password`, {
            method: 'POST',
            body: JSON.stringify({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })
        });

        if (response.message) {
            // Success case
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setError(null);
        } else {
            setError(response.error || "Password change failed");
        }
    } catch (error) {
        console.error('Password change error:', error);
        setError(error.message || "Password change failed");
    }
};


  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden fw-bold fs-3">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !isEditing && !isChangingPassword) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger fw-bold">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning fs-4 fw-bold">
          No profile data available
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 w-100 h-100">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm w-100">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0 text-center fs-3 fw-bold">
                <i className="bi bi-person-circle"></i>
                {' '}
                My Profile
              </h2>
            </div>
            
            <div className="card-body">
              <div className="d-flex flex-column align-items-center mb-4">
                <div 
                  className="avatar-circle bg-primary text-white d-flex align-items-center justify-content-center mb-2"
                  style={{ width: '80px', height: '80px', fontSize: '4rem' }}
                >
                  {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <h3 className="h5 fs-3 fw-medium">{userData.name || 'User'}</h3>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-4">Name</label>
                    <input
                      type="text"
                      className="form-control fs-4"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-4">Email</label>
                    <input
                      type="email"
                      className="form-control fs-4"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-primary fs-4 fw-bold">
                      <i className="bi bi-check-circle"></i> Save
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary fs-4 fw-bold"
                      onClick={() => setIsEditing(false)}
                    >
                      <i className="bi bi-x-circle"></i> Cancel
                    </button>
                  </div>
                </form>
              ) : isChangingPassword ? (
                <form onSubmit={handlePasswordSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-4">Current Password</label>
                    <input
                      type="password"
                      className="form-control fs-4"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-4">New Password</label>
                    <input
                      type="password"
                      className="form-control fs-4"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      minLength="8"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-bold fs-4">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control fs-4"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="d-flex gap-3">
                    <button type="submit" className="btn btn-primary fs-4 fw-bold">
                      <i className="bi bi-check-circle"></i> Change Password
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary fs-4 fw-bold"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      <i className="bi bi-x-circle"></i> Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="mb-3">
                      <label className="form-label fw-bold fs-4">Name</label>
                      <div className="form-control bg-light fs-4 fw-normal">{userData.name || 'Not provided'}</div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold fs-4">Email</label>
                      <div className="form-control bg-light fs-4 fw-normal">{userData.email}</div>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-3">
                  
                  {userData.is_admin && (
                    <Button 
                      variant="outline-success" 
                      className="fs-4 fw-bold"
                      onClick={() => navigate('/admin')}
                    >
                      <i className="bi bi-speedometer2"></i>
                      {' '}
                      Admin Panel
                    </Button>
                  )}


                    <button 
                      className="btn btn-outline-primary fs-4 fw-bold"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil-square"></i>
                      {' '}
                      Edit Profile
                    </button>
                    <button 
                      className="btn btn-outline-secondary fs-4 fw-bold"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <i className="bi bi-shield-lock"></i>
                      {' '}
                      Change Password
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;