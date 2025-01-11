import express from "express";
import { 
    userRegister, 
    loginUser, 
    getUser, 
    updateUser, 
    deleteUser,
    updateUserName
} from "../controller/users.controller.js";

const router = express.Router();

// User registration route
router.post("/register", userRegister);

// User login route
router.post("/login", loginUser);

// Get user details by usersID
router.get("/:usersID", getUser);

// Update user details by usersID (name, email, password, etc.)
router.put("/:usersID", updateUser);

// Delete user by usersID
router.delete("/:usersID", deleteUser);

// Update user's name (firstName, lastName) only
router.put("/editName/:usersID", updateUserName);

export default router;
