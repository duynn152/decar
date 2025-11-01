import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import MyCards from "../components/MyCards";
import axios from 'axios';

function TeslaPage() {
    const [cars, setCars] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchTeslaCars = async () => {
            try {
                const response = await axios.get("http://localhost:3001/cars");
                setCars(response.data.filter(car => car.brand === "Tesla"));
            } catch (err) {
                console.error("Error fetching Tesla cars:", err);
            }
        };

        fetchTeslaCars();
    }, []);

    return (
        <div className="page-container" data-bs-theme={theme}>
            <div className="page-header">
                <h1 className="page-title">Tesla</h1>
                <p className="page-subtitle">Thương hiệu xe điện Mỹ</p>
            </div>
            <div className="cards-grid">
                {cars.map((car) => (
                    <MyCards key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default TeslaPage;
