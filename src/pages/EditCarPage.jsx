// src/pages/EditCarPage.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import styles from "../Styles/CarManagementPage.module.css";

const EditCarPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);

  const validationSchema = Yup.object({
    brand: Yup.string()
      .oneOf(["Tesla", "VinFast", "BYD"])
      .required("Brand is required"),
    name: Yup.string()
      .required("Name is required"),
    topSpeed: Yup.number()
      .min(0)
      .required("Top Speed is required"),
    range: Yup.number()
      .min(0)
      .required("Range is required"),
    acceleration: Yup.number()
      .min(0)
      .required("Acceleration is required"),
    price: Yup.number()
      .min(0)
      .required("Price is required"),
    batteryCapacity: Yup.number()
      .min(0)
      .required("Battery Capacity is required"),
    description: Yup.string()
      .required("Description is required"),
    image: Yup.string()
      .url("Must be a valid URL")
      .required("Image URL is required"),
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/cars/${id}`);
        setCar(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car:", error);
        alert("Error loading car data.");
        navigate("/dashboard/admin/cars");
      }
    };

    if (id) {
      fetchCar();
    }
  }, [id, navigate]);

  const formik = useFormik({
    initialValues: {
      brand: car?.brand || "",
      name: car?.name || "",
      topSpeed: car?.topSpeed || "",
      range: car?.range || "",
      acceleration: car?.acceleration || "",
      price: car?.price || "",
      batteryCapacity: car?.batteryCapacity || "",
      description: car?.description || "",
      image: car?.image || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await axios.put(`http://localhost:3001/cars/${id}`, {
          ...values,
          id: parseInt(id),
        });
        alert("Car updated successfully!");
        navigate("/dashboard/admin/cars");
      } catch {
        alert("Error updating car.");
      }
    },
  });

  if (loading) {
    return (
      <Container data-bs-theme={theme} className={styles.carManagementContainer}>
        <div className="text-center mt-4">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container data-bs-theme={theme} className={styles.carManagementContainer}>
      <div>
        <h2 className="w-100 text-center">Edit Car</h2>
      </div>

      <Form onSubmit={formik.handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Select {...formik.getFieldProps("brand")}>
            <option value="">Select Brand</option>
            <option value="Tesla">Tesla</option>
            <option value="VinFast">VinFast</option>
            <option value="BYD">BYD</option>
          </Form.Select>
          {formik.touched.brand && formik.errors.brand && (
            <div className="text-danger">{formik.errors.brand}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" {...formik.getFieldProps("name")} />
          {formik.touched.name && formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Top Speed (km/h)</Form.Label>
          <Form.Control type="number" {...formik.getFieldProps("topSpeed")} />
          {formik.touched.topSpeed && formik.errors.topSpeed && (
            <div className="text-danger">{formik.errors.topSpeed}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Range (km)</Form.Label>
          <Form.Control type="number" {...formik.getFieldProps("range")} />
          {formik.touched.range && formik.errors.range && (
            <div className="text-danger">{formik.errors.range}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Acceleration (s)</Form.Label>
          <Form.Control type="number" {...formik.getFieldProps("acceleration")} />
          {formik.touched.acceleration && formik.errors.acceleration && (
            <div className="text-danger">{formik.errors.acceleration}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Battery Capacity (kWh)</Form.Label>
          <Form.Control type="number" {...formik.getFieldProps("batteryCapacity")} />
          {formik.touched.batteryCapacity && formik.errors.batteryCapacity && (
            <div className="text-danger">{formik.errors.batteryCapacity}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price (VND)</Form.Label>
          <Form.Control type="number" {...formik.getFieldProps("price")} />
          {formik.touched.price && formik.errors.price && (
            <div className="text-danger">{formik.errors.price}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="text" {...formik.getFieldProps("image")} />
          {formik.touched.image && formik.errors.image && (
            <div className="text-danger">{formik.errors.image}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} {...formik.getFieldProps("description")} />
          {formik.touched.description && formik.errors.description && (
            <div className="text-danger">{formik.errors.description}</div>
          )}
        </Form.Group>

        <div className="text-end">
          <Button variant="secondary" onClick={() => navigate("/dashboard/admin/cars")} className="me-2">
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
            Update Car
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditCarPage;

