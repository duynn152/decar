import { useEffect, useState } from "react";
import MyCards from "../components/MyCards";

function VinFastPage() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchVinFastCars = async () => {
            try {
                const response = await fetch("http://localhost:3001/cars");
                const data = await response.json();
                setCars(data.filter(car => car.brand === "VinFast"));
            } catch (err) {
                console.error("Error fetching VinFast cars:", err);
            }
        };

        fetchVinFastCars();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>VinFast</h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "20px",
                }}
            >
                {cars.map((car) => (
                    <MyCards key={car.id} car={car} />
                ))}
            </div>
        </div>
    );
}

export default VinFastPage;
