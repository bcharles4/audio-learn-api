import mongoose from "mongoose";
import Users from "../backend/models/users.model.js";
import fs from "fs";
import path from "path";

// Register user
export const userRegister = async (req, res) => {
    const { usersID, firstName, lastName, password } = req.body;

    // Validate required fields
    if (!usersID || !firstName || !lastName || !password) {
        return res.status(400).send("Missing required fields");
    }

    try {
        // Check if usersID already exists in the database
        const existingUser = await Users.findOne({ usersID });

        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create a new user instance
        const newUser = new Users({ usersID, firstName, lastName, password });

        // Save the new user
        await newUser.save();

        // Send response
        res.status(201).json({ success: true, message: "User registered successfully", data: newUser });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Server error during registration" });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { usersID, password } = req.body;

    // Validate required fields
    if (!usersID || !password) {
        return res.status(400).json({ success: false, message: "UsersID and password are required" });
    }

    try {
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (password !== user.password) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Store user data in session
        req.session.userID = user.usersID;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;

        res.status(200).json({ success: true, message: "Login successful", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// Get user details
export const getUser = async (req, res) => {
    const { usersID } = req.params;

    if (!usersID) {
        return res.status(400).json({ success: false, message: "UsersID is required" });
    }

    try {
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching user" });
    }
};

// Update user details
export const updateUser = async (req, res) => {
    const { usersID } = req.params;
    const { password } = req.body;

    if (!usersID || !password) {
        return res.status(400).json({ success: false, message: "UsersID and new password are required" });
    }

    try {
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update the user's password
        user.password = password;
        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            data: { usersID: updatedUser.usersID, firstName: updatedUser.firstName, lastName: updatedUser.lastName }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during password update" });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    const { usersID } = req.params;

    if (!usersID) {
        return res.status(400).json({ success: false, message: "UsersID is required" });
    }

    try {
        const user = await Users.findOneAndDelete({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User deleted successfully", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error during user deletion" });
    }
};

export const updateUserName = async (req, res) => {
    const { usersID } = req.params; // Extract usersID from the request parameters
    const { firstName, lastName } = req.body; // Extract firstName and lastName from the request body

    try {
        // Find the user by their ID
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update the user's first and last name
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        // Save the updated user details to the database
        const updatedUser = await user.save();

        // Respond with the updated user information
        res.status(200).json({
            success: true,
            message: "User name updated successfully",
            data: {
                usersID: updatedUser.usersID,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName
            }
        });
    } catch (error) {
        // Handle server errors
        console.error("Error during user update:", error);
        res.status(500).json({ success: false, message: "Server error during name update" });
    }
};




// Upload module and save metadata to MongoDB
export const uploadModule = async (req, res) => {
    const { title, description, usersID } = req.body;

    if (!req.file || !usersID) {
        return res.status(400).json({ success: false, message: "File, title, and usersID are required" });
    }

    try {
        // File information
        const file = req.file; // Assuming you're using multer for file uploads
        const filePath = path.join('uploads', file.filename); // Adjust path based on your setup

        // Build module metadata
        const moduleData = {
            title,
            description,
            filePath,
            uploadedAt: new Date()
        };

        // Find the user and update their uploads
        const user = await Users.findOne({ usersID });

        if (!user) {
            // Delete the file if user is not found
            fs.unlinkSync(filePath);
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add the module metadata to user's uploads
        user.uploads.push(moduleData);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Module uploaded and saved successfully",
            data: moduleData
        });

    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).json({ success: false, message: "Server error during file upload" });
    }
};