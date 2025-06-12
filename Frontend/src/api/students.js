import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3009/api/v1";

// Helper to get auth token 
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Axios response interceptor for auth errors
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Add a new student
export const addStudent = async (studentData) => {
  const res = await axios.post(
    `${BASE_URL}/students`,
    studentData,
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Get all students with optional query params
export const getAllStudents = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const res = await axios.get(
    `${BASE_URL}/students${params ? `?${params}` : ""}`,
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Get student by ID
export const getStudentById = async (id) => {
  const res = await axios.get(
    `${BASE_URL}/students/${id}`,
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Update student by ID
export const updateStudent = async (id, studentData) => {
  const res = await axios.put(
    `${BASE_URL}/students/${id}`,
    studentData,
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Delete student by ID
export const deleteStudent = async (id) => {
  const res = await axios.delete(
    `${BASE_URL}/students/${id}`,
    { headers: { ...getAuthHeader() } }
  );
  return res.data;
};

// Upload Aadhaar image
export const uploadAadhaar = async (id, file) => {
  const formData = new FormData();
  formData.append("aadhar", file);
  const res = await axios.post(
    `${BASE_URL}/students/${id}/aadhar`,
    formData,
    {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res.data;
};

// Export students to Excel
export const exportStudents = async () => {
  const res = await axios.get(
    `${BASE_URL}/students/export`,
    {
      headers: { ...getAuthHeader() },
      responseType: "blob"
    }
  );
  return res.data; // This will be a Blob (Excel file)
};