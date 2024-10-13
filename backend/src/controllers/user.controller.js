import { asyncHandler } from "../utils/asynchandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getProfile=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    console.log(userId);
    const userData = await User.findById(userId);
    if (!userData) {
        throw new ApiError(404, "User not found");
    }
    res.status(200).json(
        new ApiResponse(200, userData, "User data fetched successfully")   
    );
});   