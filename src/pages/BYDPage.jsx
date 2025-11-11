import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import MyCards from "../components/MyCards";
import axios from 'axios';
import styles from "../Styles/BrandPage.module.css";

function BYDPage() {
    const [cars, setCars] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchBYDCars = async () => {
            try {
                const response = await axios.get("http://localhost:3001/cars");
                setCars(response.data.filter(car => car.brand === "BYD"));
            } catch (err) {
                console.error("Error fetching BYD cars:", err);
            }
        };

        fetchBYDCars();
    }, []);

    return (
        <div className={styles.pageContainer} data-bs-theme={theme}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>BYD</h1>
                <p className={styles.pageSubtitle}>Thương hiệu xe điện Trung Quốc</p>
            </div>
            <div className={styles.cardsGrid}>
                {cars.map((car) => (
                    <MyCards key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default BYDPage;
