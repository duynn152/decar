import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BatteryCharging, Speedometer, GeoAlt } from "react-bootstrap-icons";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../Styles/CarDetailpage.module.css";

function CarDetailPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const navigate = useNavigate();
    const { theme } = useTheme();

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await fetch(`http://localhost:3001/cars/${id}`);
                const data = await response.json();
                setCar(data);
            } catch (err) {
                console.error("Error fetching car:", err);
            }
        };

        fetchCar();
    }, [id]);

    if (!car) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className={styles.detailContainer} data-bs-theme={theme}>
            <div className={styles.hero}>
                <img src={car.image} alt={car.name} className={styles.heroImg} />
                <div className={styles.heroTitle}>
                    {car.brand} {car.name}
                </div>
                <div className={styles.heroBottomSpecs}>
                    <div className={styles.heroSpec}><BatteryCharging size={18} /> <span>Pin:</span> <strong>{car.batteryCapacity} kWh</strong></div>
                    <div className={styles.heroSpec}><GeoAlt size={18} /> <span>Quãng đường:</span> <strong>{car.range} km</strong></div>
                    <div className={styles.heroSpec}><Speedometer size={18} /> <span>0-100 km/h:</span> <strong>{car.acceleration} giây</strong></div>
                </div>
            </div>

            <div className={styles.detailSpecs}>
                <p className={styles.specItem}><b>Giá:</b> {car.price.toLocaleString()} VND</p>
            </div>
            <p className={styles.description}>{car.description}</p>

            <button onClick={() => navigate("/")} className={styles.backButton}>
                <ArrowLeft size={18} className={styles.icon} /> Quay về trang chủ
            </button>
        </div>
    );
}

export default CarDetailPage;
