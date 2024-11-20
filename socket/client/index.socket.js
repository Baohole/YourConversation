const UserSocket = require('./user.socket')

module.exports = async (req, res) => {
    _io.once('connection', async (socket) => {
        if (!socket.connectioHandler) {
            console.log(`Socket ${socket.id} connected`);
            socket.connectioHandler = true;

            UserSocket(req, res, socket);

            socket.on('disconnect', function () {
                console.log(`Socket ${socket.id} disconnect!`);
                socket.connectionHandler = false;
            });
        }
    });
}