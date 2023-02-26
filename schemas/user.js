const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const User_Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: Schema.Types.ObjectId,
        ref: "Token"
    },
    verified: {
        type: Boolean,
        default: false
    },
    code: {
        type: Number
    }
}, {
    timestamps: true
})

module.exports = User_Schema;