const User = require('../models/user.model');
const RoomChat = require('../models/room_chat.model');

const getDetail = async (_id, groups) => {
    let user_friends = [];
    for (let group of groups) {
        if (group.type == 'friend') {
            for (let user of group.users) {
                const user_info = await User.findOne({
                    _id: user.user_id,
                    deleted: false
                }).select('full_name avatar');
                if (user.user_id != _id) {
                    group.name = user_info.full_name;
                    group.avatar = user_info.avatar;

                    user_friends.push(user_info);
                }

                user.full_name = user_info.full_name;
                user.avatar = user_info.avatar;
            }
        }
    }

    return {
        rooms: groups,
        user_friends: user_friends
    }

}

module.exports = async (req, res) => {
    const _id = res.locals.user.id;

    // const user = await User.findOne({
    //     _id: _id,
    //     deleted: false
    // }).select('-password -user_token');

    //const rooms = user.friends;
    let groups = await RoomChat.find({
        deleted: false,
        'users.user_id': res.locals.user.id
    });

    let rooms = await getDetail(_id, groups);
    rooms.rooms.sort((a, b) => {
        return a.updatedAt > b.updatedAt
    });

    return rooms;
}