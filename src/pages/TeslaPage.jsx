import React, { useEffect, useState } from "react";
import MyCards from "../components/MyCards";

function TeslaPage() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/cars")
            .then((res) => res.json())
            .then((data) => setCars(data.filter(car => car.brand === "Tesla")))
            .catch((err) => console.error("Error fetching Tesla cars:", err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Tesla</h1>
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

export default TeslaPage;
