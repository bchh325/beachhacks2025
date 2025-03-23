const assignmentService = require('../services/assignmentsService');

exports.getAssignmentByUser = async (req, res) => {
    try {
        console.log(req.query)
        const users = await assignmentService.getAllAssignmentsByUser(req.query.user_id)
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAssignmentByCourse = async (req, res) => {
    try {
        const users = await assignmentService.getAllAssignmentsByCourse("someUserId + courseId")
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAssignment = async (req, res) => {
    try {
        console.log(req.body)
        const user = await assignmentService.addAssignment(req.body)
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addEvent = async (req, res) => {
    try {
        console.log(req.body)
        const user = await assignmentService.addEvent(req.body)
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}