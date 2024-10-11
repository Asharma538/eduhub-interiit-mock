import User from '../models/user.model.js';
import axios from 'axios';
import {OAuth2Client} from 'google-auth-library';
// import {oauth2Client} from '../utils/googleConfig.js';
import jwt from 'jsonwebtoken';


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const googleLogin = async (req, res) => {
    const client = new OAuth2Client(CLIENT_ID);
    console.log("Hello im in google login func")
    try {
        const token = req.headers.authorization?.split(' ')[1];  // Extract the token from the Authorization header        const googleRes = await oauth2Client.getToken(code);
        // oauth2Client.setCredentials();
        
        // const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/
        //     userinfo?alt=json&access_token=${code}` 
        // )
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
          });

        const payload = ticket.getPayload();  // Get the user information
        console.log('User verified:', payload);

        const email = payload.email;
        const name = payload.name;
        let user = await User.findOne({email});
        console.log(email,name);
        
        if(!user){
            console.log("Creating user");
            user = await User.create({
                email: email,
                display_name: name
            })
        }
        console.log(user);
        const {_id} = user;
        const jwtToken = jwt.sign({_id, email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_TIMEOUT}
        );
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