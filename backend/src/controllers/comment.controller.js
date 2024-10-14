
import Classroom from "../models/classroom.model.js";
import Comment from "../models/comment.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import  Assignment  from "../models/assignment.model.js";
import Announcement from "../models/anouncement.model.js";
// import Announcement from "../models/announcement.model.js";

export const postCommentInAnnouncement= asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {content}=req.body;
    const {classId,announcementId} = req.params

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

    const announcement = await Announcement.findById(announcementId)
    if(!announcement)
    {
        throw new ApiError(404,"Announcement not found")
    }

    if(!classroom.announcements.includes(announcementId))
    {
        throw new ApiError(404,"Announcement not present in this class")
    }

    const newComment = new Comment({
        content:content,
        user_id: userId
    })

    const savedComment =  await newComment.save();
    

    await announcement.comments.push(savedComment._id)
    await announcement.save()

    res.status(200).json(new ApiResponse(200, {announcement},"Comment in Announcement posted successfully"))
});


export const postCommentInAssignment= asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {content}=req.body;
    const {classId,assignmentId} = req.params

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

    const assignment = await Assignment.findById(assignmentId)
    if(!assignment)
    {
        throw new ApiError(404,"Assignment not found")
    }

    if(!classroom.assignments.includes(assignmentId))
    {
        throw new ApiError(404,"Assignment not present in this class")
    }

    const newComment = new Comment({
        content:content,
        user_id: userId
    })

    const savedComment =  await newComment.save();
    

    await assignment.comments.push(savedComment._id)
    await assignment.save()

    res.status(400).json(new ApiResponse(200, {assignment},"Comment in Assignment posted successfully"))
});

export const deleteCommentInAnnouncement= asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {classId,announcementId,commentId} = req.params

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
        throw new ApiError(403, "You are not allowed to delete comment")
    }

    const announcement = await Announcement.findById(announcementId)
    if(!announcement)
    {
        throw new ApiError(404,"Announcement not found")
    }

    if(!classroom.announcements.includes(announcementId))
    {
        throw new ApiError(404,"Announcement not present in this class")
    }

    const comment = await Comment.findById(commentId)
    if(!comment)
    {
        throw new ApiError(404,"Comment not found")
    }

    if(!announcement.comments.includes(commentId))
    {
        throw new ApiError(404,"Comment not present in this announcement")
    }

    await announcement.comments.pull(commentId)
    await announcement.save()
    await comment.deleteOne()

    res.status(200).json(new ApiResponse(200, {announcement},"Comment in Announcement deleted successfully"))

});

export const deleteCommentInAssignment= asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const {classId,assignmentId,commentId} = req.params

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
        throw new ApiError(403, "You are not allowed to delete comment")
    }

    const assignment = await Assignment.findById(assignmentId)
    if(!assignment)
    {
        throw new ApiError(404,"Assignment not found")
    }

    if(!classroom.assignments.includes(assignmentId))
    {
        throw new ApiError(404,"Assignment not present in this class")
    }

    const comment = await Comment.findById(commentId)
    if(!comment)
    {
        throw new ApiError(404,"Comment not found")
    }

    if(!assignment.comments.includes(commentId))
    {
        throw new ApiError(404,"Comment not present in this assignment")
    }

    await assignment.comments.pull(commentId)

    await assignment.save()
    await comment.deleteOne()

    res.status(200).json(new ApiResponse(200, {assignment},"Comment in Assignment deleted successfully"))

});
