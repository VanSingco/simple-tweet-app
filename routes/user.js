const router = require('express').Router();
const passport = require('passport');
const _ = require('lodash');

const passportConfig = require('../config/passport');
const User = require('../models/user');

router.route('/signup')
    .get((req, res, next) => {
        res.render('accounts/signup', {message: req.flash('errors')})
    })
    .post((req, res, next) => {
        if (req.body.email && req.body.name && req.body.username && req.body.password) {
            User.findOne({email: req.body.email}).then((existingUser) => {
                if (existingUser) {
                    req.flash('errors', 'Email is already taken');
                    res.redirect('/signup');
                } else {
                   User.findOne({username: req.body.username}).then((userExist) => {
                        if (userExist) {
                            req.flash('errors', 'Username is already taken');
                            res.redirect('/signup');
                        }else{
                             const user = new User();
                             user.email = req.body.email;
                             user.name = req.body.name;
                             user.username = req.body.username.replace(/\s/g, '');// remove space
                             user.photo = user.gravatar(200);
                             user.password = req.body.password;
                             user.save((err) => {
                                 req.logIn(user, (err) => {
                                     if (err) {
                                         return next(err.message);
                                     }
                                     return res.redirect('/');
                                 })
                             });
                        }
                   }).catch((err) => {
                       
                   });
                }
            }).catch((err) => {
                // none
            });
        }else{
            req.flash('errors', 'All fields are required');
            res.redirect('/signup');
        }
    });

router.route('/login')
    .get((req, res, next) => {
        if(req.user) return res.redirect('/');
        res.render('accounts/login', {message: req.flash('loginMessage')})
    })
    .post(passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});



    module.exports = router;