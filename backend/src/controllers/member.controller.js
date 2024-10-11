import Classroom from "../models/classroom.model";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asynchandler";
import Classroom from "../models/classroom.model";

export const addStudent = asyncHandler(async (req, res) => {
    const { classId } = req.params;
    const { studentId } = req.body;

    const classroom = Classroom.findById(classId);

    if (!classroom) {
        throw new ApiError(404, "Classroom not found")
    }

    if (!classroom.teachers.includes(req.user.id)) {
        throw new ApiError(403, "Only teachers can add new members");
    }

    const student = await User.findById(studentId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    if (classroom.students.includes(studentId)) {
        throw new ApiError(400, "You are already a member of this classroom");
    }

    classroom.students.push(studentId);
    await classroom.save();

    await User.findByIdAndUpdate(studentId, {$addToSet:{classes: classroom._id}});
    res.status(200).json(new ApiResponse(200, {}, "Successfully joined the classroom"));

});

export const addTeacher = asyncHandler(async (req, res) => { });

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
