import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { HouseFill, CarFrontFill, PeopleFill, ChatSquareDotsFill } from 'react-bootstrap-icons';
import styles from '../Styles/DashboardPage.module.css';

const DashboardPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className={styles.dashboardContainer} data-bs-theme={theme}>
      <div className={styles.sidebar}>
        <h4>Admin Menu</h4>
        <Link 
          to="/dashboard" 
          className={`${styles.sidebarLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
        >
          <HouseFill size={20} /> Tổng quan
        </Link>
        <Link 
          to="/dashboard/admin/cars" 
          className={`${styles.sidebarLink} ${location.pathname.startsWith('/dashboard/admin/cars') ? styles.active : ''}`}
        >
          <CarFrontFill size={20} /> Quản lý Xe
        </Link>
        <Link 
          to="/dashboard/admin/feedback" 
          className={`${styles.sidebarLink} ${location.pathname.startsWith('/dashboard/admin/feedback') ? styles.active : ''}`}
        >
          <ChatSquareDotsFill size={20} /> Feedback
        </Link>
        <Link 
          to="/dashboard/admin/users" 
          className={`${styles.sidebarLink} ${location.pathname.startsWith('/dashboard/admin/users') ? styles.active : ''}`}
        >
          <PeopleFill size={20} /> Người dùng
        </Link>
      </div>

      <div className={styles.mainContent}>
        <h1 className={styles.dashboardHeader}>Chào mừng đến với Admin Dashboard</h1>
        <Outlet /> 
        {location.pathname === '/dashboard' && (
          <p>Chọn một mục từ sidebar để bắt đầu quản lý.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
