import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BatteryCharging, Speedometer, GeoAlt, StarFill } from "react-bootstrap-icons";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../Styles/CarDetailpage.module.css";
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { v4 as uuidv4 } from 'uuid';

function CarDetailPage() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hasUserFeedbacked, setHasUserFeedbacked] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/cars/${id}`);
                setCar(response.data);
                if (user && response.data.feedback) {
                    const feedbacked = response.data.feedback.some(f => f.author === user.username);
                    setHasUserFeedbacked(feedbacked);
                }
            } catch (err) {
                console.error("Error fetching car:", err);
            }
        };

        fetchCar();
    }, [id, user]);

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!user || user.role !== 'member') {
            alert("Only members can submit feedback.");
            return;
        }
        if (hasUserFeedbacked) {
            alert("You have already submitted feedback for this car.");
            return;
        }
        if (rating === 0) {
            alert("Please provide a rating.");
            return;
        }

        const newFeedback = {
            id: uuidv4(),
            rating: parseInt(rating),
            comment,
            author: user.username,
            date: new Date().toISOString(),
        };

        try {
            const updatedCar = { ...car, feedback: [...car.feedback, newFeedback] };
            await axios.put(`http://localhost:3001/cars/${car.id}`, updatedCar);
            setCar(updatedCar);
            setRating(0);
            setComment('');
            setHasUserFeedbacked(true);
            alert("Feedback submitted successfully!");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback.");
        }
    };

    if (!car) return <p>Đang tải dữ liệu...</p>;

    return (
        <div className={styles.detailContainer} data-bs-theme={theme}>
            <div className={styles.hero}>
                <img src={car.image} alt={car.name} className={styles.heroImg} />
                <div className={styles.heroTitle}>
                    {car.brand} {car.name}
                </div>
                <div className={styles.heroBottomSpecs}>
                    <div className={styles.heroSpec}><BatteryCharging size={18} /> <span>Pin:</span> <strong>{car.batteryCapacity} kWh</strong></div>
                    <div className={styles.heroSpec}><GeoAlt size={18} /> <span>Quãng đường:</span> <strong>{car.range} km</strong></div>
                    <div className={styles.heroSpec}><Speedometer size={18} /> <span>0-100 km/h:</span> <strong>{car.acceleration} giây</strong></div>
                </div>
            </div>

            <div className={styles.detailSpecs}>
                <p className={styles.specItem}><b>Giá:</b> {car.price.toLocaleString()} VND</p>
            </div>
            <p className={styles.description}>{car.description}</p>

            <button onClick={() => navigate("/")} className={styles.backButton}>
                <ArrowLeft size={18} className={styles.icon} /> Quay về trang chủ
            </button>

            <div className={styles.feedbackSection}>
                <h3>Feedback</h3>
                {user && user.role === 'member' && !hasUserFeedbacked ? (
                    <Form onSubmit={handleFeedbackSubmit} className={styles.feedbackForm}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Control
                                as="select"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                required
                            >
                                <option value="0">Select a rating</option>
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your comment here..."
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Submit Feedback</Button>
                    </Form>
                ) : user && user.role === 'member' && hasUserFeedbacked ? (
                    <p className={styles.feedbackMessage}>You have already submitted feedback for this car.</p>
                ) : (
                    <p className={styles.feedbackMessage}>Please login as a member to submit feedback.</p>
                )}

                <div className={styles.feedbackList}>
                    {car.feedback && car.feedback.length > 0 ? (
                        car.feedback.map((f, index) => (
                            <Card key={index} className={styles.feedbackCard}>
                                <Card.Body>
                                    <Card.Title>
                                        Rating: {
                                            [...Array(f.rating)].map((_, i) => (
                                                <StarFill key={i} size={16} className={styles.starIcon} />
                                            ))
                                        }
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">By {f.author} on {new Date(f.date).toLocaleDateString()}</Card.Subtitle>
                                    <Card.Text>{f.comment}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className={styles.feedbackMessage}>No feedback yet. Be the first to leave one!</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CarDetailPage;
