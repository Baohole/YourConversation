const User = require('../../models/user.model');

//[GET] /user
module.exports.index = (req, res) => {
    res.send('ok');
}

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
                res.cookie('cart_id', cart.id, { maxAge: maxAge });
            }
            else {
                res.cookie('cart_id', cart.id);
                res.cookie('user_token', user.user_token);
            }

            res.redirect('/');
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

