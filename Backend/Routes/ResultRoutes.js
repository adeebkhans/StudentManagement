const express = require("express");
const router = express.Router();
const { CreateUpdateResult, getResultsByStudentId, getResultById, getAllResults, deleteResultById, exportResults } = require("../Controllers/ResultController");
const AuthMiddleware = require('../Middlewares/Auth');

// Create or update result
router.post("/", AuthMiddleware, CreateUpdateResult);

// Get all result
router.get("/", AuthMiddleware, getAllResults);

// Get results by student ID
router.get("/student/:studentId", AuthMiddleware, getResultsByStudentId);

// Export results
router.get("/export", AuthMiddleware, exportResults);

// Get result by ID
router.get("/:id", AuthMiddleware, getResultById);

router.delete("/:id", AuthMiddleware, deleteResultById );


module.exports = router;