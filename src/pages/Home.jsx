import { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useSearch } from "../contexts/SearchContext";
import MyCards from "../components/MyCards";

function Home() {
    const [cars, setCars] = useState([]);
    const { theme } = useTheme();
    const { searchTerm } = useSearch();
    const query = (searchTerm || "").toLowerCase();

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
        <div className="page-container" data-bs-theme={theme}>
            <div className="page-header">
                <h1 className="page-title">Showroom DECAR</h1>
                <p className="page-subtitle">Tất cả các dòng xe từ Tesla, VinFast và BYD</p>
            </div>
            <div className="cards-grid">
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
