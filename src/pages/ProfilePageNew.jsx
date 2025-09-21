import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import './ProfilePageNew.css';

const ProfilePageNew = () => {
  const { user, isAuthenticated, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    avatar: '👤'
  });

  const emojiAvatars = [
    '👤', '😊', '😎', '🤓', '😄', '🥳', '🤗', '😌', '🙂', '😉',
    '🧑‍💼', '👨‍💼', '👩‍💼', '🧑‍🎓', '👨‍🎓', '👩‍🎓',
    '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔧', '👨‍🔧', '👩‍🔧',
    '💼', '🏢', '🎯', '⭐', '🚀', '💎', '🔥', '⚡'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
        avatar: user.avatar || '👤'
      });
    }
  }, [user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarSelect = (avatar) => {
    setFormData({ ...formData, avatar });
    setShowAvatarSelector(false);
  };

  const handleSave = async () => {
    try {
      // Update user profile via API
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          updateUser(data.user);
          setIsEditing(false);
          alert('Profile updated successfully!');
        }
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const renderProfileTab = () => (
    <div className="profile-content">
      <div className="profile-header">
        <div className="avatar-section">
          <div 
            className="profile-avatar"
            onClick={() => setShowAvatarSelector(true)}
            style={{ cursor: 'pointer' }}
          >
            {formData.avatar}
          </div>
          <button 
            className="change-avatar-btn"
            onClick={() => setShowAvatarSelector(true)}
          >
            Change Avatar
          </button>
          
          {showAvatarSelector && (
            <div className="avatar-selector">
              <div className="avatar-grid">
                {emojiAvatars.map((emoji, index) => (
                  <button
                    key={index}
                    className={`avatar-option ${formData.avatar === emoji ? 'selected' : ''}`}
                    onClick={() => handleAvatarSelect(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button 
                className="close-selector"
                onClick={() => setShowAvatarSelector(false)}
              >
                Close
              </button>
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h2>{formData.firstName} {formData.lastName}</h2>
          <p className="profile-email">{formData.email}</p>
        </div>
        
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button 
                className="save-btn"
                onClick={handleSave}
              >
                <i className="fas fa-save"></i>
                Save
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    company: user.company || '',
                    avatar: user.avatar || '👤'
                  });
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your last name"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="form-group full-width">
            <label>Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your company name"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <h1>My Account</h1>
          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile Settings
            </button>
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => navigate('/orders')}
            >
              <i className="fas fa-shopping-bag"></i>
              My Orders
            </button>
            <button
              className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <i className="fas fa-map-marker-alt"></i>
              Addresses
            </button>
          </nav>
          
          <button 
            className="home-btn"
            onClick={() => navigate('/')}
          >
            <i className="fas fa-home"></i>
            Go to Home
          </button>
        </div>

        <div className="profile-main">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'addresses' && (
            <div className="addresses-content">
              <h3>Saved Addresses</h3>
              <p>Address management coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePageNew;