import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Assignment from "../models/assignment.model.js";

export const getProfile=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    console.log(userId);
    const userData = await User.findById(userId);
    if (!userData) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(
        new ApiResponse(200, userData, "User data fetched successfully")   
    );
});   


export const joinClassroom = asyncHandler(async(req, res) => {
    const {code} =req.body;
    const userId=req.user._id;

    const classroom = await Classroom.findOne({invitation_code: code});

    if(!classroom)
    {
        throw new ApiError(404, "Classromm not found");
    }

    const member = await User.findById(userId);
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    if(classroom.students.includes(userId) || classroom.teachers.includes(userId))
    {
        throw new ApiError(400,"You are already a member of this classroom");
    }

    classroom.students.push(userId);
    await classroom.save();

    await User.findByIdAndUpdate(userId,{$addToSet: {classes: classroom._id}});

    res.status(200).json(new ApiResponse(200, {}, "Successfully joined the classroom"));
});

export const createClassroom = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, invitation_code, details } = req.body;

        // Check if all required fields are provided
        if (!name || !invitation_code || !details) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, invitation_code, details) are required."
            });
        }

        // Fetch the user from the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // // Check if the user is already a teacher in another classroom
        // const existingClassroom = await Classroom.findOne({ teachers: userId });
        // if (existingClassroom) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "User is already a teacher in another classroom."
        //     });
        // }

        // Create a new classroom instance
        const newClassroom = new Classroom({
            name,
            invitation_code,
            details,
            teachers: [userId],
        });

        // Save the classroom to the database
        const savedClassroom = await newClassroom.save();

        // Add the classroom to the user's list of classes
        user.classes.push(savedClassroom._id);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Classroom created successfully.",
            classroom: savedClassroom
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});

export const getClasses = asyncHandler(async(req, res) => {
    const userId  = req.user._id;

    const user = await User.findById(userId).populate('classes');

    if(!user)
    {
        throw new ApiError(404,"User not Found");
    }

    const classesData = user.classes.map(classroom=>({
        id:classroom.id,
        name:classroom.name,
        details:classroom.details,
        //any more data needed
    }));

    res.status(200).json(new ApiResponse(200,classesData))
});

export const submitAssignment = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { assignmentId, submission } = req.body;

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const assignment = await Assignment.findById(assignmentId)
    if (!assignment) {
        throw new ApiError(404, "Assignment not found")
    }

    if(Classroom.teachers.includes(userId))
    {
        throw new ApiError(403, "You are not a student of this class")
    }

    const submissionData = {
        user_id: userId,
        assignment_id: assignmentId,
        submission
    }

    assignment.submissions.push(submissionData)
    await assignment.save()

    res.status(200).json(new ApiResponse(200, {}, "Assignment submitted successfully"))

});

