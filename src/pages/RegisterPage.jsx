import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // Import axios
import { v4 as uuidv4 } from 'uuid'; // Corrected import for uuid

const RegisterPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Fetch existing users to check for duplicates
        const response = await axios.get(`http://localhost:3001/users?_t=${new Date().getTime()}`); // Fetch users endpoint with hardcoded URL
        const users = response.data; // Access the users array directly

        const usernameExists = users.some(user => user.username && user.username.toLowerCase() === values.username.toLowerCase());
        const emailExists = users.some(user => user.email && user.email.toLowerCase() === values.email.toLowerCase());

        if (usernameExists) {
          alert('Username already taken.');
          return;
        }
        if (emailExists) {
          alert('Email already registered.');
          return;
        }

        const newUser = {
          id: uuidv4(),
          username: values.username,
          email: values.email,
          password: values.password, // In a real app, this should be hashed
          role: 'member',
        };

        await axios.post('http://localhost:3001/users', newUser); // POST to users endpoint with hardcoded URL
        alert('Registration successful! Please log in.');
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration.');
      }
    },
  });

  return (
    <Container fluid data-bs-theme={theme} className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Card className="p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body className="w-100">
          <h2 className="text-center mb-4">Register</h2>
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.username}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.email && !!formik.errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.email}
              </Form.Control.Feedback>
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
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting} className="w-100 mt-3">
              Register
            </Button>
          </Form>
          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;
