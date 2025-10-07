
import { useTheme } from "../contexts/ThemeContext";

function About() {
    const { theme } = useTheme();
    
    return (
        <div className="page-container" data-bs-theme={theme}>
            <div className="page-header">
                <h1 className="page-title">Về dự án</h1>
                <div className="about-content">
                    <p className="about-text">
                        Đây là showroom xe điện demo được xây dựng bằng React + JSON Server.
                        Bạn có thể xem thông tin chi tiết từng xe, lọc theo hãng (Tesla, VinFast, BYD).
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;
