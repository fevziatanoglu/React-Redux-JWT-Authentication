const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");



// ==================== REGISTER ========================
const register = asyncHandler(async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // check all fields are filled
        if (!name || !email || !password) {
            res.status(400);
            throw new Error("Please fill all fields!");
        }

        // check is user exists
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            res.status(200);
            throw new Error("User already exists!");
        }

        // hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,

        });

        // return user's datas
        if (user) {
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
                // NOT PASSWORD!!
            })
        } else {
            res.status(400)
            throw new Error("Invalid user data!")
        }

    } catch (e) {
        res.status(400).json({ error: e.message });
    }

})
// ===================== LOGİN ======================
const login = asyncHandler(async (req, res) => {

    console.log(req);
    try {

        const { email, password } = req.body;
        // find user by email
        const user = await User.findOne({ email: email });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        // if user exists then check password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            // return user datas
           
            return res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            })
        } else {
            res.status(404)
            throw new Error("Wrong email or password!");
        }

    } catch (e) {
        res.status(400).json({ error: e.message });
    }

})


// =================== GET USER =================
const getUser = (req, res) => {


    try {
        return res.status(200).json(req.user)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

// GENERATE TOKEN BY USER ID
const generateToken = (id) => {

    // set id in token
    // we'll use this in auth middleware!!
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 3600
    })
}


module.exports = { register, login, getUser };