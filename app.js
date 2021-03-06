var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Model = require('./model');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

passport.use(new LocalStrategy({usernameField:'usuario',passwordField: 'contrasena'},function(username, password, done){
  new Model.Usuario({nombreUsuario:username}).fetch().then(function(data){
    var user = data;
    if(user === null){
      return done(null,false,{message:'Invalid Username or Password'});
    }
    else{
      user = data.toJSON();
      if(!bcrypt.compareSync(password,user.contrasena)){
        return done(null,false,{message: 'Invalid username or Password'});
      }
      else{
        return done(null,user);
      }
    }
  });
}));


passport.serializeUser(function(user,done){
  done(null,user.nombreUsuario);
});

passport.deserializeUser(function(username,done){
  new Model.Usuario({nombreUsuario: username}).fetch().then(function(user){
    done(null,user);
  })
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret strategic xxzzz code',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
