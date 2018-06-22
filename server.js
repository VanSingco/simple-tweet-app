const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const cookieParse = require('cookie-parser');

const {database, secret} = require('./config/secret')

const sessionStore = new MongoStore({url: database, autoReconnect: true});

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose.connect(database, (err) => {
    if (err) {
        console.log('Unable to connect to mongoDB database', err)
    }
    console.log('App connected to mongoDB database')
})

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave:true,
    saveUninitialized: true,
    secret: secret,
    store: sessionStore
}));
app.use(flash());
app.use(cookieParse())
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

io.use(passportSocketIo.authorize({
    cookieParse: cookieParse,
    key: 'connect.sid',
    secret:secret,
    store: sessionStore,
    success: onAuthorizeSuccess,
    fail: onAuthorizeFail
}));

function onAuthorizeSuccess(data, accept) {
    console.log("successful connection");
    accept();
}
function onAuthorizeFail(data, message, error, accept) {
    console.log("Failed connection");
    if(error) accept(new Error(message));
}

require('./realtime/io')(io);

const mainRoutes = require('./routes/main');
const UserRoutes = require('./routes/user');

app.use(mainRoutes);
app.use(UserRoutes);

http.listen(3000, () => {
    console.log('App is starting at port: 3000');
});
