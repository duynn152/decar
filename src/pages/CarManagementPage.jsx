// src/pages/CarManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useSearch } from "../contexts/SearchContext";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/CarManagementPage.module.css";

const CarManagementPage = () => {
  const { theme } = useTheme();
  const { searchTerm } = useSearch();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  const fetchCars = async () => {
    try {
      const { data } = await axios.get("http://localhost:3001/cars");
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      alert("Error fetching cars.");
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this car?")) {
      await axios.delete(`http://localhost:3001/cars/${id}`);
      fetchCars();
    }
  };

  const filteredCars = cars.filter((c) =>
    [c.name, c.brand].some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Container data-bs-theme={theme} className={styles.carManagementContainer}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Car Management</h2>
        <Button variant="primary" onClick={() => navigate("/dashboard/admin/cars/add")}>
          Add Car
        </Button>
      </div>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Brand</th>
            <th>Name</th>
            <th>Image</th>
            <th>Top Speed</th>
            <th>Range</th>
            <th>Acceleration</th>
            <th>Battery Capacity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCars.length ? (
            filteredCars.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.brand}</td>
                <td>{c.name}</td>
                <td>
                  <img
                    src={c.image}
                    alt={c.name}
                    className={styles.tableImg}
                  />
                </td>
                <td>{c.topSpeed} km/h</td>
                <td>{c.range} km</td>
                <td>{c.acceleration} s</td>
                <td>{c.batteryCapacity} kWh</td>
                <td>{c.price.toLocaleString()} VND</td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => navigate(`/dashboard/admin/cars/edit/${c.id}`)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="text-center">
                No cars found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default CarManagementPage;
