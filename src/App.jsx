import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SearchProvider } from "./contexts/SearchContext";
import MyNavbar from "./components/MyNavbar";
import Home from "./pages/Home";
import About from "./pages/About";
import TeslaPage from "./pages/TeslaPage";
import VinFastPage from "./pages/VinFastPage";
import BYDPage from "./pages/BYDPage";
import CarDetailPage from "./pages/CarDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CarManagementPage from "./pages/CarManagementPage";
import AddCarPage from "./pages/AddCarPage";
import EditCarPage from "./pages/EditCarPage";
import UserManagementPage from "./pages/UserManagementPage";
import AddMemberPage from "./pages/AddMemberPage";
import EditMemberPage from "./pages/EditMemberPage";
import FeedbackManagementPage from "./pages/FeedbackManagementPage";
import EditFeedbackPage from "./pages/EditFeedbackPage";
import { AuthProvider } from "./contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import MyFooter from "./components/Myfooter";

function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
        <AuthProvider>
          <BrowserRouter>
            <MyNavbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/tesla" element={<TeslaPage />} />
              <Route path="/vinfast" element={<VinFastPage />} />
              <Route path="/byd" element={<BYDPage />} />
              <Route path="/cars/:id" element={<CarDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/dashboard" element={<DashboardPage />}>
                <Route index element={null} />
                <Route path="admin/cars" element={<CarManagementPage />} />
                <Route path="admin/cars/add" element={<AddCarPage />} />
                <Route path="admin/cars/edit/:id" element={<EditCarPage />} />
                <Route path="admin/users" element={<UserManagementPage />} />
                <Route path="admin/users/add" element={<AddMemberPage />} />
                <Route path="admin/users/edit/:id" element={<EditMemberPage />} />
                <Route path="admin/feedback" element={<FeedbackManagementPage />} />
                <Route path="admin/feedback/edit/:carId/:author/:date" element={<EditFeedbackPage />} />
              </Route>
            </Routes>
            <MyFooter />
          </BrowserRouter>
        </AuthProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
