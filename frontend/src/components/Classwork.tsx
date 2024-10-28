import { createEffect, createSignal } from "solid-js";
import { Button, IconButton } from "@suid/material";
import { useNavigate } from "@solidjs/router";
import { useAxiosContext } from "../lib/useAxiosContext";
import { useClassContext } from "../lib/useClassContext";
import toast from "solid-toast";
import DeleteIcon from "@suid/icons-material/Delete";

interface AssignmentDetails {
  _id: string;
  title: string;
  description: string;
  deadline: string;
  file_url: string;
  user_id: {
    email: string;
    display_name: string;
  };
}

const Classwork = () => {
  const [assignment, setAssignment] = createSignal<AssignmentDetails[]>([]);
  const axios = useAxiosContext();
  const classContext = useClassContext();
  const navigate = useNavigate();

  createEffect(() => {
    axios
      ?.get<{ assignments: AssignmentDetails[] }>(
        `classes/${classContext.classDetails().classId}/classwork`
      )
      .then((data) => {
        setAssignment(data.data.assignments);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Error fetching assignments"
        );
      });
  });

  const handleAssignmentClick = (assignmentId: string) => {
    if (classContext.classDetails().isTeacher) {
      navigate(`/submissions/${assignmentId}`);
    }
  };

  const handleDeleteAssignment = (assignmentId: string) => {
    axios
      ?.delete(
        `/classes/${
          classContext.classDetails().classId
        }/assignments/${assignmentId}`
      )
      .then(() => {
        toast.success("Assignment deleted successfully");
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error deleting assignment");
      });
  };

  const handleCreateAssignment = () => {
    navigate(`/createAssignment`);
  };

  return (
    <div class="p-6 bg-gray-100 min-h-screen">
      <div class="max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h1 class="text-2xl font-semibold text-gray-900">Classwork</h1>

          {/* Show create button for teachers */}
          {classContext.classDetails().isTeacher && (
            <Button variant="contained" onClick={handleCreateAssignment}>
              Create Assignment
            </Button>
          )}
        </div>
        <div class="p-4">
          {assignment().map((topic) => (
            <div class="mb-4">
              <div class="flex items-center justify-between mb-2">
                <h2
                  class={`text-xl font-bold text-gray-800 ${
                    classContext.classDetails().isTeacher
                      ? "cursor-pointer"
                      : ""
                  }`}
                  onClick={() => handleAssignmentClick(topic._id)}
                >
                  {topic.title}
                </h2>

                {/* Show delete button for teachers */}

                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    classContext.classDetails().isTeacher
                      ? handleDeleteAssignment(topic._id)
                      : navigate(`/submiteAssignment/${topic._id}`);
                  }}
                >
                  {classContext.classDetails().isTeacher ? (
                    <DeleteIcon />
                  ) : (
                    "Submit"
                  )}
                </IconButton>
              </div>
              <p class="text-gray-600 mb-2">{topic.description}</p>
              <p class="text-gray-600 mb-2">Deadline: {topic.deadline}</p>
              <p class="text-gray-600 mb-4">
                Posted by: {topic.user_id.display_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classwork;
