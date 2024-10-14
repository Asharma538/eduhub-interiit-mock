import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Classroom from "../models/classroom.model.js";

export const addStudent = asyncHandler(async (req, res) => {
    const classId = req.params.classId;
    const { studentMail } = req.body;
    // console.log(classId)

    const classroom = await Classroom.findById(classId);

    if (!classroom) {
        throw new ApiError(404, "Classroom not found")
    }

    // console.log(classroom,"\n\n",classroom.name)

    if (!classroom.teachers.includes(req.user._id)) {
        throw new ApiError(403, "Only teachers can add new members");
    }

    const student = await User.findOne({ email: studentMail });
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    if (classroom.students.includes(student._id)) {
        throw new ApiError(400, "User is already a student in this classroom");
    }

    if (classroom.teachers.includes(student._id)) {
        throw new ApiError(400, "User is already a teacher in this classroom");
    }

    classroom.students.push(student._id);
    await classroom.save();

    await User.findByIdAndUpdate(student._id, { $addToSet: { classes: classroom._id } });
    res.status(200).json(new ApiResponse(200, {}, "Successfully joined the classroom"));

});

export const addTeacher = asyncHandler(async (req, res) => {
    const classId = req.params.classId;
    const { teacherMail } = req.body;
    // console.log(classId)

    const classroom = await Classroom.findById(classId);

    if (!classroom) {
        throw new ApiError(404, "Classroom not found")
    }

    // console.log(classroom,"\n\n",classroom.name)

    if (!classroom.teachers.includes(req.user._id)) {
        throw new ApiError(403, "Only teachers can add new members");
    }

    const teacher = await User.findOne({ email: teacherMail });
    if (!teacher) {
        throw new ApiError(404, "Teacher not found");
    }

    if (classroom.students.includes(teacher._id)) {
        throw new ApiError(400, "User is already a student in this classroom");
    }

    if (classroom.teachers.includes(teacher._id)) {
        throw new ApiError(400, "User is already a teacher in this classroom");
    }

    classroom.teachers.push(teacher._id);
    await classroom.save();

    await User.findByIdAndUpdate(teacher._id, { $addToSet: { classes: classroom._id } });
    res.status(200).json(new ApiResponse(200, {}, "Successfully joined the classroom"));

});

export const getMembers = asyncHandler(async (req, res) => {
    try {
        const classroomId = req.params.classId;
        const userId = req.user._id; // Get the authenticated user's ID

        // Validate if the classroomId is a valid MongoDB ObjectId

        // Find the classroom and populate teachers and students
        const classroom = await Classroom.findById(classroomId)
            .populate('teachers', 'display_name email')
            .populate('students', 'display_name email');

        // Check if the classroom exists
        if (!classroom) {
            return res.status(404).json({
                success: false,
                message: "Classroom not found"
            });
        }

        // Check if the user is a member of the class (either teacher or student)
        const isTeacher = classroom.teachers.some(teacher => teacher._id.equals(userId));
        const isStudent = classroom.students.some(student => student._id.equals(userId));

        if (!isTeacher && !isStudent) {
            throw new ApiError(403, "You are not a member of this class");
        }

        // Handle empty teachers or students list
        const teachers = classroom.teachers.length > 0
            ? classroom.teachers.map(teacher => ({
                email: teacher.email,
                display_name: teacher.display_name
            }))
            : [];

        const students = classroom.students.length > 0
            ? classroom.students.map(student => ({
                email: student.email,
                display_name: student.display_name
            }))
            : [];

        // Return success response with teachers and students
        return res.status(200).json({
            success: true,
            teachers,
            students
        });

    } catch (error) {
        console.error("Error fetching classroom members:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
});

export const deleteMember = asyncHandler(async (req, res) => {
    const classroomId = req.params.classId;
    const {memberMail} = req.body;
    
    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
        throw new ApiError(404, "Classroom not found");
    }

    const member = await User.findOne({ email: memberMail });
    if (!member) {
        throw new ApiError(404, "Member not found");
    }

    if (!classroom.teachers.includes(req.user._id)) {
        throw new ApiError(403, "Only teachers can remove members");
    }

    if (!classroom.students.includes(member._id) && !classroom.teachers.includes(member._id)) {
        throw new ApiError(404, "Member not found in this classroom");
    }

    //CHECK WHY NOT WORKING
    // classroom.students = classroom.students.filter(student => student != member._id);
    // classroom.teachers = classroom.teachers.filter(teacher => teacher != member._id);

    classroom.students = classroom.students.filter(student => !student.equals(member._id));
    classroom.teachers = classroom.teachers.filter(teacher => !teacher.equals(member._id));


    await classroom.save();

    await User.findByIdAndUpdate(member._id, { $pull: { classes: classroom._id } });

    res.status(200).json(new ApiResponse(200, {}, "Member removed successfully"));

});
