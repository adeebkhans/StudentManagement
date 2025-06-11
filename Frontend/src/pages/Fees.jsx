import React, { useState } from "react";
import { getNewStudentsWithNoFeeRecords, getAllFees, updateFee as updateFeeApi, exportFees } from "../api/fees";
import FeeTable from "../components/FeeTable";
import FeeForm from "../components/FeeForm";
import NewFee from "../components/NewFee";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Fees = () => {
    const [view, setView] = useState(""); // "new" or "existing"
    const [loading, setLoading] = useState(false);
    const [newStudents, setNewStudents] = useState([]);
    const [fees, setFees] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [updateFee, setUpdateFee] = useState(null); // For updating deposited
    const [exporting, setExporting] = useState(false);
    const navigate = useNavigate();

    const handleShowNewStudents = async () => {
        setLoading(true);
        setView("new");
        setSelectedStudent(null);
        setUpdateFee(null);
        try {
            const res = await getNewStudentsWithNoFeeRecords();
            setNewStudents(res.data || []);
        } catch (err) {
            console.error("Failed to fetch new students:", err);
            toast.error("Failed to fetch new students");
        } finally {
            setLoading(false);
        }
    };

    const handleShowExistingFees = async () => {
        setLoading(true);
        setView("existing");
        setSelectedStudent(null);
        setUpdateFee(null);
        try {
            const res = await getAllFees();
            setFees(res.data || []);
        } catch (err) {
            console.error("failed to fetch fee record", err)
            toast.error("Failed to fetch fee records");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFee = (student) => {
        setSelectedStudent(student);
        setUpdateFee(null);
    };

    const handleFeeFormSuccess = () => {
        setSelectedStudent(null);
        handleShowNewStudents();
    };

    const handleFeeFormCancel = () => {
        setSelectedStudent(null);
    };

    // For updating deposited fee (add new installment)
    const handleUpdateDeposited = (fee) => {
        setUpdateFee(fee);
        setSelectedStudent(null);
    };

    const handleUpdateDepositedSubmit = async (e) => {
        e.preventDefault();
        const addAmount = Number(e.target.elements.newInstallment.value);
        if (isNaN(addAmount) || addAmount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        try {
            await updateFeeApi(updateFee._id, {
                newDeposit: addAmount,
            });
            toast.success("Installment added!");
            setUpdateFee(null);
            handleShowExistingFees();
        } catch (err) {
            console.error("Failed to update fee:", err);
            toast.error("Failed to update fee");
        }
    };

    const handleUpdateDepositedCancel = () => {
        setUpdateFee(null);
    };

    // Download Excel
    const handleExportExcel = async () => {
        setExporting(true);
        try {
            const blob = await exportFees();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "fees.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Exported fee data!");
        } catch (err) {
            console.error("Failed to export fee data:", err);
            toast.error("Failed to export fee data");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 w-full p-0">
            <Navbar />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-2xl font-bold mb-8">Fee Management</h1>
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <button
                        className="bg-blue-600 text-white px-6 py-4 rounded font-semibold shadow hover:bg-blue-700 transition w-full md:w-1/2 text-lg"
                        onClick={handleShowNewStudents}
                        disabled={loading}
                    >
                        {loading && view === "new" ? "Loading..." : "New Students - Create Fee"}
                    </button>
                    <button
                        className="bg-green-600 text-white px-6 py-4 rounded font-semibold shadow hover:bg-green-700 transition w-full md:w-1/2 text-lg"
                        onClick={handleShowExistingFees}
                        disabled={loading}
                    >
                        {loading && view === "existing" ? "Loading..." : "Update or Get All Existing Students Fee"}
                    </button>
                </div>

                {view === "existing" && (
                    <div className="flex justify-end mb-4">
                        <button
                            className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold hover:bg-indigo-700 transition"
                            onClick={handleExportExcel}
                            disabled={exporting}
                        >
                            {exporting ? "Exporting..." : "Download Excel"}
                        </button>
                    </div>
                )}

                {view === "new" && (
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">New Students (No Fee Records)</h2>
                        {selectedStudent ? (
                            <FeeForm
                                student={selectedStudent}
                                onSuccess={handleFeeFormSuccess}
                                onCancel={handleFeeFormCancel}
                            />
                        ) : (
                            <NewFee students={newStudents} onCreateFee={handleCreateFee} />
                        )}
                    </div>
                )}

                {view === "existing" && (
                    <div className="bg-white rounded shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Existing Students Fee Records</h2>
                        {updateFee ? (
                            <form onSubmit={handleUpdateDepositedSubmit} className="mb-6">
                                <div className="mb-2">
                                    <strong>Student:</strong> {updateFee.student?.name}
                                </div>
                                <div className="mb-2">
                                    <strong>Current Deposited:</strong> ₹{updateFee.deposited}
                                </div>
                                <div className="mb-2">
                                    <label className="block mb-1 font-medium">Add New Installment</label>
                                    <input
                                        name="newInstallment"
                                        type="number"
                                        min={1}
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
                                    >
                                        Add Installment
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition"
                                        onClick={handleUpdateDepositedCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        ) : null}
                        <FeeTable
                            fees={fees}
                            onAction={(fee) => (
                                <>
                                    <button
                                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                                        onClick={() => handleUpdateDeposited(fee)}
                                    >
                                        Add Installment
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                                        onClick={() => navigate(`/fee/${fee._id}`)}
                                    >
                                        View Fee
                                    </button>
                                </>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fees;