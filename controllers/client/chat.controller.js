const User = require('../../models/user.model');
const Chat = require('../../models/chat.model');
const RoomChat = require('../../models/room_chat.model');

const chatSocket = require('../../socket/client/chat.socket');
const IndexSocket = require('../../socket/client/index.socket');

const getChatsHelper = require('../../helper/getChats.helper');

//[GET] /chat
module.exports.index = async (req, res) => {
    const groups = await getChatsHelper(req, res);
    
    // chatSocket(req, res);
    IndexSocket(req, res);
    res.render('client/layouts/default', {
        pageTitle: 'Chat',
        rooms: groups.rooms,
        friends: groups.user_friends,
    });
}

// [GET] /chat/:id
module.exports.roomChat = async (req, res) => {
    const room_id = req.params.id;
    const { property } = req.query;
    // console.log(property)
    chatSocket(req, res);
    let chats;
    try {
        chats = await Chat.find({
            deleted: false,
            room_id: room_id
        });
    } catch (error) {

    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const messages = {};
    for (const chat of chats) {
        const date = new Date(chat.created_at);
        const monthDate = `${monthNames[date.getMonth()]} ${date.getDate()}`; // Format: Month Date

        if (!messages[monthDate]) {
            messages[monthDate] = [];
        }

        messages[monthDate].push(chat);

        if (chat.user_id !== res.locals.user.id) {
            try {
                const user = await User.findOne({
                    _id: chat.user_id,
                    deleted: false,

                });
                if (user) {
                    chat.user_name = user.full_name;
                    chat.user_avatar = user.avatar;
                }
            } catch (error) {

            }

        }
        else {
            chat.user_name = res.locals.user.full_name;
        }
    }
    // console.log(messages);
    let groups = await getChatsHelper(req, res);

    const room_detail = groups.rooms.find((room) => room.id == room_id);
    for (const user of room_detail.users) {
        const info = await User.findOne({
            _id: user.user_id
        }).select('full_name avatar');
    
        user.full_name = info.full_name;
        user.avatar = info.avatar;
    }
  
    if(!property){
        if(room_detail.type =='friend'){
            room_detail.property = 'media';
        }
        else {
            room_detail.property = 'members';
        }
    }
    else {
        room_detail.property = property;
    }
    
    room_detail.users.forEach(user => {

        if (user.user_id == res.locals.user.id) {
            res.locals.user.notification = user.notification;
        }
    });

    res.render('client/pages/chat/roomChat', {
        pageTitle: 'Chat',
        messages: messages,
        friends: groups.user_friends,
        rooms: groups.rooms,
        room_detail: room_detail,
    });

}

// [POST] /chat/create/group
module.exports.creatGroupChat = async (req, res) => {
    const { groupName, ids } = req.body;
    const users_id = ids.split(',');
    const users = [{
        user_id: res.locals.user.id,
        role: 'superAdmin'
    }];
    users_id.forEach(id => {
        const user = {
            user_id: id,
            role: 'member'
        }
        users.push(user);
    });

    const new_group = new RoomChat({
        type: 'group',
        users: users,
        name: groupName
    });

    try {
        await new_group.save();
        users_id.push(res.locals.user.id)
        await User.updateMany({
            _id: { $in: users_id }
        }, {
            $push: {
                group: new_group._id
            }
        });
    } catch (error) {

    }


    res.redirect(`/chat/${new_group.id}`)
    //res.send('ok');
}
