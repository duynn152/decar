// src/pages/EditFeedbackPage.jsx
import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { Container, Form, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const EditFeedbackPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { carId, author, date } = useParams();
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  const validationSchema = Yup.object({
    rating: Yup.number()
      .min(1)
      .max(5)
      .required("Vui lòng chọn đánh giá"),
    comment: Yup.string()
      .required("Vui lòng nhập bình luận")
      .max(500),
  });

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/cars/${carId}`);
        setCar(data);

        // Tìm feedback cần edit
        const decodedAuthor = decodeURIComponent(author);
        const decodedDate = decodeURIComponent(date);
        const foundFeedback = data.feedback?.find(
          (f) => f.author === decodedAuthor && f.date === decodedDate
        );

        if (foundFeedback) {
          setFeedback(foundFeedback);
        } else {
          alert("Không tìm thấy feedback.");
          navigate("/dashboard/admin/feedback");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching car:", error);
        alert("Error loading car data.");
        navigate("/dashboard/admin/feedback");
      }
    };

    if (carId && author && date) {
      fetchCar();
    }
  }, [carId, author, date, navigate]);

  const formik = useFormik({
    initialValues: {
      rating: feedback?.rating || 0,
      comment: feedback?.comment || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!car || !feedback) return;

      try {
        const decodedAuthor = decodeURIComponent(author);
        const decodedDate = decodeURIComponent(date);

        const updatedFeedbackList = car.feedback.map((fb) =>
          fb.author === decodedAuthor && fb.date === decodedDate
            ? { ...fb, rating: values.rating, comment: values.comment }
            : fb
        );

        const updatedCar = { ...car, feedback: updatedFeedbackList };
        await axios.put(`http://localhost:3001/cars/${carId}`, updatedCar);

        alert("Feedback đã được cập nhật thành công!");
        navigate("/dashboard/admin/feedback");
      } catch (err) {
        console.error("Lỗi khi cập nhật feedback:", err);
        alert("Không thể cập nhật feedback, vui lòng thử lại.");
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

  if (!user || user.role !== "admin") return null;

  return (
    <Container data-bs-theme={theme} className="py-4">
      <div>
        <h2 className="w-100 text-center">Edit Feedback</h2>
      </div>

      <Form onSubmit={formik.handleSubmit} className="mt-4">
        <Form.Group className="mb-3">
          <Form.Label>Car</Form.Label>
          <Form.Control type="text" value={car?.name || ""} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Author</Form.Label>
          <Form.Control type="text" value={feedback?.author || ""} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Select
            {...formik.getFieldProps("rating")}
            isInvalid={formik.touched.rating && formik.errors.rating}
          >
            <option value="0">Chọn mức đánh giá</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} sao
              </option>
            ))}
          </Form.Select>
          {formik.touched.rating && formik.errors.rating && (
            <div className="text-danger">{formik.errors.rating}</div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            {...formik.getFieldProps("comment")}
            isInvalid={formik.touched.comment && formik.errors.comment}
          />
          {formik.touched.comment && formik.errors.comment && (
            <div className="text-danger">{formik.errors.comment}</div>
          )}
        </Form.Group>

        <div className="text-end">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard/admin/feedback")}
            className="me-2"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={formik.isSubmitting}>
            Save Changes
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditFeedbackPage;

