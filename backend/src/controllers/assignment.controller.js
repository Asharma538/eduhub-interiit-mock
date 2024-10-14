import { content } from "googleapis/build/src/apis/content/index.js";
import Assignment from "../models/assignment.model.js";
import Classroom from "../models/classroom.model.js";
import Submission from "../models/submission.model.js";
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
        user_id: userId,
        class_id:classId
    })

    const savedAssignment =  await newAssignment.save();

    const savedClassroom= classroom.assignments.push(savedAssignment._id)
    await classroom.save()

    res.status(200).json(new ApiResponse(200, savedAssignment._id,"Assignment posted successfully"))
});

export const getAssignment=asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const assignmentId = req.params.assignmentId
    const classId = req.params.classId

    // console.log(req.params,userId)

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
        throw new ApiError(403, "You are not a member of this class")
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
                select:"email display_name"
            }
        }
    ])

    if(!assignment)
    {
        throw new ApiError(404,"Assignment not found")
    }
    // console.log(assignment);

    const assignmentData = {
        id:assignment._id,
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
        throw new ApiError(403, "You are not a member of this class")
    }

    if(classroom.students.includes(userId))
    {
        throw new ApiError(403, "You are not allowed to delete the assignment")
    }


    const assignment = await Assignment.findById(assignmentId).populate("submissions").populate("comments")
    if(!assignment)
    {
        throw new ApiError(404,"Assignment not found")
    }

    assignment.submissions.map(async(submission)=>{
        await submission.deleteOne()
    })

    assignment.comments.map(async(comment)=>{
        await comment.deleteOne()
    })

    await Classroom.findByIdAndUpdate(classId, { $pull: { assignments: assignmentId } });

    await assignment.deleteOne()
    res.status(200).json(new ApiResponse(200, {},"Assignment deleted successfully"))

})

export const submitAssignment = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {assignmentId,classId} = req.params
    const { file_url } = req.body;
    
    // console.log(userId,req.params,file_url)
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
        throw new ApiError(404, "Assignment not found")
    }

    const classroom = await Classroom.findById(classId)

    if(classroom.teachers.includes(userId))
    {
        throw new ApiError(403, "You are not a student of this class")
    }

    const submission = new Submission({
        student_id: userId,
        assignment_id: assignmentId,
        file_url:file_url,
    });

    const savedSubmission = await submission.save();

    assignment.submissions.push(savedSubmission._id)
    await assignment.save()

    res.status(200).json(new ApiResponse(200, {}, "Assignment submitted successfully"))

});
