import mongoose from "mongoose";
import Users from "../backend/models/users.model.js";


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

    console.log("Received usersID:", usersID);  // Debugging the received usersID
    console.log("Received password:", password);  // Debugging the received password

    if (!usersID || !password) {
        return res.status(400).json({ success: false, message: "UsersID and password are required" });
    }

    try {
        const user = await Users.findOne({ usersID });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Debugging the password comparison
        console.log("Stored password:", user.password);  // Log the password from the database

        if (password !== user.password) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: { usersID: user.usersID, firstName: user.firstName, lastName: user.lastName }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
