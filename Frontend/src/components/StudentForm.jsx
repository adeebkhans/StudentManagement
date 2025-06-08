import React, { useState, useEffect } from "react";

const emptyForm = {
  name: "",
  fathername: "",
  mothername: "",
  studentMob: "",
  parentsMob: "",
  aadharcard: "",
  enrollment: "",
  course: "",
};

const StudentForm = ({ onSubmit, initialData, loading }) => {
  const [form, setForm] = useState(emptyForm);

  // Update form state when initialData changes (for editing or creating)
  useEffect(() => {
    setForm(
      initialData && Object.keys(initialData).length > 0
        ? {
            name: initialData.name || "",
            fathername: initialData.fathername || "",
            mothername: initialData.mothername || "",
            studentMob: initialData.studentMob || "",
            parentsMob: initialData.parentsMob || "",
            aadharcard: initialData.aadharcard || "",
            enrollment: initialData.enrollment || "",
            course: initialData.course || "",
          }
        : emptyForm
    );
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="fathername"
            placeholder="Father Name"
            value={form.fathername}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="mothername"
            placeholder="Mother Name"
            value={form.mothername}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="studentMob"
            placeholder="Student Mobile"
            value={form.studentMob}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="space-y-4">
          <input
            name="parentsMob"
            placeholder="Parents Mobile"
            value={form.parentsMob}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="aadharcard"
            placeholder="Aadhar Card Number"
            value={form.aadharcard}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="enrollment"
            placeholder="Enrollment (optional)"
            value={form.enrollment}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="course"
            placeholder="Course (optional)"
            value={form.course}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;