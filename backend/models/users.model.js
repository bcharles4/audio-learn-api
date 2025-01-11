// backend/models/users.model.js
const usersSchema = new mongoose.Schema({ 
    usersID: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true},
    uploads: [{ // Added this field to store user uploads
        title: String,
        description: String,
        filePath: String,
        uploadedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true,
});

const Users = mongoose.model("Users", usersSchema);

export default Users;
