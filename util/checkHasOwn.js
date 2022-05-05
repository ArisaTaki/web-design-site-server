const {User} = require("../model");
const {verify} = require("./jwt");
const {jwtSecret} = require("../config/config.default");

module.exports = async (req, data, type) => {
    const getUserInfoByType =  (type) => {
        if (type === 'email') {
            return User.findOne({email: data})
        } else {
            return User.findOne({ username: data })
        }
    }
    const user = await getUserInfoByType(type)
    const reqUserId = (await verify(req.headers.authorization.split('Bearer ')[1], jwtSecret)).userId
    let findUserId = ''
    if (user) {
        findUserId = user._id.toJSON()
    }
    if (user && findUserId !== reqUserId) {
        return true
    }
    return false
}
