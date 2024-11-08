const Chat = require('../../models/chat.model');
const RoomChat = require('../../models/room_chat.model');

const uploadHelper = require('../../helper/upload.helper');
module.exports = (req, res) => {
    _io.once('connection', async (socket) => {
        if (!socket.connectioHandler) {
            socket.connectioHandler = true;

            //console.log(req.params.id);
            const _id = res.locals.user.id;
            // const all_room = await RoomChat.find({
            //     deleted: false,
            //     'users.user_id': _id
            // }).select('_id');
            // const rooms_id = all_room.map(room_id => room_id.id.trim());
            // //console.log(rooms_id);
            // socket.join(rooms_id);
            // //console.log(socket);
            let room_id
            try {
                room_id = req.params.id;
            } catch (error) {

            }
            if (room_id) {
                socket.join(room_id);

                socket.on('CLIENT_SEND_MESSAGE', async (data) => {
                    //  console.log(data);

                    try {
                        let chat = {
                            message: data.message,
                            user_id: _id,
                            user_name: res.locals.user.full_name,
                            files:[],
                            room_id: room_id
                        };
                        // console.log(chat);
                        for (const file of data.files) {
                            const link = await uploadHelper(file.file);
                            const tmp = {
                                link:link,
                                type: file.type
                            }
                            chat.files.push(tmp);
                        }
                        console.log(chat);
                        const savedChat = new Chat(chat);

                        try {
                            await savedChat.save();
                            await RoomChat.updateOne(
                                { _id: room_id },
                                { $set: { updatedAt: Date.now() } }
                            );
                        } catch (error) {
                            console.log(error);
                        }


                        // Broadcast the message to all connected clients
                        chat.user_avatar = res.locals.user.avatar;
                        chat.timestamp = savedChat.created_at;
                        _io.to(room_id).emit('SERVER_SEND_MESSAGE', chat);
                    } catch (error) {
                        console.error('Error saving chat message:', error);
                    }
                });

                socket.on('CLIENT_SEND_TYPING', (data) => {
                    // console.log(data);
                    socket.broadcast.to(room_id).emit('SERVER_SEND_TYPING', {
                        user_id: res.locals.user.id,
                        user_name: res.locals.user.full_name,
                        is_typing: data.is_typing
                    });
                });

            }

            socket.on('CLIENT_SEND_CALLING', (data) => {
                const room = RoomChat.findOne({
                    deleted: false,
                    id: room_id,
                    'users.user_id': _id
                }).select('name avatar');
                if (room.type == 'friend') {
                    room.avatar = res.locals.user.avatar;
                    room.name = res.locals.user.full_name;
                }
                //console.log(data.user_call + ' - ' + _id);
                if (_id == data.user_call) {
                    const room_detail = {
                        name: room.name,
                        avatar: room.avatar
                    }

                    //console.log(data);
                    socket.broadcast.to(data.roomId).emit('SERVER_SEND_CALLING', {
                        ...data,
                        room_detail
                    })
                }
            });



        }

    });
}
