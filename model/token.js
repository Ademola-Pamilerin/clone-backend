const tokenSchema = require("../schemas/token")
const mongoose = require("mongoose")

const TokenModel = mongoose.model("Token", tokenSchema)
module.exports = TokenModel;