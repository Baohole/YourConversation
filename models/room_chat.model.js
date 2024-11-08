const mongoose = require("mongoose");

const romChatSchema = new mongoose.Schema({
    name: String,
    avatar: {
        type: String,
        default: 'https://fivepointsdentalnj.com/wp-content/uploads/2015/11/anonymous-user.png'
    },
    users: [{
        user_id: String,
        role: String
    }],
    created_at: {
        type: Date,
        default: Date.now()
    },
    deleted: {
        type: Boolean,
        default: false
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    type: String

});
const RoomChat = mongoose.model('RoomChat', romChatSchema, 'roomChat');
module.exports = RoomChat;