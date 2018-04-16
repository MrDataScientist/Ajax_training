import path from 'path';
import express from 'express';
import logger from 'morgan';
import config from './server/config';
const app = express();
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import flash from 'connect-flash';
import socket from 'socket.io'
import { createServer } from 'http'
import routes from './server/routes/index.route';
import passportStrategy from './server/helpers/passport.strategy';
import UserAuthRoute from './server/routes/user.auth.route';
import handleSocket from './server/helpers/handle.socket'

// Attach socket with server
var server = createServer(app); 
var io = socket(server);
handleSocket(io)

// Console the logger
if (config.env === 'development') {
  app.use(logger('dev'));
}

// Middlewares
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.mongo_url)
.then((result) => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB connection error", err);
});

// Set up passport strategy
passportStrategy(passport);

// initialize passport and passport session
app.use(session({ 
    secret: 'passport_secret_key',
    resave: true,
    saveUninitialized: true
   }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

UserAuthRoute(app, passport); // Set up the passport authentication

// Route api
app.use('/api', routes);

// Default - Route WildCard
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname,'dist','index.html'));
});

// Start Server
server.listen(config.port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Listening on ${config.base_url}`);
});