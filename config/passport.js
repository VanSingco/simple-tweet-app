const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
}); 

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, (req, username, password, done) => {
    User.findOne({username},(err, user) => {
        if(err) return done(err);

        if(!user) return done(null, false, req.flash('loginMessage', 'No user found'));

        if (!user.comparePassword(password)) return done(null, false, req.flash('loginMessage', 'Oops! wrong Password'));

        return done(null, user);
    })
}));