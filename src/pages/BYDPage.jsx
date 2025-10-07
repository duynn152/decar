import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import MyCards from "../components/MyCards";

function BYDPage() {
    const [cars, setCars] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchBYDCars = async () => {
            try {
                const response = await fetch("http://localhost:3001/cars");
                const data = await response.json();
                setCars(data.filter(car => car.brand === "BYD"));
            } catch (err) {
                console.error("Error fetching BYD cars:", err);
            }
        };

        fetchBYDCars();
    }, []);

    return (
        <div className="page-container" data-bs-theme={theme}>
            <div className="page-header">
                <h1 className="page-title">BYD</h1>
                <p className="page-subtitle">Thương hiệu xe điện Trung Quốc</p>
            </div>
            <div className="cards-grid">
                {cars.map((car) => (
                    <MyCards key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default BYDPage;
