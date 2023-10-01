const asyncHandler = require("express-async-handler");

const db = require("../models");
const Assignment = db.Assignment;
const Op = db.Sequelize.Op;

//@desc Register a user
//@route POST /api/users/register
//@access public
const createAssign = asyncHandler(async (req, res) => {
  const { name, points, num_of_attempts,deadline } = req.body;
   console.log(req.body);
    const assignObj =  Assignment.create({
      name,
      points,
      num_of_attempts,
      deadline,
      UserId : req.userId
  }).then(data => {
    res.status(201).send(data);
  }).catch((error) => {
    res.status(400).json(error.message);
  });
  
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
   // console.log("getbyId");
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
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      }
})

});

const updateAssignment = asyncHandler(async (req, res) => {
  const id = req.params.id;
   console.log(req.body);
   Assignment.update(req.body, {
    where: { id: id,
             userId : req.userId
     }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Assignment was updated successfully."
        });
      } else {
        res.status(400).send({
          message: `Cannot update Assignment with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Assignment with id=" + id
      });
    });
  
});



module.exports = {createAssign ,getAssign, getAssignmentsById ,deleteAssignmentById,updateAssignment};
