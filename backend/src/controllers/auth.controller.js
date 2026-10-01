
const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
//                    REGISTER USER
// =====================================================

async function registerUser(req, res) {
    const { fullName, email, password } = req.body;

    // Check if user already exists
    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User has already registered."
        });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    });

    // Create JWT token
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    );

    // Store token in cookie
    res.cookie("token", token);

    // Send response
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    });
}


// =====================================================
//                     LOGIN USER
// =====================================================

async function loginUser(req, res) {
    const { email, password } = req.body;

    // Find user using email
    const user = await userModel.findOne({ email });

    // If user doesn't exist
    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    // If password is wrong
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    // Create JWT token
    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET
    );

    // Store token in cookie
    res.cookie("token", token);

    // Send response
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    });
}


// =====================================================
//                    LOGOUT USER
// =====================================================

function logoutUser(req, res) {

    // Remove token cookie
    res.clearCookie("token", {
        path: "/"
    });

    return res.status(200).json({
        message: "User logged out successfully"
    });
}


// =====================================================
//                REGISTER FOOD PARTNER
// =====================================================

async function registerFoodPartner(req, res) {
    const { name, email, password } = req.body;

    // Check if food partner already exists
    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    });

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food partner account already exists"
        });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create food partner
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword
    });

    // Create JWT token
    const token = jwt.sign(
        { id: foodPartner._id },
        process.env.JWT_SECRET
    );

    // Store token in cookie
    res.cookie("token", token);

    // Send response
    return res.status(201).json({
        message: "Food partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    });
}


// =====================================================
//                 LOGIN FOOD PARTNER
// =====================================================

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;

    // Find food partner using email
    const foodPartner = await foodPartnerModel.findOne({
        email
    });

    // If food partner doesn't exist
    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    // Compare entered password with hashed password
    const isPasswordValid = await bcrypt.compare(
        password,
        foodPartner.password
    );

    // If password is wrong
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    // Create JWT token
    const token = jwt.sign(
        { id: foodPartner._id },
        process.env.JWT_SECRET
    );

    // Store token in cookie
    res.cookie("token", token);

    // Send response
    return res.status(200).json({
        message: "Food partner logged in successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    });
}


// =====================================================
//                LOGOUT FOOD PARTNER
// =====================================================

function logoutFoodPartner(req, res) {

    // Remove token cookie
    res.clearCookie("token", {
        path: "/"
    });

    return res.status(200).json({
        message: "Food partner logged out successfully"
    });
}


// =====================================================
//                     EXPORT
// =====================================================

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};
