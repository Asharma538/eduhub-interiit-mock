import { asyncHandler } from "../utils/asynchandler";
import Classroom from "../models/classroom.model";
import User from "../models/user.model";

export const joinClassroom = asyncHandler(async(req, res) => {});

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

export const getClasses = asyncHandler(async(req, res) => {});

export const getClassData= asyncHandler(async(req, res) => {});
