import { ApiError } from "../utils/ApiError.js";

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    // Check if the error is an instance of ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            status: err.statusCode,
            message: err.message,
            errors: err.errors
        });
    }

    // For any other type of error, return a generic error response
    return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal Server Error",
        errors: err.stack
    });
};

export default errorHandler;
