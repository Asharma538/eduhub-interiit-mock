import Classroom from "../models/classroom.model.js";
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

export const getClassData= asyncHandler(async(req, res) => {});

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

export const postAnnouncement=asyncHandler(async(req,res)=>{
    try {
        // get the classroom id from the frontend
        const classroomId = req.params.classId;
        // Now get the classroom with the given id
        const classroom = await Classroom.findById(classroomId);

        if(!classroom){
            return res.status(404).json({message: "Class not found"});
        }
        
        // get the user id from the request
        const userId = req.user._id;

        // get the title and content of the announcement from the frontend
        const {title, content} = req.body;

        // create a new announcement object using the defined schema
        const announcement = new Announcement({
            title,
            content,
            user_id: userId,
            classroom_id: classroomId
        });
        await announcement.save();

        classroom.announcements.push(announcement);

        await classroom.save();
        
        //send the status
        res.status(200).json({message: "Your announcement has been posted successfully", announcement});

    }catch (error) {
        // Step 8: Handle any errors
        res.status(500).json({ message: 'Server error', error });
    }
});
export const postAssignment=asyncHandler(async(req,res)=>{});
