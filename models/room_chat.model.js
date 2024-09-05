const mongoose = require("mongoose");

const romChatSchema = new mongoose.Schema({
    users: [{
        user_id: String,
        role: String
    }],
    files: Array,
    created_at: { 
        type: Date, 
        default: Date.now() 
    },
    deleted: {
        type: Boolean,
        default: false
    }

});
const RoomChat = mongoose.model('RoomChat', romChatSchema, 'roomChat');
module.exports = RoomChat;