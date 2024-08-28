const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');

const chatSocket = require('../../socket/client/chat.socket')

//[GET] /chat
module.exports.index = async (req, res) => {
    //socket io
    chatSocket(res);

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