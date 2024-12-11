import express from 'express';
import { connectDB } from './config/db.js'; // Import database connection
import router from '../routes/users.routes.js'; // Import the router from the routes file
import cors from 'cors'; // CORS middleware to allow cross-origin requests

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Configure CORS to allow cross-origin requests
app.use(cors({
    origin: '*', // Replace '*' with your frontend URL in production for better security
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use('/api/users', router);

// Handle CORS preflight requests
app.options('*', cors()); // Respond to preflight requests for all routes

// Start server
app.listen(PORT, async () => {
    try {
        await connectDB(); // Connect to the database
        console.log(`Server is running at http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
        process.exit(1); // Exit with failure if database connection fails
    }
});
