const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const bcrypt = require('bcryptjs');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        User.findOne({ email }, function(err, user) {
            console.log('Within Local Strategy.');
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log('Username Incorrect.');
                return done(null, false, { message: 'Invalid email.' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (!isMatch) {
                    console.log('Password Incorrect');
                    return done(null, false, { message: 'Incorrect Password' });
                }
                console.log('Password Correct.');
                return done(null, user);
            });
        });
    })
);

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            const user = await new User({
                googleId: profile.id,
                username: profile.displayName
            }).save();
            done(null, user);
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: keys.facebookClientID,
            clientSecret: keys.facebookClientSecret,
            callbackURL: '/auth/facebook/callback',
            proxy: true
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ facebookId: profile.id });

            if (existingUser) {
                return done(null, existingUser);
            }

            const user = await new User({
                facebookId: profile.id,
                username: profile.displayName
            }).save();
            done(null, user);
        }
    )
);
