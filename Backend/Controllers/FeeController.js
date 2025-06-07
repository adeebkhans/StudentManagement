const Fee = require('../Schemas/FeeSchema');
const StudentSchema = require('../Schemas/StudentSchema');

// Create a new fee record
exports.createFee = async (req, res) => {
    try {
        const { student, code, fee, deposited } = req.body;

        if (!student || !code || fee == null || deposited == null) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                data: null
            });
        }

        // Calculate remaining internally
        const remaining = fee - deposited;

        const newFee = new Fee({ student, code, fee, deposited, remaining });
        await newFee.save();

        res.status(201).json({
            success: true,
            message: "Fee record created successfully",
            data: newFee
        });
    } catch (err) {
        console.error("Create fee error:", err);
        res.status(400).json({
            success: false,
            message: err.message || "Failed to create fee record",
            data: null
        });
    }
};

// Get all fee records
exports.getAllFees = async (req, res) => {
    try {
        const fees = await Fee.find().populate('student');
        res.status(200).json({
            success: true,
            message: "Fee records fetched successfully",
            data: fees
        });
    } catch (err) {
        console.error("Get all fees error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch fee records",
            data: null
        });
    }
};

// Get a fee record by ID
exports.getFeeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid fee ID format",
                data: null
            });
        }
        const fee = await Fee.findById(id).populate('student');
        if (!fee) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Fee record fetched successfully",
            data: fee
        });
    } catch (err) {
        console.error("Get fee by ID error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch fee record",
            data: null
        });
    }
};

exports.getFeesByStudentId = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID format",
                data: null
            });
        }
        const fees = await Fee.find({ student: studentId }).populate('student');
        res.status(200).json({
            success: true,
            message: "Fee records fetched successfully for student",
            data: fees
        });
    } catch (err) {
        console.error("Get fees by student ID error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch fee records for student",
            data: null
        });
    }
};

exports.getNewStudentsWithNoFeeRecords = async (req, res) => {
    try {
        // Fetch all students
        const students = await StudentSchema.find();

        // Fetch all fee records
        const fees = await Fee.find().select('student').lean();

        // Extract student IDs from fee records
        const feeStudentIds = new Set(fees.map(fee => fee.student.toString()));

        // Filter students who do not have any fee records
        const newStudentsWithNoFees = students.filter(student => !feeStudentIds.has(student._id.toString()));

        res.status(200).json({
            success: true,
            message: "New students with no fee records fetched successfully",
            data: newStudentsWithNoFees
        });
    } catch (err) {
        console.error("Get new students with no fee records error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch new students with no fee records",
            data: null
        });
    }
}

// Update a fee record by ID
exports.updateFee = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid fee ID format",
                data: null
            });
        }

        // Fetch the existing record
        const existingFee = await Fee.findById(id);
        if (!existingFee) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found",
                data: null
            });
        }

        // Only allow updating deposited by adding newDeposit
        const { newDeposit } = req.body;

        // Add newDeposit to previous deposited value
        let updatedDeposited = existingFee.deposited;
        if (typeof newDeposit === "number" && !isNaN(newDeposit)) {
            updatedDeposited += newDeposit;
        }

        // Calculate remaining internally
        const remaining = existingFee.fee - updatedDeposited;

        existingFee.deposited = updatedDeposited;
        existingFee.remaining = remaining;

        await existingFee.save();

        res.status(200).json({
            success: true,
            message: "Fee record updated successfully",
            data: existingFee
        });
    } catch (err) {
        console.error("Update fee error:", err);
        res.status(400).json({
            success: false,
            message: err.message || "Failed to update fee record",
            data: null
        });
    }
};

// Delete a fee record by ID
exports.deleteFee = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "Invalid fee ID format",
                data: null
            });
        }
        const fee = await Fee.findByIdAndDelete(id);
        if (!fee) {
            return res.status(404).json({
                success: false,
                message: "Fee record not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Fee record deleted successfully",
            data: null
        });
    } catch (err) {
        console.error("Delete fee error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to delete fee record",
            data: null
        });
    }
};