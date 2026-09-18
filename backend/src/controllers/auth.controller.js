const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================

async function registerUser(req, res) {

    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        email
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User has already registered."
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    });

    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    );

    res.cookie("token", token);

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    });
}


// ================= LOGIN =================

async function loginUser(req, res) {

    const { email, password } = req.body;

    // Find user
    const user = await userModel.findOne({
        email
    });

    if (!user) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Email or Password"
        });
    }

    // Create JWT
    const token = jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_SECRET
    );

    // Save token in cookie
    res.cookie("token", token);

    return res.status(200).json({
        message: "User Logged in Successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    });
}


// ================= LOGOUT =================

function logoutUser(req, res) {

    res.clearCookie("token", {
        path: "/"
    });

    return res.status(200).json({
        message: "Logout Successfully"
    });
}


// ================= EXPORT =================

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};