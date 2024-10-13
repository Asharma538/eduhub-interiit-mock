import { asyncHandler } from "../utils/asynchandler.js";
import ToDoList from "../models/todoList.model.js";
import Assignment from "../models/assignment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getToDo = asyncHandler(async(req,res)=>{
    try {
        const userId  = req.user._id;
        const toDoLists=await Assignment.find({user_id:userId});
        if(!toDoLists) throw new ApiError(404,"no assignment found");
        const separatedToDos = toDoLists.map(ele => {
          const withDeadline = [];
          const withoutDeadline = [];
          ele.assignments.forEach(assignment => {
            if (assignment.deadline) {
              withDeadline.push(assignment);
            } else {
              withoutDeadline.push(assignment);
            }
          });
    
          return {
            id: ele.id,
            withDeadline,
            withoutDeadline,
          };
        });
        return res.status(200).json(new ApiResponse(200, separatedToDos,"fetched todo successfully"));
      } catch (error) {
        throw  new ApiError(500,`error in getting todos ${error.message}`);
      }
});