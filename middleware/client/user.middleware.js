const User = require('../../models/user.model');

module.exports = async (req, res, next) =>{
    if(req.cookies.user_token){
        const user = await User.findOne({
            user_token: req.cookies.user_token,
            deleted: false
        }).select('-password');

        if(user){
            res.locals.user = user;
        }
    }

    next();
}
