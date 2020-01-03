const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
    User.findById(id).then((user: any) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
            User.findOne({ googleId: profile.id }).then((existingUser: any) => {
                if (existingUser) {
                    done(null, existingUser);
                } else {
                    new User({
                        googleId: profile.id,
                        username: profile.displayName
                    })
                        .save()
                        .then((user: any) => done(null, user));
                }
            });
        }
    )
);
