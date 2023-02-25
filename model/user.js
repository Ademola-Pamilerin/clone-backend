const user_schema = require("../schemas/user")
const mongoose = require("mongoose");

const UserModel = mongoose.model("User", user_schema)

module.exports = UserModel