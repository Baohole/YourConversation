const homeRouter = require('./home.router');
const userRouter = require('./user.router');
const chatRouter = require('./chat.router');
const friendsRouter = require('./friends.router');

const authMiddleware = require('../../middleware/client/auth.middleware');
const userMiddleware = require('../../middleware/client/user.middleware');

module.exports = (app) => {
    app.use('/', homeRouter);

    app.use(userMiddleware);

    app.use('/user', userRouter);

    app.use('/friends',  authMiddleware, friendsRouter);

    app.use('/chat', authMiddleware,  chatRouter);
} 