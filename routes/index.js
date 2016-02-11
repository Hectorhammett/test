var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var Model = require('../model.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/login',function(req,res,next){
  res.render('login');
});

router.post('/login',function(req,res,next){
  passport.authenticate(
      'local',
      { successRedirect: '/users/',
      failureRedirect: '/login'},
      function(err, user, info) {
      if(err) {
         console.error("Error en err",err);
         return res.redirect("/login");;
      }
      if(!user) {
         console.error("Error en !user",err);
         return res.redirect("/login");;
      }
      return req.logIn(user, function(err) {
         if(err) {
            console.error("Error en login",err);
            return res.redirect('/login');
         } else {
            return res.redirect('/users/',{
              usuario:user
            });
         }
      });
   })(req, res, next);
});

router.get('/signin',function(req,res,next){
  res.render('signin');
});

router.post('/signin',function(req,res,next){
  var user = req.body;
  var usernamePromise = null;
  usernamePromise = new Model.Usuario({nombreUsuario:user.username}).fetch();
  usernamePromise.then(function(model){
    if(model){
      res.send('El usuario ya existe');
    } else {
      var password = user.contrasena;
      var hash = bcrypt.hashSync(password);

      var signUpUser =  new Model.Usuario({nombreUsuario: user.usuario, contrasena: hash});

      signUpUser.save().then(function(){
        res.redirect('/login');
      });
    }
  });
});

module.exports = router;
