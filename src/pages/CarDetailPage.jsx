import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BatteryCharging, Speedometer, GeoAlt, StarFill } from "react-bootstrap-icons";
import { useTheme } from "../contexts/ThemeContext";
import styles from "../Styles/CarDetailpage.module.css";
import axios from 'axios';
import { useAuth } from "../contexts/AuthContext";
import { Form, Button, Card } from "react-bootstrap";
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
            </div>

            <div className={styles.detailSectionsContainer}>
                <div className={styles.additionalSpecs}>
                    <h3>Thông số kỹ thuật chi tiết</h3>
                    <div className={styles.specsGrid}>
                        <p className={styles.specItem}><Speedometer size={20} /> <b>Tốc độ tối đa:</b> {car.topSpeed} km/h</p>
                        <p className={styles.specItem}><GeoAlt size={20} /> <b>Quãng đường:</b> {car.range} km</p>
                        <p className={styles.specItem}><BatteryCharging size={20} /> <b>Dung lượng pin:</b> {car.batteryCapacity} kWh</p>
                        <p className={styles.specItem}><b>Tăng tốc (0-100km/h):</b> {car.acceleration} giây</p>
                    </div>
                </div>

                <div className={styles.detailSpecs}>
                    <h3>Giá và Mô tả</h3>
                    <div className={styles.priceDescriptionBox}>
                        <p className={styles.priceText}><b>Giá:</b> {car.price.toLocaleString()} VND</p>
                        <p className={styles.description}>{car.description}</p>
                    </div>
                </div>
            </div>

            {/* --- Feedback --- */}
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
                                placeholder="Viết cảm nhận của bạn..."
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Gửi Feedback</Button>
                    </Form>
                ) : user && user.role === 'member' && hasUserFeedbacked ? (
                    <p className={styles.feedbackMessage}>Bạn đã gửi feedback cho xe này.</p>
                ) : (
                    <p className={styles.feedbackMessage}>Vui lòng đăng nhập bằng tài khoản thành viên để gửi feedback.</p>
                )}

                <div className={styles.feedbackList}>
                    {car.feedback && car.feedback.length > 0 ? (
                        car.feedback.map((f, index) => (
                            <Card key={index} className={styles.feedbackCard}>
                                <Card.Body>
                                    <Card.Title>
                                        {Array.from({ length: f.rating }).map((_, i) => (
                                            <StarFill key={i} size={16} className={styles.starIcon} />
                                        ))}
                                    </Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">
                                        Bởi {f.author} vào {new Date(f.date).toLocaleDateString()}
                                    </Card.Subtitle>
                                    <Card.Text>{f.comment}</Card.Text>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p className={styles.feedbackMessage}>Chưa có feedback nào.</p>
                    )}
                </div>
            </div>

            {/* --- Nút quay về --- */}
            <button onClick={() => navigate("/")} className={styles.backButton}>
                <ArrowLeft size={18} className={styles.icon} /> Quay về trang chủ
            </button>
        </div>


    );
}

export default CarDetailPage;
