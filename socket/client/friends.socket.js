const User = require('../../models/user.model');
const RoomChat = require('../../models/room_chat.model');

module.exports = async (res) => {
    const my_id = res.locals.user.id
    _io.once('connection', async (socket) => {
        if (!socket.connectioHandler) {
            socket.connectioHandler = true;

            console.log('User connected', socket.id);

            socket.on('CLIENT_ADD_FRIEND', async (_id) => {
                const existYourRequest = await User.findOne({
                    _id: my_id,
                    yourRequest: _id
                });

                if (!existYourRequest) {
                    await User.updateOne({
                        _id: my_id
                    }, {
                        $push: {
                            yourRequest: _id
                        }
                    });
                }

                const existRequest = await User.findOne({
                    _id: _id,
                    requestFriend: my_id
                });
                if (!existRequest) {
                    await User.updateOne({
                        _id: _id
                    }, {
                        $push: {
                            requestFriend: my_id
                        }
                    });
                }
            });

            socket.on('CLIENT_DELETE_REQUEST', async (_id) => {
                const existYourRequest = await User.findOne({
                    _id: my_id,
                    yourRequest: _id
                });

                if (existYourRequest) {
                    await User.updateOne({
                        _id: my_id
                    }, {
                        $pull: {
                            yourRequest: _id
                        }
                    });
                }

                const existRequest = await User.findOne({
                    _id: _id,
                    requestFriend: my_id
                });
                if (existRequest) {
                    await User.updateOne({
                        _id: _id
                    }, {
                        $pull: {
                            requestFriend: my_id
                        }
                    });
                }

            });

            socket.on('CLIENT_ACCEPT_REQUEST', async (_id) => {
                const existYourRequest = await User.findOne({
                    _id: my_id,
                    requestFriend: _id
                });
                const existRequest = await User.findOne({
                    _id: _id,
                    yourRequest: my_id
                });
                if (existYourRequest && existRequest) {
                    const room_chat = new RoomChat({
                        users: [
                            {
                                user_id: _id,
                                role: 'superAdmin'
                            },
                            {
                                user_id: my_id,
                                role: 'superAdmin'
                            }
                        ]

                    });
                    await room_chat.save();

                    await User.updateOne({
                        _id: my_id
                    }, {
                        $pull: {
                            requestFriend: _id
                        },
                        $push: {
                            friends: {
                                user_id: _id,
                                room_id: room_chat.id
                            }
                        }
                    });
                    await User.updateOne({
                        _id: _id
                    }, {
                        $pull: {
                            yourRequest: my_id
                        },
                        $push: {
                            friends: {
                                user_id: my_id,
                                room_id: room_chat.id
                            }
                        }
                    });


                }
            });

            socket.on('CLIENT_REFUSE_REQUEST', async (_id) => {
                const existYourRequest = await User.findOne({
                    _id: my_id,
                    requestFriend: _id
                });

                if (existYourRequest) {
                    await User.updateOne({
                        _id: my_id
                    }, {
                        $pull: {
                            requestFriend: _id
                        }
                    });

                }

                const existRequest = await User.findOne({
                    _id: _id,
                    yourRequest: my_id
                });
                if (existRequest) {
                    await User.updateOne({
                        _id: _id
                    }, {
                        $pull: {
                            yourRequest: my_id
                        }
                    });
                }

            })
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('User disconnected', socket.id);
            });

        }

    });
}
