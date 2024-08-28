const Chat = require('../../models/chat.model');

const uploadHelper = require('../../helper/upload.helper');

module.exports = (res) => {
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
}
