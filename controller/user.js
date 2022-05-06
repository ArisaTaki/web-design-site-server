const { User }  = require('../model')
const { Profile } = require('../model')
const jwt = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const formatRes = require('../util/formatRes')

// 用户注册
exports.register = async (req, res, next) => {
  try {
    // 处理请求
    // 1.获取请求体数据
    console.log(req.body);
    // 2.数据验证
    // 2.1 基本数据验证
    // 2.2 业务数据验证
    // 3.验证通过，将数据保存到数据库
    let user = new User({
      ...req.body.user
    })
    // 保存到数据库
    await user.save()

    // 返回数据的时候不会连带用户的password
    user = user.toJSON()
    delete user.password

    // 4.发送成功响应
    res.status(200).json(formatRes(200, '', {
      user
    }))
  } catch (err) {
    next(err);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  // 1.获取请求体数据
  // 2.数据验证
  // 3.生成token
  const user = req.user.toJSON()
  //第三个参数就是过期时间，设置为一天
  const token = await jwt.sign({
    userId: user._id
  }, jwtSecret, {
    expiresIn: 60 * 60 * 24
  })
  // 4.发送成功响应
  try {
    // 处理请求
    delete user.password
    res.status(200).json(formatRes(200, '', {
      ...user,
      token
    }))
  } catch (err) {
    next(err);
  }
};

// 获取当前登录用户
exports.getCurrentUser = async (req, res, next) => {
  const user = req.user.toJSON()
  try {
    // 处理请求
    res.status(200).json(formatRes(200, '', {
      ...user
    }));
  } catch (err) {
    next(err);
  }
};

// 更新当前登录用户
exports.updateCurrentUser = async (req, res, next) => {
  try {
    // 处理请求

    const newUserInfo = req.body.user
    const user = req.user

    user.email = newUserInfo.email || user.email
    user.username = newUserInfo.username || user.username
    user.bio = newUserInfo.bio || user.bio
    user.image = newUserInfo.image || user.image

    await user.save()

    res.status(200).json(formatRes(200, '', {
      user
    }))
  } catch (err) {
    next(err);
  }
};

// 获取特定用户
exports.getUserInfo = async (req, res, next) => {
  try {
    const user = req.user
    res.status(200).json(formatRes(200, '', {
      user
    }))
  } catch (err) {
    next(err)
  }
}
