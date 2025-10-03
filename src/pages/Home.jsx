import { useEffect, useState } from "react";
import MyCards from "../components/MyCards";

function Home() {
    const [cars, setCars] = useState([]);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await fetch("http://localhost:3001/cars");
                const data = await response.json();
                setCars(data);
            } catch (err) {
                console.error("Error fetching cars:", err);
            }
        };

        fetchCars();
    }, []);

    return (
        <div style={{ padding: "20px" }} >
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                <h1>Showroom DECAR</h1>
                <p>Tất cả các dòng xe từ Tesla, VinFast và BYD</p>
            </div>
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

export default Home;
