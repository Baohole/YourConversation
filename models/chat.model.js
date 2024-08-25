const mongoose = require("mongoose");

const chatsSchema = new mongoose.Schema({
    user_id: String,
    room_id: String,
    message: String,
    images: Array,
    created_at: { 
        type: Date, 
        default: Date.now() 
    },
    deleted: {
        type: Boolean,
        default: false
    }

});
const Chat = mongoose.model('Chat', chatsSchema, 'chats');
module.exports = Chat;