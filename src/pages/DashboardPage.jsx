import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { HouseFill, CarFrontFill, PeopleFill, ChatSquareDotsFill } from 'react-bootstrap-icons';
import styles from '../Styles/DashboardPage.module.css';
import axios from 'axios';

const DashboardPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [carCount, setCarCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }

    const fetchDashboardData = async () => {
      try {
        const carsResponse = await axios.get('http://localhost:3001/cars');
        const usersResponse = await axios.get('http://localhost:3001/users');

        setCarCount(carsResponse.data.length);
        setUserCount(usersResponse.data.length);

        let totalFeedback = 0;
        carsResponse.data.forEach(car => {
          if (car.feedback) {
            totalFeedback += car.feedback.length;
          }
        });
        setFeedbackCount(totalFeedback);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.dashboardContainer} data-bs-theme={theme}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <h4>Admin Menu</h4>
        <Link
          to="/dashboard"
          className={`${styles.sidebarLink} ${isActive('/dashboard') ? styles.active : ''}`}
        >
          <HouseFill size={20} /> <span>Tổng quan</span>
        </Link>
        <Link
          to="/dashboard/admin/cars"
          className={`${styles.sidebarLink} ${isActive('/dashboard/admin/cars') ? styles.active : ''}`}
        >
          <CarFrontFill size={20} /> <span>Quản lý Xe</span>
        </Link>
        <Link
          to="/dashboard/admin/feedback"
          className={`${styles.sidebarLink} ${isActive('/dashboard/admin/feedback') ? styles.active : ''}`}
        >
          <ChatSquareDotsFill size={20} /> <span>Feedback</span>
        </Link>
        <Link
          to="/dashboard/admin/users"
          className={`${styles.sidebarLink} ${isActive('/dashboard/admin/users') ? styles.active : ''}`}
        >
          <PeopleFill size={20} /> <span>Người dùng</span>
        </Link>
      </aside>

      <main className={styles.mainContent}>
        <h1 className={styles.dashboardHeader}>Trang quản trị hệ thống</h1>
        {location.pathname === '/dashboard' || location.pathname === '/dashboard/' ? (
          <>
            <p className={styles.subtitle}>
              Quản lý toàn bộ nội dung của DEcar bao gồm xe, người dùng và phản hồi.
            </p>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <h3>Tổng số xe</h3>
                <p>{carCount}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Người dùng</h3>
                <p>{userCount}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Phản hồi</h3>
                <p>{feedbackCount}</p>
              </div>
              <div className={styles.summaryCard}>
                <h3>Báo cáo</h3>
                <p>Phân tích dữ liệu và tổng hợp thống kê hệ thống.</p>
              </div>
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
