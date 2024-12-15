import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';
import userRoutes from '../routes/users.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS for security
app.use(cors({
    origin: '*', // Use environment variable for frontend URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // If you're dealing with cookies or credentials

}));

// Parse JSON bodies
app.use(express.json());

// Serve static files (e.g., uploaded files)
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);

// Handle CORS preflight requests
app.options('*', cors());

// Global Error Handler
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
        await connectDB();
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1); // Exit the process if DB connection fails
    }
});
