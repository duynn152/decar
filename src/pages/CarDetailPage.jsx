import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "react-bootstrap-icons";
import styles from "../Styles/CarDetailpage.module.css";

function CarDetailPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const navigate = useNavigate();

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
        <div className={styles.detailContainer}>
            <h1>{car.brand} {car.name}</h1>
            <img src={car.image} alt={car.name} className={styles.detailImage} />
            <p><b>Pin:</b> {car.batteryCapacity} kWh</p>
            <p><b>Quãng đường:</b> {car.range} km</p>
            <p><b>0-100 km/h:</b> {car.acceleration} giây</p>
            <p><b>Giá:</b> {car.price.toLocaleString()} VND</p>
            <p>{car.description}</p>

            <button onClick={() => navigate("/")} className={styles.backButton}>
                <ArrowLeft size={18} className={styles.icon} /> Quay về trang chủ
            </button>
        </div>
    );
}

export default CarDetailPage;
