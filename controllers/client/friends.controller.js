const User = require('../../models/user.model');

const friendsSocket = require('../../socket/client/friends.socket');

//[GET] /friends
module.exports.index = async (req, res) => {
    //socket io
    friendsSocket(res);

    const my_id = res.locals.user.id
    const user = await User.findOne({
        _id: my_id
    }).select('-user_token -password')
    const users = await User.find({
        $and: [
            {_id: { $ne: my_id }},
            {_id: {$nin: user.yourRequest}},
            {_id: {$nin: user.requestFriend}},
            //{_id: {$nin: user.friends}}
        ],
        deleted: false,
        status: 'active'
    }).select('full_name email avatar');

    res.render('client/pages/friends/index', {
        pageTitle: 'Mọi người',
        users: users
    });
}

//[GET] /friends/request
module.exports.request = async (req, res) => {
    //socket io
    friendsSocket(res);

    const my_id = res.locals.user.id
    const user = await User.findOne({
        _id: my_id
    }).select('-user_token -password');

    const request = await User.find({
        _id: { $in: user.requestFriend }
    }).select('-user_token -password');

    res.render('client/pages/friends/request', {
        pageTitle: 'Lời mời kết bạn',
        infos: request
    });

    //res.send('ok');

}

//[GET] /friends/request-sent
module.exports.requestSent = async (req, res) => {
    //socket io
    friendsSocket(res);

    const my_id = res.locals.user.id
    const user = await User.findOne({
        _id: my_id
    }).select('-user_token -password');

    const requestSent = await User.find({
        _id: { $in: user.yourRequest }
    }).select('-user_token -password');
    //console.log(requestSent);

    res.render('client/pages/friends/request-sent', {
        pageTitle: 'Lời mời đã gửi',
        users: requestSent
    });
}