const mongoose = require("mongoose")
const Schema = mongoose.Schema

const tokenSchema = new Schema({
    token: [],
    refreshToken: [],
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})
module.exports = tokenSchema