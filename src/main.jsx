import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import axios from 'axios'; // Import axios

// Configure Axios base URL to point to json-server
// axios.defaults.baseURL = 'http://localhost:3001'; // Removed as Vite proxy now handles this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
