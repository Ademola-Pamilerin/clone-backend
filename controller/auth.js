const UserModel = require("../model/user")
const { hash, compare } = require("../util/password")
const TokenModel = require("../model/token")
const { getAccessToken, getRefreshToken } = require("../util/token")
const { validationResult } = require("express-validator")
const validator = require("validator")
const crypto = require("crypto")

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
                    await getAccessToken({ email: email.trim(), _id: user._id, username: user.username })
                ],
                user: user._id
            })
            user.token = tokenVal._id

            const val = crypto.randomBytes(3).reduce((acc, value) => acc + value.toString(16).padStart(2, '0'), '').substr(0, 6)
            user.code = val

            //send mail with val

            await tokenVal.save()
            await user.save()
            res.status(200).json({ message: "Welcome " + firstname, refreshToken: tokenVal.refreshToken[0].value, AccessToken: tokenVal.token[0].value });
        }
        catch (error) {
            res.status(error.status ? error.status : 500).json({ message: error.message })
        }
    },
    login: async (req, res, next) => {
        try {
            const { value, password } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let error = errors.errors[0].msg;
                return next({ message: error, status: 400 });
            }
            const typeEntered = validator.isEmail(req.body.value.trim())
            let user;
            if (typeEntered) {
                user = await UserModel.findOne({ email: value.trim() })
            } else {
                user = await UserModel.findOne({ username: value.trim() })
            }
            if (!user) {
                return next({ message: `invalid credentials`, status: 400 })
            }
            const Match = compare(password, user.password)
            if (!Match) {
                return next({ message: `invalid credentials`, status: 400 })
            }

            const token = getAccessToken({ _id: user._id, email: user.email, username: user.username })
            const token_data = await TokenModel.findOne({ user: user._id, _id: user.token })

            const newVal = token_data.token.filter(el => {
                return el.expiresIn > new Date().getTime()
            })
            token_data.token = [...newVal, token]
            await token_data.save()
            res.status(200).json({ token: token, refresh_token: token_data.refreshToken, id: user._id })
        } catch (error) {
            if (!error.status) {
                error.status = 500
            }
            res.status(error.status).json({ message: error.message })
        }
    },
    checkforvalidemail: async (req, res, next) => {
        try {
            const { value } = req.body;
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let error = errors.errors[0].msg;
                return next({ message: error, status: 400 });
            }
            let typeInput = validator.isEmail(value);
            let user;
            if (typeInput) {
                user = await UserModel.findOne({ email: value.trim() })
            } else {
                user = await UserModel.findOne({ username: value.trim() })
            }
            if (!user) {
                return next({ message: "User not found", status: 500 })
            }
            res.status(200).json({ message: "user found" })
        }
        catch (error) {
            res.status(error.status ? error.status : 500).json({ message: error.message })
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { value, password, confirm } = req.body;
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let error = errors.errors[0].msg;
                return next({ message: error, status: 400 });
            }
            let typeInput = validator.isEmail(value);
            let user;
            if (typeInput) {
                user = await UserModel.findOne({ email: value.trim() })
            } else {
                user = await UserModel.findOne({ username: value.trim() })
            }
            if (!user) {
                return next({ message: "User not found", status: 500 })
            }
            if (password !== confirm) {
                return next({ message: "Password does not match", status: 500 })
            }
            const newPass = await hash(password)
            user.password = newPass
            await user.save()
            res.status(200).json({ message: "password updated successfully" })
        }
        catch (error) {
            res.status(error.status ? error.status : 500).json({ message: error.message })
        }
    },
    verifyAcc: async (req, res, next) => {
        try {
            const { code, id } = req.body
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                let error = errors.errors[0].msg;
                return next({ message: error, status: 400 });
            }
            const user = await UserModel.findOne({ _id: id })
            if (!user) {
                return next({ message: "Please request a new code", status: 500 })
            }
            if (user.code !== code) {
                return next({ message: "Please request a new code", status: 500 })
            }
            user.code = 0
            await user.save()
            res.status(200).json({ message: "successfully verified your account" })

        }
        catch (error) {
            if (!error.status) {
                error.status = 500
            }
            res.status(error.status).json({ message: error.message })
        }
    },
    requestVerificationMail: async (req, res, next) => {
        //send mail with user code attached
    }
}
module.exports = controller