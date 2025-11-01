// src/components/MyNavbar.jsx
import { Navbar, Nav, Container, Button, Form } from "react-bootstrap";
import { CarFront, Moon, SunFill } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { useSearch } from "../contexts/SearchContext";
import { useAuth } from "../contexts/AuthContext";
import styles from "../Styles/MyNavbar.module.css";

function MyNavbar() {
  const { theme, toggleTheme } = useTheme();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Khi nhấn Enter, điều hướng đến trang CarManagement hoặc Home
    navigate("/dashboard");
  };

  return (
    <Navbar expand="lg" className={styles.navbar} data-bs-theme={theme}>
      <Container className={styles.navContainer}>
        <Navbar.Brand as={Link} to="/" className={styles.brand}>
          <CarFront size={26} className={styles.icon} /> DECAR
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav" className={styles.collapseArea}>
          <Nav className={styles.centerLinks}>
            <Nav.Link as={Link} to="/" className={styles.link}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className={styles.link}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/vinfast" className={styles.link}>
              VinFast
            </Nav.Link>
            <Nav.Link as={Link} to="/tesla" className={styles.link}>
              Tesla
            </Nav.Link>
            <Nav.Link as={Link} to="/byd" className={styles.link}>
              BYD
            </Nav.Link>
            {user && user.role === "admin" && (
              <Nav.Link as={Link} to="/dashboard" className={styles.link}>
                Dashboard
              </Nav.Link>
            )}
          </Nav>

          <div className={styles.rightActions}>
            <Form
              className={styles.searchForm}
              role="search"
              onSubmit={handleSearchSubmit}
            >
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

            {!user ? (
              <Nav.Link as={Link} to="/login" className={styles.link}>
                Login
              </Nav.Link>
            ) : (
              <>
                <span className={styles.welcomeText}>
                  Hello, {user.username}!
                </span>
                <Nav.Link onClick={handleLogout} className={styles.link}>
                  Logout
                </Nav.Link>
              </>
            )}

            <div className={styles.themeToggle}>
              <Button
                onClick={toggleTheme}
                variant={theme === "light" ? "outline-dark" : "outline-light"}
                className={styles.themeButton}
              >
                {theme === "light" ? <Moon size={18} /> : <SunFill size={18} />}
              </Button>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
