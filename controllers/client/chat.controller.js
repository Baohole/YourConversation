const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');

const uploadHelper = require('../../helper/upload.helper');
//[GET] /chat
module.exports.index = async (req, res) => {
    _io.once('connection', (socket) => {
        if (!socket.connectioHandler) {
            socket.connectioHandler = true;

            console.log('User connected', socket.id);

            socket.on('CLIENT_SEND_MESSAGE', async (data) => {
                try {
                    let chat = {
                        message: data.message,
                        user_id: res.locals.user.id,
                        user_name: res.locals.user.full_name,
                        images: []
                    };
                   

                    for(const file of data.images){
                        const fileUpload = await uploadHelper(file);
                        chat.images.push(fileUpload);
                    }
                    // //console.log(chat);
                    const savedChat = new Chat(chat);
                    await savedChat.save();
                    // Broadcast the message to all connected clients
                    _io.emit('SERVER_SEND_MESSAGE', chat);
                } catch (error) {
                    console.error('Error saving chat message:', error);
                }
            });

            socket.on('CLIENT_SEND_TYPING', (data) => {
                socket.broadcast.emit('SERVER_SEND_TYPING', {
                    user_id: res.locals.user.id,
                    user_name: res.locals.user.full_name,
                    is_typing: data.is_typing
                });
            });


            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('User disconnected', socket.id);
            });

        }
    });

    const chats = await Chat.find({
        deleted: false
    });

    for (const chat of chats) {
        if (chat.user_id !== res.locals.user.id) {
            const user = await User.findOne({
                _id: chat.user_id,
                deleted: false
            });
            if (user) {
                chat.user_name = user.full_name;
            }
        }
        else {
            chat.user_name = res.locals.user.full_name;
        }
    }

    res.render('client/pages/chat/index', {
        pageTitle: 'Chat',
        chats: chats
    });
}