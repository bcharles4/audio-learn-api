import express from "express";
import { 
    userRegister, 
    loginUser, 
    getUser, 
    updateUser, 
    deleteUser,
    uploadProfilePicture
} from "../controller/users.controller.js";

import upload from '../backend/multerConfig.js'; // Ensure this points to the correct location for your multer config

const router = express.Router();

// User registration route
router.post("/register", userRegister);

// User login route
router.post("/login", loginUser);

// Get user details by usersID
router.get("/:usersID", getUser);

// Update user details by usersID
router.put("/:usersID", updateUser);

// Delete user by usersID
router.delete("/:usersID", deleteUser);

// Profile Picture Upload Route
router.post('/upload-profile-picture', upload.single('profilePicture'), uploadProfilePicture);

export default router;
