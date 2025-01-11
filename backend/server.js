import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';  // For using environment variables
import { connectDB } from './config/db.js';
import userRoutes from '../routes/users.routes.js';
import session from 'express-session';

// Load environment variables from a .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Session middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',  // Secret from env variables or fallback value
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',  // Set to true in production for HTTPS
        httpOnly: true,  // Prevent client-side JavaScript from accessing the cookie
        maxAge: 60 * 60 * 1000  // Session expires after 1 hour
    }
}));

// Middleware to parse URL-encoded bodies (useful for forms)
app.use(express.urlencoded({ extended: true }));

// CORS configuration for security (restrict to specific origins in production)
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',  // You can restrict to a specific frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Allow cookies or credentials to be sent with requests
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g., uploaded profile pictures) from the 'uploads' folder
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));  // Corrected path to the 'uploads' folder

// User routes
app.use('/api/users', userRoutes);

// Handle CORS preflight requests
app.options('*', cors());

// Global Error Handler for all routes
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// Start the server
app.listen(PORT, async () => {
    try {
        await connectDB();  // Connect to the database
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1);  // Exit if DB connection fails
    }
});
