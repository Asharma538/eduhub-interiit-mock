import Classroom from "../models/classroom.model";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponce";
import { asyncHandler } from "../utils/asynchandler";
import Classroom from "../models/classroom.model";
import User from "../models/user.model";

export const joinClassroom = asyncHandler(async(req, res) => {
    const {code} =req.body;
    const userId=req.user.id;

    const classroom = await Classroom.findOne({invitation_code: code});

    if(!classroom)
    {
        throw new ApiError(404, "Classromm not found");
    }

    const student = await User.findById(userId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    if(classroom.students.includes(userId))
    {
        throw new ApiError(400,"You are already a member of this classroom");
    }

    classroom.students.push(userId);
    await classroom.save();

    await User.findByIdAndUpdate(userId,{$addToSet: {classes: classroom._id}});

    res.status(200).json(new ApiResponse(200, {}, "Successfully joined the classroom"));
});

export const createClassroom = asyncHandler(async(req, res) => {
    try {
        const userId = req.user.id;
        const {name, invitation_code, details} = req.body;
        const newClassroom = new Classroom.create({
            name,
            invitation_code,
            details,
            teachers: [userId]
        });
        
        const savedClassroom = await newClassroom.save();
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.classes.push(savedClassroom._id);
        await user.save();
        return res.status(201).json({
            message: "Classroom created successfully",
            classroom: savedClassroom
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
});

export const getClasses = asyncHandler(async(req, res) => {
    const userId  = req.user.id;

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
