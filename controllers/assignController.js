const asyncHandler = require("express-async-handler");
const logger = require('../logger/logger');
const db = require("../models");
const publishToSNS = require('../models/notificationModel');
const Assignment = db.Assignment;
const Submission = db.UserSubmission;
const Op = db.Sequelize.Op;
const dotenv = require("dotenv").config();
const AWS = require('aws-sdk'); // AWS SDK for JavaScript


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
      logger.log('info', 'Assignment created successfully');
      res.status(201).send(assignObj);
  } catch (error) {
      logger.log('error', 'Error creating assignment');
      res.status(400).json(error.message);
  }
});


const getAssign = asyncHandler(async (req, res) => {
  logger.log('info', 'Get assignments request received');  
  const assignObjs =  Assignment.findAll({
      
  }).then(data => {
    logger.log('info', 'Assignments retrieved successfully');
    res.status(200).send(data);
  }).catch((error) => {
    logger.log('error', 'Error retrieving assignments');
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
      });   // Check this method
      if (assignments.length===0) {
          res.status(404).json({ message: 'No assignments found for this user.' });
          logger.log('info', 'Assignment not present with this ID');
          return;
      }
     // console.log(assignments);
      logger.log('info', 'Assignment retrieved successfully');
      res.status(200).json(assignments);
  } catch (error) {
      logger.log('error', 'Error retrieving assignment by ID');
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


const deleteAssignmentById = asyncHandler(async (req, res) => {
  logger.log('info', 'Delete assignment request received');
  const id = req.params.id;
  console.log("In the Delete API");
  Assignment.destroy({
    where: { id: id,
      userId : req.userId
    }
  })
    .then(num => {
      if (num == 1) {
        logger.log('info', 'Assignment deleted successfully');
        res.status(204).send({
          message: "Assignment was deleted successfully!"
        });
      } else {
        logger.log('error', 'Error deleting assignment');
        res.status(404).send({
          message: `Cannot delete Assignment with id=${id}. Maybe Assignment was not found!`
        });
      }
})

});

const updateAssignment = asyncHandler(async (req, res) => {
  logger.log('info', 'Update assignment request received');
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
          logger.log('info', 'Assignment updated successfully');
          res.status(204).send({
              message: "Assignment was updated successfully."
          });
      } else {
        logger.log('error', 'Error updating assignment');
          res.status(400).send({
              message: `Cannot update Assignment with id=${id}. Maybe Assignment was not found or req.body is empty!`
          });
      }
  })
  .catch(err => {
      logger.log('error', 'Error updating Assignment');
      res.status(500).send({
          message: "Error updating Assignment with id=" + id
      });
  });
});


const submitAssignment = asyncHandler(async (req, res) => {
    logger.log('info', 'Submit assignment request received');
    const { submission_url } = req.body;
    const assignmentId = req.params.id;
    const username = req.userName; // Adjust this line based on how you store the authenticated user's information

    // Validate the submission URL
    if (!submission_url) {
        return res.status(400).json({ msg: 'Invalid submission URL format. Please use the format "https://www.example.com"' });
    }
    if (!username) {
        return res.status(400).json({ msg: 'Username is required' });
    }

    try {
        const assignment = await Assignment.findOne({
            where: { id: assignmentId }
        });
        if (!assignment) {
            logger.log('error', 'Assignment not found');
            return res.status(404).json({ msg: 'Assignment not found' });
        }

        

        // Check if the due date for the assignment has passed
        if (new Date() > assignment.deadline) {
            return res.status(400).json({ msg: 'Assignment deadline has passed. Submission rejected.' });
        }

        // Check if user has exceeded retries
        const submissionCount = await Submission.count({
            where: { assignment_id: assignmentId, username: username }
        });

        if(assignment.num_of_attempts < submissionCount ){
            return res.status(400).json({ msg: 'Num_limits exceeded. Submission rejected.' });
        }

        console.log(submissionCount);
        console.log(assignment.num_of_attempts);

        // if (submissionCount >= 3) { // Assuming 3 is the retry limit
        //     return res.status(400).json({ msg: 'Retry limit exceeded. Submission rejected.' });
        // }

        const submission = await Submission.create({
            assignment_id: assignmentId,
            submission_url,
            username
        });

        const message = {
            url: submission_url,
            userEmail: username, // Adjust as per your context
            assignmentId: assignmentId,
            submissionCount: submissionCount
        };
       
        logger.log('info', 'Assignment submitted successfully');

        console.log(message);
        
        publishToSNS.publishToSNS(process.env.TOPIC_ARN, message, (err, data) => {
            if (err) {
                console.log(process.env.TOPIC_ARN+ "p1");
              // Handle error
                res.status(500).json({ error: 'Failed to send notification' });
            } else {
                console.log(process.env.TOPIC_ARN+ "p2");

                res.status(201).json(submission);
            }
          });

    } catch (error) {
        logger.log('error', 'Error submitting assignment');
        res.status(400).json({ message: error.message + "catchError submitting assignment" });
    }
});



function isValidDeadlineFormat(deadline) {
  const deadlineRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
  return deadlineRegex.test(deadline);
}



module.exports = {createAssign ,getAssign, getAssignmentsById ,deleteAssignmentById,updateAssignment, submitAssignment};
