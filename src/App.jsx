import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyNavbar from "./components/MyNavbar";
import Home from "./pages/Home";
import About from "./pages/About";
import TeslaPage from "./pages/TeslaPage";
import VinFastPage from "./pages/VinFastPage";
import BYDPage from "./pages/BYDPage";
import CarDetailPage from "./pages/CarDetailPage";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/tesla" element={<TeslaPage />} />
        <Route path="/vinfast" element={<VinFastPage />} />
        <Route path="/byd" element={<BYDPage />} />
        <Route path="/cars/:id" element={<CarDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
