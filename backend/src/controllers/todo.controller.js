import { asyncHandler } from "../utils/asynchandler.js";
import ToDoList from "../models/todoList.model.js";
import Assignment from "../models/assignment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

export const getToDo = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Authenticated user ID

  // Fetch the user along with their enrolled classes and assignments
  const user = await User.findById(userId).populate({
    path: 'classes',
    populate: {
      path: 'assignments', // Populate assignments within each class
      model: 'Assignment'
    }
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.classes || user.classes.length === 0) {
    throw new ApiError(404, "No classes found for the user");
  }

  const currentDate = new Date();

  // Initialize arrays to categorize assignments
  let withDeadline = [];
  let withoutDeadline = [];

  // Iterate over the user's classes and assignments
  user.classes.forEach(classroom => {
    if (classroom.assignments && classroom.assignments.length > 0) {
      classroom.assignments.forEach(assignment => {
        if (assignment.deadline) {
          // Check if the assignment deadline is in the future
          if (new Date(assignment.deadline) > currentDate) {
            withDeadline.push({
              assignment_id: assignment._id,
              title: assignment.title,
              description: assignment.description,
              deadline: assignment.deadline,
              class_id: classroom._id,
              class_name: classroom.name
            });
          }
        } else {
          withoutDeadline.push({
            assignment_id: assignment._id,
            title: assignment.title,
            description: assignment.description,
            class_id: classroom._id,
            class_name: classroom.name
          });
        }
      });
    }
  });

  // If no assignments were found, throw an error
  if (withDeadline.length === 0 && withoutDeadline.length === 0) {
    throw new ApiError(404, "No assignments found for the user's classes");
  }

  // Return a structured response of categorized assignments
  const separatedToDos = {
    withDeadline,
    withoutDeadline
  };

  return res.status(200).json(new ApiResponse(200, separatedToDos, "To-Do list fetched successfully"));
});
