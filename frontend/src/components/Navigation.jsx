import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import './Navigation.css';

const Navigation = () => {
  const { currentUser, logout } = useContext(AppContext);
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📋</span>
          TaskFlow
        </Link>

        <div className="navbar-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
        </div>

        <div className="navbar-right">
          <div className="user-info">
            <img src={currentUser?.profilePicture || 'https://i.pravatar.cc/150?img=default'} alt={currentUser?.username || 'User'} className="user-avatar" />
            <span className="username">{currentUser?.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
