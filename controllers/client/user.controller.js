const User = require('../../models/user.model');

const md5 = require('md5');
const jwt = require('jsonwebtoken');

//[GET] /user/login
module.exports.login = (req, res) => {
   
    res.render('client/pages/user/login', {
        pageTitle: 'Đăng nhập'
    })
}

//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
            email: email,
            password: md5(password)
        });
        if (user) {
            if (req.body.remember) {
                const maxAge = 1000 * 60 * 60 * 24 * 365
                res.cookie('user_token', user.user_token, { maxAge: maxAge });
            }
            else {
                res.cookie('user_token', user.user_token);
            }
            res.redirect('/chat');
        }
        else {
            req.flash('error', "Sai tài khoản hoặc mật khẩu");
            res.redirect('back');
            return;
        }

    } catch (error) {
        req.flash('error', "Đăng nhập thất bại");
        res.redirect('back');
        return;
    }
}


//[GET] /user/register
module.exports.register = (req, res) => {
   
    res.render('client/pages/user/register', {
        pageTitle: 'Đăng ký'
    })
}

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
    req.body.password = (md5(req.body.password));
    req.body.user_token = jwt.sign(req.body.email, process.env.JWT_SECRECT);
    req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.full_name}&background=random`
    try {
        const user = new User(req.body);
        await user.save();
        res.cookie('user_token', user.user_token);

        res.redirect('/chat');
    } catch (error) {
        req.flash('error', "Tạo tài khoản thất bại!!");
        res.redirect('back');
    }
}

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie('user_token');
    res.redirect('/');
}
