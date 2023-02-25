const express = require("express")
const auth_controller = require("../controller/auth")
const JOI = require("joi")
const validator = require("express-joi-validation").createValidator()
const { check } = require("express-validator")


const register = JOI.object({
    username: JOI.string().min(3).max(15).required(),
    email: JOI.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', "edu", "ng"] } }).required(),
    password: JOI.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*~`]{3,30}$')).required().min(8).max(20),
    firstname: JOI.string().required().min(3).max(20),
    lastname: JOI.string().required().min(3).max(20)
})

const route = express.Router();

route.post("/register", async (req, res, next) => {
    try {
        const value = await register.validateAsync(
            { username: req.body.username, email: req.body.email, password: req.body.password, firstname: req.body.firstname, lastname: req.body.lastname }
        )
        return next()
    }
    catch (error) {
        return next({ message: error.message, status: 500 })
        // console.log(error.message);
    }
}, [
    check("email").isEmail().withMessage("Please Enter valid Email Address"),
    check("password").isStrongPassword().withMessage(
        "Password must contain a special character, a capital letter and greater than 8 characters"
    )
], auth_controller.register)



module.exports = route