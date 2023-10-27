const asyncHandler = require("express-async-handler");

const db = require("../models");
const Assignment = db.Assignment;
const Op = db.Sequelize.Op;

//@desc Register a user
//@route POST /api/users/register
//@access public
const createAssign = asyncHandler(async (req, res) => {
  const { name, points, num_of_attempts, deadline } = req.body;

  const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));

  if (extraFields.length > 0) {
      return res.status(400).json({ msg: `Extra fields not allowed: ${extraFields.join(', ')}` });
  } else if (!name || typeof name !== 'string') {
      return res.status(400).json({ msg: 'Name field required and need to be a String format' });
  } else if (!points || typeof points !== 'number' || points % 1 !== 0) {
      return res.status(400).json({ msg: 'Points field required and need to be in integer format' });
  } else if (!num_of_attempts || typeof num_of_attempts !== 'number' || num_of_attempts % 1 !== 0) {
      return res.status(400).json({ msg: 'Attempt field required and need to be in integer format' });
  } else if (!deadline || !isValidDeadlineFormat(deadline)) {
      return res.status(400).json({ msg: 'Invalid deadline format. Please use the format "2023-10-09T23:42:18.000Z"' });
  }

  try {
      const assignObj = await Assignment.create({
          name,
          points,
          num_of_attempts,
          deadline,
          UserId: req.userId
      });
      res.status(201).send(assignObj);
  } catch (error) {
      res.status(400).json(error.message);
  }
});


const getAssign = asyncHandler(async (req, res) => {
    const assignObjs =  Assignment.findAll({
      
  }).then(data => {
    res.status(200).send(data);
  }).catch((error) => {
    res.status(400).json(error.message);
  });
  
});

const getAssignmentsById = asyncHandler(async (req, res) => {
  try {
   console.log("I am in get call");
      const id = req.params.id; // Extract user ID from route parameter
      const assignments = await Assignment.findAll({
          where: {
              id : id  // Filter assignments by user ID
          }
      });
      if (!assignments) {
          res.status(404).json({ message: 'No assignments found for this user.' });
          return;
      }
      console.log(assignments);
      res.status(200).json(assignments);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


const deleteAssignmentById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log("In the Delete API");
  Assignment.destroy({
    where: { id: id,
      userId : req.userId
    }
  })
    .then(num => {
      if (num == 1) {
        res.status(204).send({
          message: "Assignment was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
        });
      }
})

});

const updateAssignment = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, points, num_of_attempts, deadline } = req.body;

  const allowedFields = ['name', 'points', 'num_of_attempts', 'deadline'];
  const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));

  if (extraFields.length > 0) {
      return res.status(400).json({ msg: `Extra fields not allowed: ${extraFields.join(', ')}` });
  } else if (name && (typeof name !== 'string')) {
      return res.status(400).json({ msg: 'Name field needs to be in String format' });
  } else if (points && (typeof points !== 'number' || points % 1 !== 0)) {
      return res.status(400).json({ msg: 'Points field needs to be in integer format' });
  } else if (num_of_attempts && (typeof num_of_attempts !== 'number' || num_of_attempts % 1 !== 0)) {
      return res.status(400).json({ msg: 'Attempt field needs to be in integer format' });
  } else if (deadline && !isValidDeadlineFormat(deadline)) {
      return res.status(400).json({ msg: 'Invalid deadline format. Please use the format "2023-10-09T23:42:18.000Z"' });
  }

  Assignment.update(req.body, {
      where: { 
          id: id,
          userId: req.userId
      }
  })
  .then(num => {
      if (num == 1) {
          res.status(204).send({
              message: "Assignment was updated successfully."
          });
      } else {
          res.status(400).send({
              message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
          });
      }
  })
  .catch(err => {
      res.status(500).send({
          message: "Error updating Assignment with id=" + id
      });
  });
});


function isValidDeadlineFormat(deadline) {
  const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return deadlineRegex.test(deadline);
}



module.exports = {createAssign ,getAssign, getAssignmentsById ,deleteAssignmentById,updateAssignment};
