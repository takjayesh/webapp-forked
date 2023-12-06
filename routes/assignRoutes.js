const express = require("express");
const { createAssign, getAssign, getAssignmentsById, deleteAssignmentById, updateAssignment, submitAssignment} = require('../controllers/assignController');
const { authorization } = require("../middleware/authorization");

const router = express.Router();

router.post("/v2/assignments", createAssign);

router.get("/v2/assignments", getAssign);

router.get("/v2/assignments/:id", getAssignmentsById);

router.delete("/v2/assignments/:id", deleteAssignmentById);

router.put("/v2/assignments/:id", updateAssignment);

router.post("/v2/assignments/:id/submission", submitAssignment);

module.exports = router;
