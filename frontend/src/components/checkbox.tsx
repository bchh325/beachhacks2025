"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditModal from "@/components/EditModal";
import { deleteAssignment } from "@/app/api/assignmentApi";
import { startSession } from "@/app/api/sessionApi";
import { checkSessionExists } from "@/app/api/sessionApi";

const AssignmentCheckbox = ({
  id,
  title,
  duedate,
  rawdate,
  course,
  course_id,
  status,
  toggleStatus,
  refreshAssignments,
}) => {
  const [isChecked, setIsChecked] = useState(status === "Completed");
  const [editModal, setEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(null);

  useEffect(() => {
    const check = async () => {
      try {
        const session = await checkSessionExists(id, 55141);
        setSessionStarted(session);
      } catch (err) {
        console.error("Error checking session:", err);
      }
    };
    check();
  }, []);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    toggleStatus(id);
  };

  const handleEditModal = () => {
    setEditingAssignment({
      id,
      title,
      course,
      rawDueDate: rawdate,
      course_id,
    });
    setEditModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteAssignment(id); // or assignment.id
      console.log("✅ Assignment deleted");
      if (refreshAssignments) await refreshAssignments(); // optional
    } catch (error) {
      console.error("❌ Error deleting assignment:", error);
    }
  };

  const handleStart = async () => {
    try {
      const userId = 55141; // or get from auth context
      const session = await startSession(id, userId);
      setSessionStarted(session);
      if (refreshAssignments) await refreshAssignments();
    } catch (err) {
      console.error("Failed to start session:", err);
    }
  };
  return (
    <div className="w-full flex items-center gap-4 p-6">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="w-5 h-5 accent-zinc-500"
      />
      <label htmlFor={id} className="w-full cursor-pointer">
        <div className="flex justify-between">
          <div>
            <h2
              className={`text-lg font-semibold ${
                status === "Completed" ? "line-through text-zinc-500" : "none"
              }`}
            >
              {title}
            </h2>
            <p className="text-sm text-gray-600">{course}</p>
          </div>
          <div className="text-right flex items-center">
            <div>
              <p className="text-sm font-medium">{duedate}</p>
              <p
                className={`text-sm font-semibold ${
                  status === "Completed" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status}
              </p>
            </div>
            {sessionStarted?.is_active != true && (
              <button
                onClick={handleStart}
                className="bg-zinc-600 hover:bg-zinc-500 text-white ml-4 px-4 py-2 rounded-lg text-sm cursor-pointer"
              >
                ▶ Start
              </button>
            )}

            <div className="px-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img src="/ellipsis.svg" className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleEditModal}>
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={handleDelete}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </label>
      <EditModal
        open={editModal}
        onClose={() => setEditModal(false)}
        assignment={editingAssignment}
        refreshAssignments={refreshAssignments}
      />
    </div>
  );
};

export default AssignmentCheckbox;
