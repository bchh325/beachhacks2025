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


const updateAssignment = async (id, updatedData) => { }

const deleteAssignment = async (id) => { }

module.exports = {
    getAllAssignmentsByUser,
    getAssignmentById,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    addEvent
}