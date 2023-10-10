const express = require("express");
const { createAssign, getAssign, getAssignmentsById, deleteAssignmentById, updateAssignment } = require('../controllers/assignController');
const { authorization } = require("../middleware/authorization");

const router = express.Router();

router.post("/v1/assignments", createAssign);

router.get("/v1/assignments", getAssign);

router.get("/v1/assignments/:id", getAssignmentsById);

router.delete("/v1/assignments/:id", deleteAssignmentById);

router.put("/v1/assignments/:id", updateAssignment);

module.exports = router;