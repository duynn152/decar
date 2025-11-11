import React, { useState, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";
import axios from "axios";
import styles from "../Styles/FeedbackManagementPage.module.css";

const FeedbackManagementPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  const fetchCars = async () => {
    try {
      const res = await axios.get("http://localhost:3001/cars");
      const carsWithFeedback = res.data.filter(
        (car) => car.feedback && car.feedback.length > 0
      );
      setCars(carsWithFeedback);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu xe:", err);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const deleteFeedback = async (car, feedbackToDelete) => {
    if (!window.confirm("Bạn có chắc muốn xóa feedback này?")) return;

    try {
      const updatedFeedback = car.feedback.filter(
        (f) => !(f.author === feedbackToDelete.author && f.date === feedbackToDelete.date)
      );

      const updatedCar = { ...car, feedback: updatedFeedback };
      await axios.put(`http://localhost:3001/cars/${car.id}`, updatedCar);
      fetchCars();
    } catch (err) {
      console.error("Lỗi khi xóa feedback:", err);
      alert("Không thể xóa feedback.");
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <Container data-bs-theme={theme} className="py-4">
      <h2 className="mb-4 text-center">Feedback Management</h2>

      {/* Bảng danh sách feedback */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Car</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {cars.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">Không có feedback nào</td>
            </tr>
          ) : (
            cars.map((car) =>
              car.feedback.map((f, index) => (
                <tr key={`${car.id}-${index}`}>
                  <td>{car.name}</td>
                  <td>{f.author}</td>
                  <td>{f.rating} sao</td>
                  <td>{f.comment}</td>
                  <td>{new Date(f.date).toLocaleDateString()}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="warning"
                      className="me-2"
                      onClick={() =>
                        navigate(
                          `/dashboard/admin/feedback/edit/${car.id}/${encodeURIComponent(f.author)}/${encodeURIComponent(f.date)}`
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteFeedback(car, f)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default FeedbackManagementPage;
