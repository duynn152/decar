// src/pages/AddMemberPage.jsx
import React from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddMemberPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["member", "admin"])
      .required("Role is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      role: "member",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:3001/users", values);
        alert("Member added successfully!");
        navigate("/dashboard/admin/users");
      } catch (error) {
        console.error("Error adding member:", error);
        alert("An error occurred while adding the member.");
      }
    },
  });

  return (
    <Container data-bs-theme={theme} className="py-4">
      <div>
        <h2 className="w-100 text-center">Add New Member</h2>
      </div>

      <Form onSubmit={formik.handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.username && !!formik.errors.username}
            required
          />
          {formik.touched.username && formik.errors.username && (
            <div className="text-danger">{formik.errors.username}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.email && !!formik.errors.email}
            required
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="text"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.password && !!formik.errors.password}
            required
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-danger">{formik.errors.password}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            name="role"
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={formik.touched.role && !!formik.errors.role}
            required
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </Form.Control>
          {formik.touched.role && formik.errors.role && (
            <div className="text-danger">{formik.errors.role}</div>
          )}
        </Form.Group>

        <div className="text-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/admin/users")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
            Add Member
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddMemberPage;

