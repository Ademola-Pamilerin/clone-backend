const bcrypt = require("bcrypt")


const hash = async (password) => {
    const encryptedPassword = await bcrypt.hash(password, 12)
    return encryptedPassword
}

const compare = async (password, encrypted) => {
    const passwordSame = await bcrypt.compare(password, encrypted)
    return passwordSame
}


module.exports = {
    hash, compare
}