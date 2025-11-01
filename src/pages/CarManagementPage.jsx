// src/pages/CarManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useSearch } from "../contexts/SearchContext";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const CarManagementPage = () => {
  const { theme } = useTheme();
  const { searchTerm } = useSearch(); // ✅ lấy từ SearchContext
  const [cars, setCars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);

  const validationSchema = Yup.object({
    brand: Yup.string()
      .oneOf(["Tesla", "VinFast", "BYD"], "Invalid Brand")
      .required("Brand is required"),
    name: Yup.string().required("Name is required"),
    topSpeed: Yup.number()
      .min(0, "Top Speed must be non-negative")
      .required("Top Speed is required"),
    range: Yup.number()
      .min(0, "Range must be non-negative")
      .required("Range is required"),
    acceleration: Yup.number()
      .min(0, "Acceleration must be non-negative")
      .required("Acceleration is required"),
    price: Yup.number()
      .min(0, "Price must be non-negative")
      .required("Price is required"),
    batteryCapacity: Yup.number()
      .min(0, "Battery Capacity must be non-negative")
      .required("Battery Capacity is required"),
    description: Yup.string().required("Description is required"),
    image: Yup.string().url("Invalid URL").required("Image URL is required"),
  });

  const formik = useFormik({
    initialValues: {
      brand: "",
      name: "",
      topSpeed: "",
      range: "",
      acceleration: "",
      price: "",
      batteryCapacity: "",
      description: "",
      image: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (currentCar) {
          await axios.put(
            `http://localhost:3001/cars/${currentCar.id}`,
            { ...values, id: currentCar.id }
          );
        } else {
          await axios.post("http://localhost:3001/cars", values);
        }
        handleClose();
        fetchCars();
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while saving the car.");
      }
    },
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const response = await axios.get("http://localhost:3001/cars");
      setCars(response.data);
    } catch (error) {
      console.error("Error fetching cars:", error);
      alert("An error occurred while fetching cars.");
    }
  };

  const handleClose = () => setShowModal(false);

  const handleShow = (car = null) => {
    setCurrentCar(car);
    if (car) {
      formik.setValues(car);
    } else {
      formik.resetForm();
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await axios.delete(`http://localhost:3001/cars/${id}`);
        fetchCars();
      } catch (error) {
        console.error("Error deleting car:", error);
        alert("An error occurred while deleting the car.");
      }
    }
  };

  // ✅ Lọc danh sách theo từ khóa tìm kiếm
  const filteredCars = searchTerm.trim()
    ? cars.filter(
        (car) =>
          car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cars;

  return (
    <Container data-bs-theme={theme} className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Car Management</h2>
        <Button variant="primary" onClick={() => handleShow()}>
          Add New Car
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
          {filteredCars.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No cars found.
              </td>
            </tr>
          ) : (
            filteredCars.map((car) => (
              <tr key={car.id}>
                <td>{car.id}</td>
                <td>{car.brand}</td>
                <td>{car.name}</td>
                <td>
                  {car.image && (
                    <img
                      src={car.image}
                      alt={car.name}
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td>{car.topSpeed} km/h</td>
                <td>{car.range} km</td>
                <td>{car.acceleration} s</td>
                <td>{car.batteryCapacity} kWh</td>
                <td>{car.price}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(car)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(car.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      {/* Modal giữ nguyên */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentCar ? "Edit Car" : "Add New Car"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
        >
          <Form onSubmit={formik.handleSubmit}>
            {Object.keys(formik.initialValues).map((key) => (
              <Form.Group className="mb-3" key={key}>
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type={key === "description" ? "textarea" : "text"}
                  as={key === "description" ? "textarea" : "input"}
                  name={key}
                  value={formik.values[key]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched[key] && !!formik.errors[key]}
                />
                {formik.touched[key] && formik.errors[key] && (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors[key]}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            ))}
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>
              {currentCar ? "Update Car" : "Add Car"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CarManagementPage;
