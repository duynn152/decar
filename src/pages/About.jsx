
import { useTheme } from "../contexts/ThemeContext";
import styles from "../Styles/AboutPage.module.css";

function About() {
    const { theme } = useTheme();
    
    return (
        <div className={styles.pageContainer} data-bs-theme={theme}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Về dự án</h1>
                <div className={styles.aboutContent}>
                    <p className={styles.aboutText}>
                        Đây là showroom xe điện demo được xây dựng bằng React + JSON Server.
                        Bạn có thể xem thông tin chi tiết từng xe, lọc theo hãng (Tesla, VinFast, BYD).
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
