//import User from '../models/userModel';
const db = require("../models");
const User = db.User;
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");

// ---------------------- AUTHORISATION method --------------------------------------------------

const authorization = asyncHandler(async (req, res, next) => {
    console.log(req.headers);
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    try {
        // Find the user by username
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            //   return res.status(401).json({ error: 'User not found' });
            return 'Not User';
        }
        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {

            return res.status(401).json({ error: 'Invalid password' });
           
        }
        // Generate a Base64-encoded token (containing username or other user data)

        //const base64Token = Buffer.from(username).toString('base64');
        // return username;
        //return user.id;
        // res.json({ token: base64Token });
        req.userId = user.id;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Internal server error' });

    }

}

)

module.exports = authorization;