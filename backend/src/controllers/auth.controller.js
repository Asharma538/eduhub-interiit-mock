import User from '../models/user.model.js';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID

const googleLogin = async (req, res) => {
    const client = new OAuth2Client(CLIENT_ID);

    try {
        const token = req.headers.authorization?.split(' ')[1];  // Extract the token from the Authorization header        const googleRes = await oauth2Client.getToken(code);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });

        const payload = ticket.getPayload();  // Get the user information
        console.log('User verified:', payload);

        const email = payload.email;
        const name = payload.name;
        let user = await User.findOne({ email });
        console.log(email, name);

        if (!user) {
            console.log("Creating user");
            user = await User.create({
                email: email,
                display_name: name
            })
        }
        const { _id } = user;
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1d' });

        return res.status(200).json({
            success: true,
            jwtToken,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

export {
    googleLogin
}