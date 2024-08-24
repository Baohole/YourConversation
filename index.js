const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const database = require('./config/database');

const app = express();

const server = http.createServer(app);
const io = new Server(server);
global._io = io;

require('dotenv').config();

const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser('612Gasd0q)'));
app.use(session({ cookie: { maxAge: 6000 }}));
app.use(flash());
app.use(methodOverride('_method'));

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`));

const userRouter = require('./routers/client/index.router');
userRouter(app);

database.connect();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});