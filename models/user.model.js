const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: String,
    email: String, 
    password: String,
    user_token: String,
    status: {
        type: String,
        default: "active"
    },
    phone:String,
    avatar:String,
    yourRequest: [],
    requestFriend: [],
    active_stauts: String,
    friends: [{
        user_id: String,
        room_id: String,
    }],
    group: [],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date

    }
});
const User = mongoose.model('User', userSchema, 'users');
module.exports = User;