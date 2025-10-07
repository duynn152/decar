import { Navbar, Nav, Container, Button, Form } from "react-bootstrap";
import { CarFront, Moon, SunFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useSearch } from "../contexts/SearchContext";
import styles from "../Styles/MyNavbar.module.css";

function MyNavbar() {
    const { theme, toggleTheme } = useTheme();
    const { searchTerm, setSearchTerm } = useSearch();
    

    return (
        <Navbar expand="lg" className={styles.navbar} data-bs-theme={theme}>
            <Container className={styles.navContainer}>
                {/* Left: Brand */}
                <Navbar.Brand as={Link} to="/" className={styles.brand}>
                    <CarFront size={26} className={styles.icon} /> DECAR
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav" className={styles.collapseArea}>
                    {/* Center: Links */}
                    <Nav className={styles.centerLinks}>
                        <Nav.Link as={Link} to="/" className={styles.link}>Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" className={styles.link}>About</Nav.Link>
                        <Nav.Link as={Link} to="/vinfast" className={styles.link}>VinFast</Nav.Link>
                        <Nav.Link as={Link} to="/tesla" className={styles.link}>Tesla</Nav.Link>
                        <Nav.Link as={Link} to="/byd" className={styles.link}>BYD</Nav.Link>
                    </Nav>

                    {/* Right: Search + Theme toggle */}
                    <div className={styles.rightActions}>
                        <Form className={styles.searchForm} role="search" onSubmit={(e) => e.preventDefault()}>
                            <Form.Control
                                type="search"
                                name="q"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm theo tên hoặc hãng..."
                                className={styles.searchInput}
                                aria-label="Search cars by name or brand"
                            />
                        </Form>
                        <div className={styles.themeToggle}>
                            <Button
                                onClick={toggleTheme}
                                variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
                                className={styles.themeButton}
                            >
                                {theme === 'light'
                                    ? <Moon size={18} />
                                    : <SunFill size={18} />
                                }
                            </Button>
                        </div>
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavbar;
