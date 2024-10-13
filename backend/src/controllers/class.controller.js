import Assignment from "../models/assignment.model.js";
import Announcement from "../models/anouncement.model.js";
import Classroom from "../models/classroom.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import  Assignment  from "../models/assignment.model.js";
import Announcement from "../models/anouncement.model.js";
// import Announcement from "../models/announcement.model.js";

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

export const getClassData= asyncHandler(async(req, res) => {
    const classId = req.params.classId;
    const userId = req.user._id;

    const classroom = await Classroom.findById(classId)
    .populate({
        path:"announcements",
        populate: [
            {
                path: "user_id",
                select: "email display_name"
            },
            {
                path:"comments",
                populate:{
                    path:"user_id",
                    select:"email display_name"
                },
                select:"content"
            }
        ]
    });

    if(!classroom)
    {
        throw new ApiError(404,"Classroom not found.");
    }

    const user= await User.findById(userId)
    if(!user)
    {
        throw new ApiError(404,"User not found");
    }

    if(!classroom.teachers.includes(userId) && !classroom.teachers.includes(userId))
    {
        throw new ApiError(403, "You are not a memeber of this class")
    }

    const classroomData={
        name: classroom.name,
        details:classroom.details,
    }

    const announcements= classroom.announcements.map(announcement =>({
        content :announcement.content,
        file_url: announcement.file_url,
        user_id: {
            display_name: announcement.user_id.display_name,
            email: announcement.user_id.email
        },
        comments: announcement.comments.map(comment => ({
            content : comment.content,
            user_id: {
                display_name: announcement.user_id.display_name,
                email: announcement.user_id.email
            }
        }))
    }));
    console.log(announcements)
    res.status(200).json(new ApiResponse(200,{classroom: classroomData, announcements},"Class data retrieved successfully"));
});

// Controller to get classwork of a specific classroom
export const getClassWork = asyncHandler(async(req,res)=>{
    try {
        // get the classroom id from the frontend
        const classroomId = req.params.classId;

        // Now get the classroom with the given id
        const classroom = await Classroom.findById(classroomId)
        

        if(!classroom){
            return res.status(404).json({message: "Class not found"});
        }

        // we need to fetch classwork associated with the classroom
        const classwork = await Classroom.findById(classroomId)
        .populate({
            path: "announcements",
            populate: [
                {
                    path: "user_id",
                    select: "email display_name"
                }
            ]
        })
        .populate({
            path: "assignments",
            populate: [
                {
                    path: "user_id",
                    select: "email display_name"
                }
            ]
        }).select("assignments announcements");

        //return response as classwork as json response
        res.status(200).json(classwork);
        

    } catch (error) {
        res.status(500).json({ message: 'Server error ', error });
    }
});

export const postAnnouncement=asyncHandler(async(req,res)=>{});

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

    if(!classroom.teachers.includes(userId) && !classroom.teachers.includes(userId))
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

    const savedClassroom= await classroom.assignments.push(savedAssignment._id)
    await classroom.save()

    res.status(200).json(200, {savedClassroom},"Announcemented posted successfully")
});
