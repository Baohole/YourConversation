module.exports = (req, res) => {
    if(req.cookies.user_toke){
        next();
    }
    else{
        res.redirect('/user/login');
    }
}