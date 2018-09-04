const mongoose = require('mongoose')
const Schema  = mongoose.Schema

const ProfileSchema = new Schema({
    user : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    handle: {
        type: String,
        required: true,
        max: 20
    },

    occupation : {
        type: String,
        required: true
    },

    location : {
        type: String
    },

    interests : {
        type: [String],
        required: true
    },

    bio: {
        type: String
    },

    social : {
        facebook : {
            type: String
        },

        twitter: {
            type: String
        },

        instagram: {
            type : String
        }
    },

    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model('profile', ProfileSchema)