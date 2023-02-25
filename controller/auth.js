const UserModel = require("../model/user")
const { hash, compare } = require("../util/password")
const TokenModel = require("../model/token")
const { getAccessToken, getRefreshToken } = require("../util/token")
const { validationResult } = require("express-validator")

const controller = {
    register: async (req, res, next) => {
        try {
            const { firstname, lastname, email, password, username } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let error = errors.errors[0].msg;
                return next({ message: error, status: 400 });
            }
            let user = await UserModel.findOne({ username })
            if (user) {
                return next({ message: "User with username already exist", status: 400 })
            }
            user = await UserModel.findOne({ email })
            if (user) {
                return next({ message: "User with email already exist", status: 400 })
            }
            const new_password = await hash(password)
            user = new UserModel({ firstname: firstname.trim(), lastname: lastname.trim(), email: email.trim(), password: new_password, username: username.trim() })
            let tokenVal = new TokenModel({
                refreshToken: [
                    getRefreshToken()
                ],
                token: [
                    await getAccessToken({ email: email.trim(), _id: user._id })
                ],
                user: user._id
            })
            user.token = tokenVal._id
            await tokenVal.save()
            await user.save()
            res.status(200).json({ message: "Welcome " + firstname, refreshToken: tokenVal.refreshToken[0].value, AccessToken: tokenVal.token[0].value });
        }
        catch (error) {
            res.status(error.status ? error.status : 500).json({ message: error.message })
        }
    }


}
module.exports = controller