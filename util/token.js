const jwt = require('jsonwebtoken');
const crypto = require("crypto")

const getAccessToken = (data) => {
    const token = jwt.sign({ data }, process.env.JWT_SECRET, {
        expiresIn: "2hr"
    })
    return {
        value: token,
        expiresIn: new Date(new Date().getTime() + 7200000).getTime()
    }

}

const getRefreshToken = () => {
    const val = crypto.randomBytes(120);
    const cryptoVal = val.toString("hex");
    return {
        value: cryptoVal,
        expiresIn: new Date(new Date().getTime() + 7257600000).getTime()
    };
}


module.exports = {
    getAccessToken,
    getRefreshToken
}