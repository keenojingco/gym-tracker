import mongoose from 'mongoose';

const Schema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    id: Number,
    role: String,
});

export default mongoose.model('Role', Schema);