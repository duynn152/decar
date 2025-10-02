import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BatteryCharging, Speedometer, GeoAlt, CurrencyDollar } from "react-bootstrap-icons";
import styles from "../Styles/MyCards.module.css";

function MyCards({ car }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <Card className={styles.card}>
                {/* Bấm vào ảnh thì mở modal */}
                <Card.Img
                    variant="top"
                    src={car.image}
                    alt={car.name}
                    className={styles.cardImg}
                    onClick={() => setShow(true)}
                />
                <Card.Body className={styles.cardBody}>
                    <Card.Title className={styles.cardTitle}>
                        {car.brand} {car.name}
                    </Card.Title>
                    <Card.Text className={styles.cardText}>
                        <div className={styles.specRow}>
                            <BatteryCharging size={18} className={styles.specIcon} />
                            <span className={styles.specLabel}>Pin:</span>
                            <span className={styles.specValue}>{car.batteryCapacity} kWh</span>
                        </div>
                        <div className={styles.specRow}>
                            <GeoAlt size={18} className={styles.specIcon} />
                            <span className={styles.specLabel}>Quãng đường:</span>
                            <span className={styles.specValue}>{car.range} km</span>
                        </div>
                        <div className={styles.specRow}>
                            <Speedometer size={18} className={styles.specIcon} />
                            <span className={styles.specLabel}>0-100 km/h:</span>
                            <span className={styles.specValue}>{car.acceleration} giây</span>
                        </div>
                    </Card.Text>

                    {/* Nút Xem chi tiết dẫn tới CarDetailPage */}
                    <Link to={`/cars/${car.id}`}>
                        <Button className={styles.detailBtn}>Xem chi tiết</Button>
                    </Link>
                </Card.Body>
            </Card>

            {/* Modal xem nhanh (gom trong file luôn) */}
            <Modal show={show} onHide={() => setShow(false)} size="lg" centered dialogClassName={styles.modalDialog} contentClassName={styles.modalContent}>
                <Modal.Header closeButton className={styles.modalHeader}>
                    <Modal.Title className={styles.modalTitle}>{car.brand} {car.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <div className={styles.modalHero}>
                        <img
                            src={car.image}
                            alt={car.name}
                            className={styles.modalHeroImg}
                        />
                    </div>

                    <div className={styles.modalTopSpecs}>
                        <div className={styles.modalSpec}>
                            <BatteryCharging size={18} className={styles.modalSpecIcon} />
                            <span>Pin:</span>
                            <strong>{car.batteryCapacity} kWh</strong>
                        </div>
                        <div className={styles.modalSpec}>
                            <GeoAlt size={18} className={styles.modalSpecIcon} />
                            <span>Quãng đường:</span>
                            <strong>{car.range} km</strong>
                        </div>
                        <div className={styles.modalSpec}>
                            <Speedometer size={18} className={styles.modalSpecIcon} />
                            <span>0-100 km/h:</span>
                            <strong>{car.acceleration} giây</strong>
                        </div>
                    </div>

                    <div className={styles.modalDetails}>
                        <p className={styles.priceRow}><CurrencyDollar size={18} className={styles.priceIcon} /> <b>Giá:</b> {car.price.toLocaleString()} VND</p>
                        <p>{car.description}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button variant="secondary" onClick={() => setShow(false)}>Đóng</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MyCards;
