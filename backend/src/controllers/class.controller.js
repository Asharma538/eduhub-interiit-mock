
import Classroom from "../models/classroom.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import  Assignment  from "../models/assignment.model.js";
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

export const postAnnouncement=asyncHandler(async(req,res)=>{});



