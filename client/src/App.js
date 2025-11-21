import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/login/Login';
import Availability from "./pages/classrooms/Availability"; // adjust path
import Dashboard from './pages/dashboard/Dashboard'; // example additional page



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/availability" element={<Availability />} />

      </Routes>
    </Router>
  );
}

export default App;
