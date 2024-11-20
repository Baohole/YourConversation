const mongoose = require("mongoose");

const romChatSchema = new mongoose.Schema({
    name: String,
    avatar: {
        type: String,
    },
    users: [{
        user_id: String,
        role: String,
        notification: {
            type: String,
            default: 'on'
        },
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
    type: String,
    metadata: {
        user_id: String,
        time: Date,
        content: String,
    }

});
const RoomChat = mongoose.model('RoomChat', romChatSchema, 'roomChat');
module.exports = RoomChat;