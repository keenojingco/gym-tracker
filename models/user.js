import mongoose from 'mongoose';

let Schema = mongoose.Schema;
let userSchema = new Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    role: Number
});

userSchema.statics.getUser = function (username, callback) {
    return this.findOne({ username: username }, callback);
}

export default mongoose.model('User', userSchema);