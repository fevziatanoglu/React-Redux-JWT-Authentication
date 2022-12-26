const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const USER = require('../models/userModel.js');

// take token from headers (it has to be bearer token in headers.authorization)
// send data in token to next function
const protect = asyncHandler(async (req, res, next) => {
    let token

    // if there is a token and
    // if headers is authorization and a bearer token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

        try {
            // header authorization is something like => Bearer asddfghjklş
            // split it
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id)
                // delete password from data!
                .select("-password");

            next()
        } catch (err) {
            console.log(err);
            res.status(401).json({ error: err.message });
        }


        if(!token){
            res.status(401)
            throw new Error("Token not found!");
        }

    }
})


module.exports = protect