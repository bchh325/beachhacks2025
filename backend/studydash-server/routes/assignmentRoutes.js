const express = require('express');
const UserController = require('../controllers/assignmentsController');
const router = express.Router();

router.post('/event/add', UserController.addEvent)
router.get('/', UserController.getAssignmentByUser);
router.post('/', UserController.createAssignment);

module.exports = router;