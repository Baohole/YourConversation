const User = require('../models/user.model');

module.exports.register = async (req, res, next) => {
    const { full_name, password, email, confirm_password, username, autoGenerate } = req.body;
    // console.log(username);

    if (!full_name || !password || !email || (!autoGenerate && !username)) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin')
        res.redirect('back');
        return;
    }
    // Check if email exists
    const existingEmail = await User.findOne({
        deleted: false,
        email: email
    });

    if (existingEmail) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect('back');
    }

    // Check if username exists (if not auto-generated)
    if (autoGenerate !== 'on') {
        const existingUsername = await User.findOne({
            deleted: false,
            username: `@${username}`
        });

        if (existingUsername) {
            req.flash('error', 'Username đã tồn tại');
            return res.redirect('back');
        }
    }

    if (password.length < 8) {
        req.flash('error', 'Mật khẩu phải có ít nhất 8 kí tự');
        res.redirect('back');
        return;
    }
    if (password !== confirm_password) {
        req.flash('error', 'Mật khẩu xác nhận không chính xác');
        res.redirect('back');
        return;
    }

    next();

}

module.exports.login = async (req, res, next) => {
    const { password, email } = req.body;
    if (!password || !email) {
        req.flash('error', 'Vui lòng nhập đầy đủ thông tin')
        res.redirect('back');
        return;
    }

    next();
}