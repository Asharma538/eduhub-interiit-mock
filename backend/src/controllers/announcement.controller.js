import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Announcement from "../models/anouncement.model.js";


export const postAnnouncement=asyncHandler(async(req,res)=>{
    try {
        const {content,file_url} = req.body; //extract the text from the request body 
        
        const classroomId = req.params.classId; // get the class id from the request param url
        const userId = req.user._id;
        
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

        // console.log(newAnnouncement);

        await newAnnouncement.save();
        
        classroom.announcements.push(newAnnouncement._id);

        await classroom.save(); // Save the updated classroom document

        console.log(classroom);
        res.status(201).json({ message: 'Announcement posted successfully'});

    } catch (error) {
        res.status(500).json({ message: 'Server error aa rahi', error });
    }
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

    const announcement = await Announcement.findById(announcementId).populate("comments")
    if(!announcement)
    {
        throw new ApiError(404,"Announcement not found")
    }

    announcement.comments.map(async(comment)=>{
        await comment.deleteOne()
    })

    await Classroom.findByIdAndUpdate(classId, { $pull: { announcements: announcementId } });

    await announcement.deleteOne()
    res.status(200).json(new ApiResponse(200,{},"Announcement deleted successfully"));
});
