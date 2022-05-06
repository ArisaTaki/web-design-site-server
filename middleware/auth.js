const { verify, decode} = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const { User } = require('../model')
const formatRes = require('../util/formatRes')

module.exports = async (req, res, next) => {
    // 获取数据。从请求头里
    let token = req.headers['authorization']
    token = token ? token.split('Bearer ')[1] : null

    if (!token) {
        return res.status(401).json(formatRes(401, '暂未登陆', {})).end()
    }

    try {
        const decodedToken = await verify(token, jwtSecret)
        const user = await User.findById(decodedToken.userId)
        if (!user) {
            return res.status(401).
            json(formatRes(401, 'authorization error', {})).end()
        }
        req.user = await User.findById(decodedToken.userId)
        next()
    } catch (error) {
       return res.status(401).json(formatRes(401, 'token已经过期，请重新登录', {})).end()
    }
    // 验证token是否有效
    // 无效 -> 响应401状态码
    // 有效 -> 把用户信息读取出来挂载到req请求对象上
    // 继续往后执行
}
