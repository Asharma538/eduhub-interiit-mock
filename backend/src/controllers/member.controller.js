import { asyncHandler } from "../utils/asynchandler";
import Classroom from "../models/classroom.model";

export const addStudent = asyncHandler(async(req, res) => {});

export const addTeacher = asyncHandler(async(req, res) => {});

export const getMembers = asyncHandler(async(req, res) => {
    try {
    const { classroomId } = req.params;
    const classroom = await Classroom.findById(classroomId)
        .populate('teachers', 'display_name email') 
        .populate('students', 'display_name email');
    if (!classroom) {
        return res.status(404).json({
            success: false,
            message: "Classroom not found"
        })
    }

    const teachers = classroom.teachers.map(teacher => ({
        email: teacher.email,
        display_name: teacher.display_name
    }));

    const students = classroom.students.map(student => ({
        email: student.email,
        display_name: student.display_name
    }));

    return res.status(200).json({
        success: true,
        teachers,
        students
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
}}
);

