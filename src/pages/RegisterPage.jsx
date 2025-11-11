import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Container, Form, Button, Card } from "react-bootstrap";
import styles from "../Styles/RegisterPage.module.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Validation rules
  const validationSchema = Yup.object({
    username: Yup.string().min(3, "At least 3 characters").required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "At least 6 characters").required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  const handleRegister = async (values) => {
    try {
      const { data: users } = await axios.get("http://localhost:3001/users");

      const usernameExists = users.some(
        (u) => u.username?.toLowerCase() === values.username.toLowerCase()
      );
      const emailExists = users.some(
        (u) => u.email?.toLowerCase() === values.email.toLowerCase()
      );

      if (usernameExists) return alert("Username already taken.");
      if (emailExists) return alert("This email is already in use.");

      const newUser = {
        id: uuidv4(),
        username: values.username,
        email: values.email,
        password: values.password,
        role: "member",
      };

      await axios.post("http://localhost:3001/users", newUser);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: handleRegister,
  });

  return (
    <Container
      fluid
      data-bs-theme={theme}
      className="d-flex flex-column align-items-center justify-content-center min-vh-100"
    >
      <Card className={`p-4 shadow-lg ${styles.registerCard}`}>
        <Card.Body>
          <h2 className="text-center mb-4">Register</h2>

          <Form onSubmit={formik.handleSubmit}>
            {["username", "email", "password", "confirmPassword"].map((field) => (
              <Form.Group className="mb-3" key={field}>
                <Form.Label htmlFor={field}>
                  {field === "confirmPassword"
                    ? "Confirm Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </Form.Label>
                <Form.Control
                  type={field === "password" || field === "confirmPassword" ? "password" : field}
                  id={field}
                  name={field}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched[field] && !!formik.errors[field]}
                />

                {formik.touched[field] && formik.errors[field] && (
                  <Form.Text className="text-danger">
                    {formik.errors[field]}
                  </Form.Text>
                )}
              </Form.Group>
            ))}

            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting}
              className="w-100 mt-3"
            >
              {formik.isSubmitting ? "Registering..." : "Register"}
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
