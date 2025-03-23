const getDbInstance = require('../config/supabaseConfig')

const getAllAssignmentsByUser = async (userId) => {
    const supabase = await getDbInstance()
    const { data, error } = await supabase
        .from("assignments") 
        .select("*") 
        .eq("user_id", userId)

    console.log(data)
}

const getAllAssignmentsByCourse = async () => {
    const supabase = await getDbInstance()
    const { data, error } = await supabase
        .from("assignments") 
        .select("*") 
        .eq("user_id", userId)
}

const getAssignmentById = async (id) => { }

const addAssignment = async (assignment) => {
    const supabase = await getDbInstance()
    console.log("adding assignment")
    const { data, error } = await supabase.from("assignments").insert({
        created_at: assignment.created_at,
        course_id: assignment.course_id,
        title: assignment.title,
        status: assignment.status,
        user_id: assignment.user_id,
        due_date: assignment.due_date
    })

    console.log(error)
    console.log(data)
}

const addEvent = async (event) => {
    const supabase = await getDbInstance()
    console.log("adding event")
    const { data, error } = await supabase.from("events").insert({
        title: event.title,
        user_id: event.user_id,
        start: event.start,
        end: event.end
    })

    console.log(error)
    console.log(data)
}

const deleteEvent = async (eventId) => {
    const supabase = await getDbInstance();  // Get Supabase instance
    console.log("Deleting event with ID:", eventId);

    const { data, error } = await supabase
        .from("events")  // Replace "events" with your actual table name
        .delete()
        .eq("id", eventId);  // Filter where "id" matches the provided eventId

    if (error) {
        console.error("Error deleting event:", error);
        return null;
    }

    console.log("Event deleted successfully:", data);
    return data;
};


const updateAssignment = async (id, updatedData) => { }

const deleteAssignment = async (id) => { }

module.exports = {
    getAllAssignmentsByUser,
    getAssignmentById,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addEvent,
    deleteEvent
}