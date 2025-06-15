const Result = require("../Schemas/ResultSchema");

/**
 * Create or update a student's result for a session and year.
 * - If result doc for student+session+year exists, update it.
 * - If not, create a new doc.
 * - If subject/practical exists, update marks; else add new.
 * - Handles partial updates (ct1/ct2/ other marks).
 */
async function CreateUpdateResult(req, res) {
    try {
        const { student, session, year, subjects = [], practicals = [] } = req.body;

        if (!student || !session || !year) {
            return res.status(400).json({ message: "student, session, and year are required." });
        }
        if (!["first", "second"].includes(year)) {
            return res.status(400).json({ message: "year must be 'first' or 'second'." });
        }

        // Find existing result for this student, session, and year
        let result = await Result.findOne({ student, session, year });

        if (!result) {
            // Create new result document
            result = new Result({
                student,
                session,
                year,
                subjects: [],
                practicals: []
            });
        }

        // --- Subjects ---
        if (Array.isArray(subjects)) {
            subjects.forEach(sub => {
                if (!sub.name) return; // skip if no subject name
                let existing = result.subjects.find(s => s.name === sub.name);
                if (existing) {
                    // Update ct1/ct2 if provided
                    if (sub.marks && sub.marks.ct1) {
                        existing.marks.ct1 = {
                            ...existing.marks.ct1,
                            ...sub.marks.ct1
                        };
                    }
                    if (sub.marks && sub.marks.ct2) {
                        existing.marks.ct2 = {
                            ...existing.marks.ct2,
                            ...sub.marks.ct2
                        };
                    }
                    // Update otherMarks if provided
                    if (sub.marks && sub.marks.otherMarks) {
                        existing.marks.otherMarks = {
                            ...existing.marks.otherMarks,
                            ...sub.marks.otherMarks
                        };
                    }
                } else {
                    // Add new subject
                    result.subjects.push({
                        name: sub.name,
                        marks: {
                            ct1: sub.marks?.ct1 || {},
                            ct2: sub.marks?.ct2 || {},
                            otherMarks: sub.marks?.otherMarks || {}
                        }
                    });
                }
            });
        }

        // --- Practicals ---
        if (Array.isArray(practicals)) {
            practicals.forEach(prac => {
                if (!prac.name) return;
                let existing = result.practicals.find(p => p.name === prac.name);
                if (existing) {
                    if (typeof prac.marks === "number") existing.marks = prac.marks;
                } else {
                    result.practicals.push({
                        name: prac.name,
                        marks: prac.marks
                    });
                }
            });
        }

        await result.save();
        return res.status(200).json({ message: "Result saved successfully", result });
    } catch (err) {
        console.error("CreateUpdateResult error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

/**
 * Get all results with populated student name and enrollment.
 * Supports query filters: session, year, enrollment, name
 */
async function getAllResults(req, res) {
    try {
        const { session, year, enrollment, name } = req.query;
        
        // Build the query object
        let query = {};
        
        // Direct filters on Result model
        if (session) {
            query.session = { $regex: session, $options: 'i' }; // Case-insensitive partial match
        }
        if (year) {
            query.year = year; // Exact match for year (first/second)
        }

        // For student-related filters, we'll use populate with match
        let populateOptions = {
            path: "student",
            select: "name enrollment"
        };

        // If we have student-related filters, add match condition
        if (enrollment || name) {
            populateOptions.match = {};
            if (enrollment) {
                populateOptions.match.enrollment = { $regex: enrollment, $options: 'i' };
            }
            if (name) {
                populateOptions.match.name = { $regex: name, $options: 'i' };
            }
        }

        let results = await Result.find(query).populate(populateOptions);
        
        // Filter out results where student didn't match the populate criteria
        if (enrollment || name) {
            results = results.filter(result => result.student !== null);
        }

        return res.status(200).json({ results });
    } catch (err) {
        console.error("getAllResults error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Get all results for a student (by student ObjectId)
async function getResultsByStudentId(req, res) {
    try {
        const { studentId } = req.params;
        const { year } = req.query;

        if (!studentId) {
            return res.status(400).json({ message: "studentId is required" });
        }

        const query = { student: studentId };
        if (year) {
            query.year = year;
        }

        const results = await Result.find(query);
        return res.status(200).json({ results });
    } catch (err) {
        console.error("GetResultsByStudentId error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

// Get a result by its document id
async function getResultById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Result id is required" });
        }
        const result = await Result.findById(id)
            .populate({
                path: "student",
                select: "name enrollment"
            })
            .lean(); 
        if (!result) {
            return res.status(404).json({ message: "Result not found" });
        }
        return res.status(200).json({ result });
    } catch (err) {
        console.error("GetResultById error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

/**
 * Delete a result by its document id
 */
async function deleteResultById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Result id is required" });
        }
        const deleted = await Result.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Result not found" });
        }
        return res.status(200).json({ message: "Result deleted successfully" });
    } catch (err) {
        console.error("DeleteResultById error:", err);
        return res.status(500).json({ message: "Internal server error", error: err.message });
    }
}

module.exports = {
    CreateUpdateResult,
    getResultsByStudentId,
    getResultById,
    getAllResults,
    deleteResultById,
};