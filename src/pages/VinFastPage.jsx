import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import MyCards from "../components/MyCards";
import axios from 'axios';
import styles from "../Styles/BrandPage.module.css";

function VinFastPage() {
    const [cars, setCars] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchVinFastCars = async () => {
            try {
                const response = await axios.get("http://localhost:3001/cars");
                setCars(response.data.filter(car => car.brand === "VinFast"));
            } catch (err) {
                console.error("Error fetching VinFast cars:", err);
            }
        };

        fetchVinFastCars();
    }, []);

    return (
        <div className={styles.pageContainer} data-bs-theme={theme}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>VinFast</h1>
                <p className={styles.pageSubtitle}>Thương hiệu xe điện Việt Nam</p>
            </div>
            <div className={styles.cardsGrid}>
                {cars.map((car) => (
                    <MyCards key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default VinFastPage;
