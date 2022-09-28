const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require("passport-facebook").Strategy

module.exports = () => {

    passport.use(new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "https://mystyle.codestreak.in/auth/google/myStyle",
        scope: ['email', 'profile']
    },
        function (accessToken, refreshToken, profile, done) {
            //check user table for anyone with a facebook ID of profile.id
            User.findOne({
                $or: [
                    { 'google.id': profile.id },
                    { 'email': profile.emails[0].value }
                ]
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                //No user was found... so create a new user with values from google (all the profile. stuff)
                if (user) {
                    if (!user.google.id) {
                        user.google.id = profile.id
                        user.google.token = accessToken;
                        user.google.email = profile.emails[0].value;
                        user.google.name = profile.displayName;
                        user.save();
                    }
                    return done(null, user);
                } else {
                    let newUser = new User()
                    newUser.name = profile.displayName
                    newUser.email = profile.emails[0].value
                    newUser.isVerified = true
                    newUser.havePassword = false
                    newUser.google.id = profile.id
                    newUser.google.token = accessToken
                    newUser.google.email = profile.emails[0].value
                    newUser.google.name = profile.displayName

                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                            throw err
                        }
                        return done(null, newUser);
                    });
                }
            })
        })
    )

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "https://mystyle.codestreak.in/auth/facebook/myStyle",
        profileFields: ['id', 'displayName', 'email']
    },
        function (accessToken, refreshToken, profile, done) {
            //check user table for anyone with a facebook ID of profile.id
            User.findOne({
                $or: [
                    { 'facebook.id': profile.id },
                    { 'email': profile.emails[0].value }
                ]
            }, function (err, user) {
                if (err) {
                    return done(err);
                }
                //No user was found... so create a new user with values from google (all the profile. stuff)
                if (user) {
                    if (!user.facebook.id) {
                        user.facebook.id = profile.id
                        user.facebook.token = accessToken;
                        user.facebook.email = profile.emails[0].value;
                        user.facebook.name = profile.displayName;
                        user.save();
                    }
                    return done(null, user);
                } else {
                    let newUser = new User()
                    newUser.name = profile.displayName
                    newUser.email = profile.emails[0].value
                    newUser.isVerified = true
                    newUser.havePassword = false
                    newUser.facebook.id = profile.id
                    newUser.facebook.token = accessToken
                    newUser.facebook.email = profile.emails[0].value
                    newUser.facebook.name = profile.displayName

                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                            throw err
                        }
                        return done(null, newUser);
                    });
                }
            })
        })
    )
}



