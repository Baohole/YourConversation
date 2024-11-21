const User = require('../../models/user.model');

module.exports = async (req, res, next) =>{
    if(req.cookies.user_token){
        const user = await User.findOne({
            user_token: req.cookies.user_token,
            deleted: false
        }).select('-password');
        user.username = user.username.split('@')[1];
        if(user){
            // const my_id = res.locals.user.id
            // const user = await User.findOne({
            //     _id: my_id
            // }).select('-user_token -password');
        
            const request = await User.find({
                _id: { $in: user.requestFriend }
            }).select('-user_token -password');
            user.requestFriend = request;
            res.locals.user = user;
        }
    }

    next();
}
