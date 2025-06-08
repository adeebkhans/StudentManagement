import React, { useEffect, useState } from "react";
import { getAllStudents, addStudent, updateStudent, exportStudents } from "../api/students";
import Navbar from "../components/Navbar";
import StudentTable from "../components/StudentTable";
import StudentForm from "../components/StudentForm";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Students = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formLoading, setFormLoading] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showStudents, setShowStudents] = useState(false);
    const [exporting, setExporting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (showStudents) {
            fetchStudents();
        }
    }, [showStudents]);

    const fetchStudents = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getAllStudents();
            setStudents(res.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to fetch students");
            toast.error(err?.response?.data?.message || "Failed to fetch students");
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (formData) => {
        setFormLoading(true);
        try {
            if (editingStudent) {
                await updateStudent(editingStudent._id, formData);
                setEditingStudent(null);
                setShowStudents(false);
                setStudents([]);
                toast.success("Student updated successfully!");
            } else {
                // Add student and redirect to Aadhaar upload
                const res = await addStudent(formData);
                const studentId = res.data?._id || res.data?.student?._id; // adjust as per your API response
                toast.success("Student created successfully! Please upload Aadhaar.");
                if (studentId) {
                    navigate(`/aadhaar-upload/${studentId}`);
                }
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to save student");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditStudents = async () => {
        setShowStudents(true);
    };

    const handleUpdate = (student) => {
        setEditingStudent(student);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFormCancel = () => {
        setEditingStudent(null);
    };

    const handleExport = async () => {
        setExporting(true);
        try {
            const blob = await exportStudents();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "students.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Exported student data!");
        } catch (err) {
            console.error("Export failed:", err);
            toast.error("Failed to export students");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full">
            <Navbar />
            <div className="py-8 px-2 sm:px-6 w-full max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    {editingStudent ? "Update Student" : "Create Student"}
                </h1>
                <div className="bg-white rounded shadow p-6 mb-8">
                    <StudentForm
                        onSubmit={handleFormSubmit}
                        initialData={editingStudent}
                        loading={formLoading}
                    />
                    {editingStudent && (
                        <button
                            className="mt-2 text-sm text-blue-600 underline"
                            onClick={handleFormCancel}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
                <div className="mt-4 mb-8 flex justify-between items-center">
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
                        onClick={handleEditStudents}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Click here to View all Students"}
                    </button>
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition"
                        onClick={handleExport}
                        disabled={exporting}
                    >
                        {exporting ? "Exporting..." : "Export All Student Data"}
                    </button>
                </div>
                {showStudents && (
                    <div className="bg-white rounded shadow p-4 overflow-x-auto">
                        <h2 className="text-xl font-semibold mb-4">All Students</h2>
                        {error && <div className="text-red-600 mb-4">{error}</div>}
                        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                            <StudentTable students={students} onUpdate={handleUpdate} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Students;