const homeRouter = require('./home.router');
const userRouter = require('./user.router');
const dashboardRouter = require('./dashboard.router');

const authMiddleware = require('../../middleware/client/auth.middleware');

module.exports = (app) => {
    app.use('/', homeRouter);

    app.use('/user', userRouter);
    
    app.use('/dashboard', dashboardRouter);

} 