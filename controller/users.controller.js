import mongoose from "mongoose";
import Users from "../backend/models/users.model.js";
import fs from 'fs';


export const userRegister = async (req, res) => {
    const users = req.body;

    // Validate the required fields
    if (!users.usersID || !users.firstName || !users.lastName || !users.password) {
        return res.status(400).send("Invalid data");
    }

    try {
        // Check if usersID already exists in the database
        const existingUser = await Users.findOne({ usersID: users.usersID });

        if (existingUser) {
            // If userID exists, return an error
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create a new user instance
        const newUser = new Users(users);

        // Save the new user to the database
        await newUser.save();

        // Send a successful response
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        // Log the error for debugging
        console.error('Error during registration:', error);

        // Handle other server errors
        res.status(500).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { usersID, password } = req.body;

    if (!usersID || !password) {
        return res.status(400).json({ success: false, message: 'UsersID and password are required' });
    }

    try {
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (password !== user.password) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Store user ID or other information in session
        req.session.userID = user.usersID;
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;

        return res.status(200).json({ success: true, message: 'Login successful', data: user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Get user function
export const getUser = async (req, res) => {
    const { usersID } = req.params; // Extract usersID from URL parameters

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
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
    const { usersID } = req.params; // Extract usersID from URL parameters
    const { password } = req.body; // Extract password from the request body

    if (!usersID) {
        return res.status(400).json({ success: false, message: "UsersID is required" });
    }

    if (!password) {
        return res.status(400).json({ success: false, message: "New password is required" });
    }

    try {
        // Check if the user exists
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Directly update the password without hashing
        user.password = password;
        const updatedUser = await user.save(); // Save the updated user

        res.status(200).json({ 
            success: true, 
            message: "Password updated successfully", 
            data: { usersID: updatedUser.usersID, firstName: updatedUser.firstName, lastName: updatedUser.lastName }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Delete user function
export const deleteUser = async (req, res) => {
    const { usersID } = req.params; // Extract usersID from URL parameters

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
        res.status(500).json({ success: false, message: error.message });
    }
};


export const updateUserName = async (req, res) => {
    const { usersID } = req.params;
    const { firstName, lastName } = req.body;

    // Ensure the user is logged in by checking the session
    if (!req.session.userID) {
        return res.status(401).json({ message: "User not logged in" });
    }

    // Ensure the logged-in user is trying to update their own profile
    if (usersID !== req.session.userID) {
        return res.status(403).json({ message: "You cannot update someone else's profile" });
    }

    try {
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's name fields
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;

        const updatedUser = await user.save();

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
        res.status(500).json({ success: false, message: error.message });
    }
};


const authenticateSession = (req, res, next) => {
    if (!req.session.userID) {
        return res.status(401).json({ message: 'User not logged in' });
    }
    next(); // Continue if user is logged in
};
