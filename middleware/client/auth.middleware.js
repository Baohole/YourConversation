module.exports = (req, res, next) => {
    if(req.cookies.user_token){
        next();
    }
    else{
        res.redirect('/user/login');
    }
}