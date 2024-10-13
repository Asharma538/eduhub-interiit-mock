import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Announcement from "../models/anouncement.model.js";
// import Announcement from "../models/announcement.model.js";

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

export const postAnnouncement=asyncHandler(async(req,res)=>{
    try {
        const {content,file_url} = req.body; //extract the text from the request body 
        
        const classroomId = req.params.classId; // get the class id from the request param url
        const userId = req.user._id;
        console.log(userId);
        
        // check if the class exists
        const classroom = await Classroom.findById(classroomId);
        if(!classroom){
            return res.status(404).json({message: "class not found"});
        }

        // create a new announcement instance
        const newAnnouncement = new Announcement({
            file_url:file_url,
            content: content,
            user_id: userId
        });

        console.log(newAnnouncement);

        await newAnnouncement.save();
        
        classroom.announcements.push(newAnnouncement._id);

        await classroom.save(); // Save the updated classroom document

        console.log(classroom);
        res.status(201).json({ message: 'Announcement posted successfully'});

    } catch (error) {
        res.status(500).json({ message: 'Server error aa rahi', error });
    }
});

export const deleteClass=asyncHandler(async(req,res)=>{
    const userId = req.user._id
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

    if(!classroom.teachers.includes(userId))
    {
        throw new ApiError(403, "You are not a teacher of this class")
    }

    await classroom.delete()
    res.status(200).json(new ApiResponse(200,{},"Class deleted successfully"));
});

export const deleteAnnouncement=asyncHandler(async(req,res)=>{
    const userId = req.user._id
    const classId = req.params.classId
    const announcementId = req.params.announcementId

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

    if(!classroom.teachers.includes(userId))
    {
        throw new ApiError(403, "You are not a teacher of this class")
    }

    const announcement = await Announcement.findById(announcementId)
    if(!announcement)
    {
        throw new ApiError(404,"Announcement not found")
    }

    await announcement.delete()
    res.status(200).json(new ApiResponse(200,{},"Announcement deleted successfully"));
});





