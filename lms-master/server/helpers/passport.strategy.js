import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import config from '../config'
import User from '../models/user.model';
import { AuthController } from '../controllers/auth.controller';

const AuthCtrl = new AuthController();

const passportStrategy = (passport) => {
    // serialize and deserialize
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user){
            if(!err) done(null, user);
            else done(err, null);
        });
    });
    passport.use(new GoogleStrategy({
        clientID: config.google.clientID,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL
        },
        function(request, accessToken, refreshToken, profile, done) {
            AuthCtrl.findOrCreateUser(profile, done);
        }
    ));
}

export default passportStrategy