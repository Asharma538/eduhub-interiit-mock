import Assignment from "../models/assignment.model.js";
import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const postAssignment=asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const {title, description, file_url ,deadline}=req.body;
    const classId = req.params.classId

    const user = await User.findById(userId)
    if(!user)
    {
        throw new ApiError(404,"User not found")
    }

    const classroom = await Classroom.findById(classId)
    if(!classroom)
    {
        throw new ApiError(404,"Classroom not found")
    }

    if(!classroom.teachers.includes(userId) && !classroom.students.includes(userId))
    {
        throw new ApiError(403, "You are not a memeber of this class")
    }

    const newAssignment = new Assignment({
        title,
        description,
        file_url,
        deadline,
        user_id: userId
    })

    const savedAssignment =  await newAssignment.save();

    const savedClassroom= classroom.assignments.push(savedAssignment._id)
    await classroom.save()

    res.status(200).json(new ApiResponse(200, {savedClassroom},"Assignment posted successfully"))
});

export const getAssignment=asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const assignmentId = req.params.assignmentId
    const classId = req.params.classId

    console.log(req.params)

    const user = await User.findById(userId)
    if(!user)
    {
        throw new ApiError(404,"User not found")
    }

    const classroom = await Classroom.findById(classId)
    if(!classroom)
    {
        throw new ApiError(404,"Classroom not found")
    }

    if(!classroom.teachers.includes(userId) && !classroom.students.includes(userId))
    {
        throw new ApiError(403, "You are not a memeber of this class")
    }

    const assignment = await Assignment.findById(assignmentId)
    .populate([
        {
            path:"user_id",
            select:"email display_name"
        },
        {
            path:"comments",
            select:"content",
            populate:{
                path:"user_id",
                select:"email, display_name"
            }
        }
    ])

    if(!assignment)
    {
        throw new ApiError(404,"Assignment not found")
    }
    console.log(assignment);

    const assignmentData = {
        title: assignment.title,
        description: assignment.description,
        deadline: assignment.deadline,
        file_url: assignment.file_url,
        created_date: assignment.createdAt,  // Assuming this is the creation date
        created_by: assignment.user_id.display_name,  // Accessing user display name from the populated field
        comments: assignment.comments.map(comment => ({
            content: comment.content,
            user_id: {
                display_name: comment.user_id.display_name,  // Correct reference to comment's user
                email: comment.user_id.email  // Correct reference to comment's user email
            }
        }))
    };
    

    res.status(200).json(new ApiResponse(200,{assignmentData},"assignment retrieved successfully"));


})

export const deleteAssignment=asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const assignmentId = req.params.assignmentId
    const classId = req.params.classId

    const user = await User.findById(userId)
    if(!user)
    {
        throw new ApiError(404,"User not found")
    }

    const classroom = await Classroom.findById(classId)
    if(!classroom)
    {
        throw new ApiError(404,"Classroom not found")
    }

    if(!classroom.teachers.includes(userId) && !classroom.students.includes(userId))
    {
        throw new ApiError(403, "You are not a memeber of this class")
    }

    if(classroom.students.includes(userId))
    {
        throw new ApiError(403, "You are not allowed to delete the assignment")
    }

    const assignment = await Assignment.findById (assignmentId)
    if(!assignment)
    {
        throw new ApiError(404,"Assignment not found")
    }

    const submissions = await Assignment.findById(assignmentId).populate("submission")
    if(!submissions)
    {
        throw new ApiError(404,"Submissions not found")
    }
    submissions.map(async(submission)=>{
        await submission.deleteOne()
    })

    const comments = await Assignment.findById(assignmentId).populate("comments")
    if(!comments)
    {
        throw new ApiError(404,"No comments")
    }

    comments.map(async(comment)=>{
        await comment.deleteOne()
    })

    await assignment.deleteOne()
    res.status(200).json(new ApiResponse(200, {},"Assignment deleted successfully"))

})