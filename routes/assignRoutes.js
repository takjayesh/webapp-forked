const express = require("express");
const { createAssign, getAssign, getAssignmentsById, deleteAssignmentById, updateAssignment, submitAssignment} = require('../controllers/assignController');
const { authorization } = require("../middleware/authorization");

const router = express.Router();

router.post("/v1/assignments", createAssign);

router.get("/v1/assignments", getAssign);

router.get("/v1/assignments/:id", getAssignmentsById);

router.delete("/v1/assignments/:id", deleteAssignmentById);

router.put("/v1/assignments/:id", updateAssignment);

router.post("/v1/assignments/:id/submission", submitAssignment);

// Catch-all route for any other path
router.all("*", (req, res) => {
    res.status(404).json({
      error: "Path not found"
    });
  });

module.exports = router;
