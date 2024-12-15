import multer from 'multer';

// Set up storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Set up multer middleware
const upload = multer({ storage });

// Endpoint to upload profile picture
app.post('/api/users/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const { usersID } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Update user's profile picture in the database
        const user = await Users.findOneAndUpdate(
            { usersID },
            { profilePicture: req.file.path },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
