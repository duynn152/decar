import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useSearch } from "../contexts/SearchContext";
import MyCards from "../components/MyCards";
import axios from 'axios';
import styles from "../Styles/HomePage.module.css";

function Home() {
    const [cars, setCars] = useState([]);
    const { theme } = useTheme();
    const { searchTerm } = useSearch();
    const query = (searchTerm || "").toLowerCase();

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get("http://localhost:3001/cars");
                setCars(response.data);
            } catch (err) {
                console.error("Error fetching cars:", err);
            }
        };

        fetchCars();
    }, []);

    return (
        <div className={styles.pageContainer} data-bs-theme={theme}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Showroom DECAR</h1>
                <p className={styles.pageSubtitle}>Tất cả các dòng xe từ Tesla, VinFast và BYD</p>
            </div>
            <div className={styles.cardsGrid}>
                {cars
                  .filter(car => {
                      if (!query) return true;
                      const name = `${car.brand} ${car.name}`.toLowerCase();
                      return name.includes(query) ||
                       car.brand.toLowerCase().includes(query) ||
                        car.name.toLowerCase().includes(query);
                  })
                  .map((car) => (
                    <MyCards key={car.id} car={car} />
                  ))}
            </div>
        </div>
    );
}

export default Home;
