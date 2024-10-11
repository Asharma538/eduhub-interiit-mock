import User from '../models/userModel';
import axios from 'axios';
import {oauth2Client} from '../config/googleConfig';
import jwt from 'jsonwebtoken';

const googleLogin = async (req, res) => {
    try {
        const {code} = req.query;
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/
            userinfo?alt=json&access_token=${googleRes.tokens.access_token}` 
        )
        const {email, name} = userRes.data;
        let user = await User.findOne({email});

        if(!user){
            user = await User.create({
                email,
                name
            })
        }
        const {_id} = user;
        const token = jwt.sign({_id, email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_TIMEOUT}
        );

        return res.status(200).json({
            success: true,
            token,
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:"Internal server error"
        })
        
    }
}

module.exports = {
    googleLogin
}