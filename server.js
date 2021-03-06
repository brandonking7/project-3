const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);


require('dotenv').config();
require('./server/helpers/passport.js')(passport);
require('./server/helpers/socketio.js')(io);

const usersController = require('./server/controllers/users.js');
const gamesController = require('./server/controllers/games.js');
const authController = require('./server/controllers/auth.js');

app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({ secret: 'cornholeforever', resave: true, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

app.use('/', authController(passport));
app.use('/api/users/', usersController);
app.use('/api/games/', gamesController);

const port = process.env.PORT;
http.listen(port, function(){
  console.log(`Server listening on port: ${port}.`);
});
