import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AadhaarUpload from "./pages/AadhaarUpload";
import StudentDetails from './pages/StudentDetails';
import Fees from './pages/Fees';
import FeeDetails from './pages/FeeDetails';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple auth check (token in localStorage)
const isAuthenticated = () => !!localStorage.getItem("token");

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/aadhaar-upload/:id"
            element={
              <ProtectedRoute>
                <AadhaarUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/:id"
            element={
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fees"
            element={
              <ProtectedRoute>
                <Fees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fee/:id"
            element={
              <ProtectedRoute>
                <FeeDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
  )
}

export default App
