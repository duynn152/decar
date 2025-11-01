import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const FeedbackManagementPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState(null);
  const [currentCarId, setCurrentCarId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchCarsWithFeedback();
  }, []);

  const fetchCarsWithFeedback = async () => {
    try {
      const response = await axios.get('http://localhost:3001/cars');
      setCars(response.data.filter(car => car.feedback && car.feedback.length > 0));
    } catch (error) {
      console.error('Error fetching cars with feedback:', error);
    }
  };

  const validationSchema = Yup.object({
    rating: Yup.number().min(1, 'Rating must be at least 1 star').max(5, 'Rating can be at most 5 stars').required('Rating is required'),
    comment: Yup.string().required('Comment is required').max(500, 'Comment cannot exceed 500 characters'),
  });

  const formik = useFormik({
    initialValues: {
      rating: 0,
      comment: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const carToUpdate = cars.find(c => c.id === currentCarId);
        if (!carToUpdate) throw new Error("Car not found");

        const updatedFeedback = carToUpdate.feedback.map(f => 
          (f.author === currentFeedback.author && f.date === currentFeedback.date) ? { ...f, rating: values.rating, comment: values.comment } : f
        );

        const updatedCar = { ...carToUpdate, feedback: updatedFeedback };
        await axios.put(`http://localhost:3001/cars/${currentCarId}`, updatedCar);
        handleCloseFeedbackModal();
        fetchCarsWithFeedback();
      } catch (error) {
        console.error('Error updating feedback:', error);
        alert('An error occurred while updating the feedback.');
      }
    },
  });

  const handleCloseFeedbackModal = () => setShowFeedbackModal(false);
  const handleShowFeedbackModal = (feedbackToEdit, carId) => {
    setCurrentFeedback(feedbackToEdit);
    setCurrentCarId(carId);
    formik.setValues({
      rating: feedbackToEdit.rating,
      comment: feedbackToEdit.comment,
    });
    setShowFeedbackModal(true);
  };

  const handleDeleteFeedback = async (carId, feedbackToDelete) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const carToUpdate = cars.find(c => c.id === carId);
        if (!carToUpdate) throw new Error("Car not found");

        const updatedFeedback = carToUpdate.feedback.filter(f => 
          !(f.author === feedbackToDelete.author && f.date === feedbackToDelete.date)
        );

        const updatedCar = { ...carToUpdate, feedback: updatedFeedback };
        await axios.put(`http://localhost:3001/cars/${carId}`, updatedCar);
        fetchCarsWithFeedback();
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('An error occurred while deleting the feedback.');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Container data-bs-theme={theme} className="py-4">
      <h2 className="mb-4">Feedback Management</h2>

      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Car Name</th>
            <th>Author</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            car.feedback.map((f, index) => (
              <tr key={`${car.id}-${index}`}>
                <td>{car.name}</td>
                <td>{f.author}</td>
                <td>{f.rating} Stars</td>
                <td>{f.comment}</td>
                <td>{new Date(f.date).toLocaleDateString()}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowFeedbackModal(f, car.id)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteFeedback(car.id, f)}>Delete</Button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </Table>

      <Modal show={showFeedbackModal} onHide={handleCloseFeedbackModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                name="rating"
                value={formik.values.rating}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.rating && !!formik.errors.rating}
                required
              >
                <option value="0">Select a rating</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </Form.Control>
              {formik.touched.rating && formik.errors.rating && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.rating}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                rows={3}
                value={formik.values.comment}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.comment && !!formik.errors.comment}
                required
              />
              {formik.touched.comment && formik.errors.comment && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.comment}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button variant="secondary" onClick={handleCloseFeedbackModal} className="me-2">Cancel</Button>
            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>Update Feedback</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default FeedbackManagementPage;
