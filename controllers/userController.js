const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Utility function to generate JWT
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// User signup
const signup = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    console.log("for registering: ", req.body);

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: savedUser._id,
                first_name: savedUser.first_name,
                last_name: savedUser.last_name,
                email: savedUser.email,
                createdAt: savedUser.createdAt,
                updatedAt: savedUser.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// User login
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Request body:", req.body);

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare passwords
        console.log("Plain password:", password);
        console.log("Hashed password from DB:", user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = generateToken(user._id, user.email);

        res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

module.exports = { signup, login };
