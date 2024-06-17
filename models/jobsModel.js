import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Company name is required']
    },
    position: {
        type: String,
        required: [true, 'Job position is required'],
        maxlength: 100 // Fixed typo from 'midlength' to 'maxlength'
    },
    status: {
        type: String,
        enum: ['Pending', 'Reject', 'Interview'],
        default: 'Pending'
    },
    workType: { // Fixed typo from 'wotkType' to 'workType'
        type: String,
        enum: ['full-time', 'part-time', 'internship', 'contract'],
        default: 'full-time'
    },
    workLocation: { // Changed to camelCase for consistency
        type: String,
        default: 'Mumbai',
        required: [true, 'Location is required']
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true // Adding required field validation
    }
}, { timestamps: true });

export default mongoose.model('JobModel', jobSchema);
