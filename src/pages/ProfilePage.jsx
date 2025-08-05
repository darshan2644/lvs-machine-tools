import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">Manage your account information</p>
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <h2>Account Information</h2>
            <div className="info-item">
              <label>Name:</label>
              <span>{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user?.email}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span>{user?.role || 'User'}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary">Edit Profile</button>
            <button className="btn btn-secondary">Change Password</button>
            <button className="btn btn-danger" onClick={logout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
