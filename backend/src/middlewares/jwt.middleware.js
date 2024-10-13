import jwt from 'jsonwebtoken';
import User from "../models/user.model.js"

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            // Verify the token and extract the userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
            const userId = decoded.id; // Assuming 'id' is the key used in the token payload

            // console.log(userId)

            // Fetch the user from the database using the userId
            const user = await User.findById(userId);
            if (!user) {
                return res.sendStatus(404); // User not found
            }

            // Attach the user object to the request
            req.user = user;
            next(); // Continue to the next middleware
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired' }); // 401 if the token is expired
            }
            console.error(err);
            return res.sendStatus(403); // Forbidden if token verification fails
        }
    } else {
        res.sendStatus(401); // Unauthorized if token is missing
    }
};

export default authenticateJWT;
