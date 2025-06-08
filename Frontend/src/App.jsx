import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import AadhaarUpload from "./pages/AadhaarUpload";
import StudentDetails from './pages/StudentDetails';
import Fees from './pages/Fees';
import FeeDetails from './pages/FeeDetails';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/aadhaar-upload/:id" element={<AadhaarUpload />} />
          <Route path="/student/:id" element={<StudentDetails />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/fee/:id" element={<FeeDetails />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    </Router>
  )
}

export default App
