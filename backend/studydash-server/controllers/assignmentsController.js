const assignmentService = require("../services/assignmentsService");
const taskUtils = require("../routes/taskUtils");

exports.getAssignmentByUser = async (req, res) => {
  try {
    const users = await assignmentService.getAllAssignmentsByUser(
      req.query.user_id
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssignmentByCourse = async (req, res) => {
  try {
    const users = await assignmentService.getAllAssignmentsByCourse(
      "someUserId + courseId"
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAssignment = async (req, res) => {
  try {
    console.log(req.body);
    const user = await assignmentService.addAssignment(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcomingAssignments = async (req, res) => {
  try {
    console.log("enter controller");
    console.log(req.query);
    const userId = req.query.user_id; // Assuming you have auth middleware
    const assignments = await assignmentService.getUpcomingAssignments(userId);
    res.json(assignments);
  } catch (error) {
    console.error("Error in getUpcomingAssignments:", error);
    res.status(500).json({ error: "Failed to fetch upcoming assignments" });
  }
};

exports.getCourseGrade = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.id;
    const grade = await AssignmentsService.getCourseGrade(courseId, userId);
    res.json(grade);
  } catch (error) {
    console.error("Error in getCourseGrade:", error);
    res.status(500).json({ error: "Failed to fetch course grade" });
  }
};

exports.getTodayEvents = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const events = await assignmentService.getTodayEvents(userId);
    res.json(events);
  } catch (error) {
    console.error("Error in getTodayEvents:", error);
    res.status(500).json({ error: "Failed to fetch today's events" });
  }
};

exports.getDailyAgenda = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const date = req.query.date;

    if (!userId || !date) {
      return res.status(400).json({
        error: "User ID and date are required",
      });
    }

    console.log("Generating daily agenda for:", { userId, date });
    const agenda = await taskUtils.getDailyAgenda(userId, new Date(date));
    res.json(agenda);
  } catch (error) {
    console.error("Error in getDailyAgenda:", error);
    res.status(500).json({
      error: "Failed to generate daily agenda",
    });
  }
};

exports.getEventsByDate = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const date = req.query.date; // Expected format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ error: "Date parameter is required" });
    }

    const events = await assignmentService.getEventsByDate(userId, date);
    res.json(events);
  } catch (error) {
    console.error("Error in getEventsByDate:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};
