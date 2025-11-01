import React from "react";
import { Container } from "react-bootstrap";
import { Facebook, Instagram, Twitter, Envelope, Telephone } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import styles from "../Styles/MyFooter.module.css";

function MyFooter() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.footerContainer}>
        <div className={styles.infoGroup}>
          <h5 className={styles.brandTitle}>DECAR</h5>
          <p>Drive the Future — Khám phá thế giới xe điện thông minh cùng DECAR.</p>
        </div>

        <div className={styles.infoGroup}>
          <h6>Liên kết nhanh</h6>
          <p><Link to="/">Trang chủ</Link></p>
          <p><Link to="/about">Giới thiệu</Link></p>

        </div>

        <div className={styles.infoGroup}>
          <h6>Liên hệ</h6>
          <p><Envelope size={16} /> support@decar.com</p>
          <p><Telephone size={16} /> +84 123 456 789</p>
          <div className={styles.socialIcons}>
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
          </div>
        </div>
      </Container>
      <p className={styles.copyright}>
        © {new Date().getFullYear()} DECAR. All rights reserved.
      </p>
    </footer>
  );
}

export default MyFooter;
