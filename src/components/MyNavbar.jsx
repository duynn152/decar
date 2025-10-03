import { Navbar, Nav, Container } from "react-bootstrap";
import { CarFront, InfoCircle } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import styles from "../Styles/MyNavbar.module.css";

function MyNavbar() {
    return (
        <Navbar expand="lg" className={styles.navbar}>
            <Container>
                {/* Logo thương hiệu */}
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    <CarFront size={26} className={styles.icon} /> DECAR
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    {/* Link menu */}
                    <Nav className={styles.navLinks}>
                        <Nav.Link as={Link} to="/" className={styles.link}>
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about" className={styles.link}>
                            About
                        </Nav.Link>
                        <Nav.Link as={Link} to="/tesla" className={styles.link}>
                            Tesla
                        </Nav.Link>
                        <Nav.Link as={Link} to="/vinfast" className={styles.link}>
                            VinFast
                        </Nav.Link>
                        <Nav.Link as={Link} to="/byd" className={styles.link}>
                            BYD
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;
