import React, { useState } from "react";
import { createFee } from "../api/fees";
import { toast } from "react-toastify";

const feeOptions = [
  { code: "A", label: "A", amount: 180000 },
  { code: "B", label: "B", amount: 175000 },
  { code: "C", label: "C", amount: 170000 },
];

const FeeForm = ({ student, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    code: "",
    fee: "",
    deposited: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If fee code changes, auto-fill fee amount
    if (name === "code") {
      const selected = feeOptions.find((opt) => opt.code === value);
      setForm({
        ...form,
        code: value,
        fee: selected ? selected.amount : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFee({
        student: student._id,
        code: form.code,
        fee: Number(form.fee),
        deposited: Number(form.deposited),
      });
      toast.success("Fee record created!");
      setForm({ code: "", fee: "", deposited: "" });
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create fee record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded shadow p-6 max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Create Fee for {student.name}</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Fee Code</label>
        <select
          name="code"
          value={form.code}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        >
          <option value="">Select Fee Code</option>
          {feeOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {/* Total Fee is hidden from user */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Deposited</label>
        <input
          name="deposited"
          type="number"
          value={form.deposited}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
          min={0}
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-semibold hover:bg-gray-400 transition"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FeeForm;