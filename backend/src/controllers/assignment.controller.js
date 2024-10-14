import { content } from "googleapis/build/src/apis/content/index.js";
import Assignment from "../models/assignment.model.js";
import Classroom from "../models/classroom.model.js";
import Submission from "../models/submission.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const postAssignment = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { title, description, file_url, deadline } = req.body;
    const classId = req.params.classId;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const classroom = await Classroom.findById(classId);
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    if (!classroom.teachers.includes(userId) && !classroom.students.includes(userId)) {
        throw new ApiError(403, "You are not a member of this class");
    }

    // Check if the deadline is provided and valid
    let assignmentDeadline = null; // Default to null if no deadline is provided

    if (deadline) {
        assignmentDeadline = new Date(deadline);
        const currentDate = new Date();

        if (isNaN(assignmentDeadline)) {
            throw new ApiError(400, "Invalid date format. Please provide a valid deadline.");
        }

        if (assignmentDeadline < currentDate) {
            throw new ApiError(400, "The deadline cannot be in the past. Please choose a valid future date.");
        }
    }

    const newAssignment = new Assignment({
        title,
        description,
        file_url,
        deadline: assignmentDeadline, // Set the deadline to null if not provided or invalid
        user_id: userId,
        class_id: classId
    });

    const savedAssignment = await newAssignment.save();

    classroom.assignments.push(savedAssignment._id);
    await classroom.save();

    res.status(200).json(new ApiResponse(200, savedAssignment._id, "Assignment posted successfully"));
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

    const isStudent = classroom.students.includes(userId);
    if (!isStudent) {
        throw new ApiError(403, "User is not a student in this classroom");
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

export const getSubmission = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user
    const assignmentId = req.params.assignmentId; // Assignment ID from request parameters
    const classId = req.params.classId; // Class ID from request parameters

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Validate assignment and class existence
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    // Check if the user is a member of the class (student or teacher)
    const isStudent = classroom.students.includes(userId);
    if (!isStudent) {
        throw new ApiError(403, "User is not a student in this classroom");
    }

    // Check if the user has made a submission
    const submission = await Submission.findOne({ assignment_id: assignmentId, student_id: userId });
    if (!submission) {
        throw new ApiError(404, "No submission found for this user");
    }

    // Return the user's submission
    res.status(200).json(new ApiResponse(200, submission, "Submission retrieved successfully"));
});


export const getSubmissions = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Authenticated user (teacher)
    const assignmentId = req.params.assignmentId; // Assignment ID from request parameters
    const classId = req.params.classId; // Class ID from request parameters

    // Validate user existence
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Validate classroom existence
    const classroom = await Classroom.findById(classId);
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    // Validate assignment existence
    const assignment = await Assignment.findById(assignmentId).populate('submissions');
    if (!assignment) {
        throw new ApiError(404, "Assignment not found");
    }

    // Check if the user is a teacher in the class
    const isTeacher = classroom.teachers.includes(userId);
    if (!isTeacher) {
        throw new ApiError(403, "Only teachers can view submissions for this assignment");
    }

    // Check if the assignment has submissions
    if (assignment.submissions.length === 0) {
        throw new ApiError(404, "No submissions found for this assignment");
    }

    // Fetch all submissions for the assignment and populate the user details
    const submissions = await Submission.find({
        _id: { $in: assignment.submissions }
    }).populate('student_id', 'display_name email');

    // Return all submissions
    res.status(200).json(new ApiResponse(200, submissions, "Submissions retrieved successfully"));
});
