import React, { useEffect, useState } from "react";
import MyCards from "../components/MyCards";

function VinFastPage() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/cars")
            .then((res) => res.json())
            .then((data) => setCars(data.filter(car => car.brand === "VinFast")))
            .catch((err) => console.error("Error fetching VinFast cars:", err));
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
