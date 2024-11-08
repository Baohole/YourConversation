module.exports = (req, res, next) => {
    const {groupName, ids} = req.body;

    if(!groupName.length){
        req.flash('error', "Vui lòng nhập tên nhóm");
    }
    else if(!ids.length){
        req.flash('error', "Vui lòng ít nhất 1 người tham gia");
    }
    else{
        next();
        return;
    }

    res.redirect('back');
}