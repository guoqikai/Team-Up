const mongoose = require("mongoose");
const RoleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    projectId: {
        type: mongoose.ObjectId,
        required: true
    },
    userId: mongoose.ObjectId,
    applicants: {
        type: [mongoose.ObjectId],
        required: true,
        default: []
    }
});

const Role = mongoose.model("Role", RoleSchema);

module.exports = { Role };