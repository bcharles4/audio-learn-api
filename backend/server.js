import express from 'express';
import { connectDB } from './config/db.js';  
import router from '../routes/users.routes.js'; // Import the router from the routes file
import cors from 'cors';  // CORS middleware to allow cross-origin requests

const app = express();
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors({
    origin:  '*', // Allow both origins
             
    methods: ['GET', 'POST', 'DELETE', 'UPDATE'], // Allow specific methods
  }));
  
app.use(express.json()); 

// Routes
app.use('/api/users', router);

// Start server
app.listen(PORT, () => {
    connectDB(); // Connect to the database
    console.log(`Server started at http://localhost:${PORT}`);
});
