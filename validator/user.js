const validate = require('../middleware/validator')
const { body, param } = require("express-validator");
const { User } = require("../model");
const md5 = require('../util/md5')
const {Promise} = require("mongoose");
const checkHasOwn = require('../util/checkHasOwn')

exports.register = validate([
    // 1.配置验证规则
    body('user.username')
        .notEmpty().withMessage('用户名不能为空')
        .custom(async username => {
            const user = await User.findOne({username})
            if (user) {
                return Promise.reject('用户名已存在')
            }
        }),
    body('user.password').notEmpty().withMessage('密码不能为空'),
    body('user.email').notEmpty().withMessage('邮箱不能为空')
        .isEmail().withMessage('邮箱格式不正确')
        // bail：前面验证失败就不会往后执行了
        .bail()
        .custom(async email => {
            const user = await User.findOne({email})
            if (user) {
                return Promise.reject('邮箱已存在')
            }
        })
])

exports.login = [
    validate([
        body('user.email').notEmpty().withMessage('邮箱不能为空'),
        body('user.password').notEmpty().withMessage('密码不能为空')
    ]),
    //上面的validate通过之后才能来到接下来的程序
    validate([
        body('user.email').custom(async (email, { req }) => {
           const user = await User.findOne({ email }).select(['email', 'username', 'bio', 'image', 'password'])
            if (!user) {
                return Promise.reject('用户不存在')
            }
            //将数据挂载到请求对象中，后续的中间件就可以直接使用了
            req.user = user
        })
    ]),
    // 当用户存在的时候才到达这个中间件
    validate([
        body('user.password').custom(async (password, {req}) => {
            if (md5(password) !== req.user.password) {
                return Promise.reject('密码错误')
            }
        })
    ])
]

exports.update = validate([
    body('user.email').notEmpty().withMessage('您的新邮箱不能为空').bail()
        .isEmail().withMessage('新邮箱格式不正确')
        .bail()
        .custom(async (email, { req }) => {
            const type = 'email'
            if (await checkHasOwn(req, email, type)) {
                return Promise.reject('邮箱已被注册')
            }
        }),
    body('user.username').notEmpty().withMessage('您的新用户名不能为空')
        .custom(async (username, { req }) => {
            const type = 'username'
            if (await checkHasOwn(req, username, type)) {
                return Promise.reject('用户名已被注册')
            }
        }),
])

exports.findUser = async (req, res, next) => {
    const username = req.params.username
    const user = await User.findOne({username})
    if (!user) {
        return res.status(404).end()
    }
    req.user = user
    next()
}
