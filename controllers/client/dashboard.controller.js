module.exports.index = (req, res) => {
    res.render('client/pages/dashboard/index', {
        pageTitle: 'Trang tổng quan'
    })
}