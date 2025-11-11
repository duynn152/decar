// src/pages/EditMemberPage.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditMemberPage = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .max(20, "Password must be at most 20 characters")
      .notRequired(),
    role: Yup.string()
      .oneOf(["member", "admin"])
      .required("Role is required"),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/users/${id}`);
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Error loading user data.");
        navigate("/dashboard/admin/users");
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, navigate]);

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "member",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const dataToSend = values.password
          ? values
          : { ...values, password: undefined };

        await axios.put(`http://localhost:3001/users/${id}`, {
          ...dataToSend,
          id: parseInt(id),
        });
        alert("Member updated successfully!");
        navigate("/dashboard/admin/users");
      } catch (error) {
        console.error("Error updating member:", error);
        alert("An error occurred while updating the member.");
      }
    },
  });

  if (loading) {
    return (
      <Container data-bs-theme={theme} className="py-4">
        <div className="text-center mt-4">
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container data-bs-theme={theme} className="py-4">
      <div>
        <h2 className="w-100 text-center">Edit Member</h2>
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
            placeholder="Leave blank to keep current password"
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
            Update Member
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditMemberPage;

