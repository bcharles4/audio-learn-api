import express from 'express';
import {
    userRegister,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    updateUserName,
    uploadModule
} from '../controller/users.controller.js';

import upload from '../middleware/upload.js';


const router = express.Router();

// Middleware to check if the user is logged in
const authenticateSession = (req, res, next) => {
    if (!req.session.userID) {
        return res.status(401).json({ success: false, message: 'User not logged in' });
    }
    next(); // Proceed to the next middleware or route handler
};

// User registration route
router.post('/register', userRegister);

// User login route
router.post('/login', loginUser);

// Get user details by usersID (public route)
router.get('/:usersID', getUser);

// Update user details by usersID (protected route, user must be logged in)
router.put('/:usersID', authenticateSession, updateUser);

// Delete user by usersID (protected route, user must be logged in)
router.delete('/:usersID', authenticateSession, deleteUser);

// Update user's name (firstName, lastName) only (protected route, user must be logged in)
router.put('/editName/:usersID', authenticateSession, updateUserName);

router.post('/upload_module', upload.single('file'), uploadModule);


export default router;
