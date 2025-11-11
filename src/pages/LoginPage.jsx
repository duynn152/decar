import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, Form, Button } from 'react-bootstrap';
import styles from "../Styles/LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { login } = useAuth();

  const validationSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.get(`http://localhost:3001/users`);
        const users = response.data;

        const user = users.find(u => u.username.toLowerCase() === values.username.trim().toLowerCase() && u.password.toLowerCase() === values.password.trim().toLowerCase());

        if (user) {
          login(user);
          alert('Login successful!');
          if (user.role === 'admin') {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } else {
          alert('Invalid username or password');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login.');
      }
    },
  });

  return (
    <Container fluid data-bs-theme={theme} className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className={`card p-4 shadow-lg ${styles.loginCard}`}>
        <div className="w-100">
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.username && !!formik.errors.username}
                required
              />
              {formik.touched.username && formik.errors.username && (
                <Form.Text className="text-danger">
                  {formik.errors.username}
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.password && !!formik.errors.password}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <Form.Text className="text-danger">
                  {formik.errors.password}
                </Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting} className="w-100 mt-3">
              Login
            </Button>
          </Form>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default LoginPage;