const crypto = require('crypto')

module.exports = str => {
    //使用md5加密，转换为十进制
    return crypto.createHash('md5').update(`eiko${str}`).digest('hex')
}
