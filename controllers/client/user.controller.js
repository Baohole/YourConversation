const User = require('../../models/user.model');

const md5 = require('md5');
const jwt = require('jsonwebtoken');

const UsernameHelper = require('../../helper/FullnameToUsername.helper');
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
    req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.full_name}&background=random`;
    try {
        const user = new User(req.body);
        // console.log(user);
        if (user.username) {
            user.username = `@${user.username}`;
        }
        else {
            const buffer = Buffer.from(user._id, 'hex');
            const decodedString = buffer.toString('ascii');
            user.username = `@${UsernameHelper(user.full_name)}${decodedString.replace(/[^a-zA-Z]/g, '')}`;
        }

        // console.log(user.username);
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


//[PATCH] /profile/edit/:id
module.exports.editProfile = async (req, res) => {
    console.log(req.body);
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            req.flash('error', "Tài khoản không còn tồn tại!!");
            // return res.redirect('back');
        }
        const { full_name, phone, avatar } = req.body;
        if (phone) {
            user.phone = req.body.phone;
        }
        if (avatar) {

            user.avatar = avatar;
        }
        user.full_name = full_name;
        user.email = email;
        console.log(user);
        // await user.save();
        // res.redirect('/profile');
    } catch (error) {
        req.flash('error', "Cập nhật thông tin thất bại!!");
        // res.redirect('back');
    }
    res.send('ok');

}