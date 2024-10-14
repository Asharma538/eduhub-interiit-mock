import Classroom from "../models/classroom.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Announcement from "../models/anouncement.model.js";
import axios from 'axios';
// import Announcement from "../models/announcement.model.js";

export const getClassData = asyncHandler(async (req, res) => {
    const classId = req.params.classId;
    const userId = req.user._id;

    const classroom = await Classroom.findById(classId)
        .populate({
            path: "announcements",
            populate: [
                {
                    path: "user_id",
                    select: "email display_name"
                },
                {
                    path: "comments",
                    populate: {
                        path: "user_id",
                        select: "email display_name"
                    },
                    select: "content"
                }
            ]
        });

    if (!classroom) {
        throw new ApiError(404, "Classroom not found.");
    }

    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isStudent = classroom.students.includes(userId);
    const isTeacher = classroom.teachers.includes(userId);
    if (!isStudent && !isTeacher) {
        throw new ApiError(403, "You are not a memeber of this class")
    }

    let classroomData;

    if (isStudent) {
        classroomData = {
            name: classroom.name,
            details: classroom.details,
        }
    }

    if (isTeacher) {
        classroomData = {
            invitation_code: classroom.invitation_code,
            name: classroom.name,
            details: classroom.details,
        }
    }

    const announcements = classroom.announcements.map(announcement => ({
        id: announcement._id,
        content: announcement.content,
        file_url: announcement.file_url,
        user_id: {
            display_name: announcement.user_id.display_name,
            email: announcement.user_id.email
        },
        comments: announcement.comments.map(comment => ({
            content: comment.content,
            user_id: {
                display_name: announcement.user_id.display_name,
                email: announcement.user_id.email
            }
        }))
    }));
    // console.log(announcements)
    res.status(200).json(new ApiResponse(200, { classroom: classroomData, announcements }, "Class data retrieved successfully"));
});

// Controller to get classwork of a specific classroom
export const getClassWork = asyncHandler(async (req, res) => {
    try {
        // get the classroom id from the frontend
        const classroomId = req.params.classId;

        // Now get the classroom with the given id
        const classroom = await Classroom.findById(classroomId)


        if (!classroom) {
            return res.status(404).json({ message: "Class not found" });
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

export const deleteClass = asyncHandler(async (req, res) => {
    const userId = req.user._id; // This should be a valid ObjectId
    const classId = req.params.classId;
    const token = req.headers.authorization;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const classroom = await Classroom.findById(classId).populate("teachers").populate("students");
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    console.log(classroom);

    // Check if the userId is included in the teachers' IDs
    const isTeacher = classroom.teachers.some(teacher => teacher._id.equals(userId));
    if (!isTeacher) {
        throw new ApiError(403, "You are not a teacher of this class");
    }

    // Remove the classroom ID from teachers
    await Promise.all(
        classroom.teachers.map(async (teacher) => {
            teacher.classes = teacher.classes.filter((classId) => !classId.equals(classroom._id));
            return teacher.save();
        })
    );

    // Remove the classroom ID from students
    await Promise.all(
        classroom.students.map(async (student) => {
            student.classes = student.classes.filter((classId) => !classId.equals(classroom._id));
            return student.save();
        })
    );

    await Promise.all(
        classroom.assignments.map(async (assignmentId) => {
            try {
                await axios.delete(`http://localhost:8000/classes/${classId}/assignments/${assignmentId}`, {
                    headers: {
                        Authorization: token
                    }
                });
            } catch (error) {
                console.error(`Failed to delete assignment ${assignmentId}:`, error.message);
            }
        })
    );

    await Promise.all(
        classroom.announcements.map(async (announcementId) => {
            try {
                await axios.delete(`http://localhost:8000/classes/${classId}/announcements/${announcementId}`, {
                    headers: {
                        Authorization: token
                    }
                });
            } catch (error) {
                console.error(`Failed to delete announcement ${announcementId}:`, error.message);
            }
        })
    );

    await classroom.deleteOne(); // Delete the classroom from the database

    res.status(200).json(new ApiResponse(200, {}, "Class deleted successfully"));
});





