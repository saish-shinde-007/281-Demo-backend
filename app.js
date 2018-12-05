var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('client-sessions');
var mongoose=require('mongoose');
var index = require('./routes/index');
var operations = require('./routes/operations');
var logout = require('./routes/logout');
var app = express();
var passport = require('passport');
// var mongoSessionURL = "mongodb://localhost:27017/sessions";
var expressSessions = require("express-session");
require('./routes/mongodb/login')(passport);
var mongoStore = require('connect-mongo')(expressSessions);

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
app.use('/operations', operations);
app.listen(3001,console.log('React App Listening on port 3001!'));

app.post('/logout',logout.logout);
module.exports = app;
