const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT =  require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model('user')
const keys = require('./keys')

const options = {}

options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken()
options.secretOrKey = keys.secret

module.exports = passport => {
    passport.use(new JWTstrategy(options, (jwt_payload, done) => {
        console.log(jwt_payload)
    }))
}