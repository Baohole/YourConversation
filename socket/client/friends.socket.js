const User = require('../../models/user.model');

module.exports = async (res) => {
    const my_id = res.locals.user.id
    _io.once('connection', (socket) => {
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

                if (existYourRequest) {
                    await User.updateOne({
                        _id: my_id
                    }, {
                        $pull: {
                            requestFriend: _id
                        },
                        $push: {
                            friends: {
                                user_id: _id,
                            }
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
                        },
                        $push: {
                            friends: {
                                user_id: my_id,
                            }
                        }
                    });
                }


            });
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('User disconnected', socket.id);
            });

        }

    });
}
