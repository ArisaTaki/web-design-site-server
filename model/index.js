const mongoose = require("mongoose");
const { dbUrl } = require('../config/config.default')

// 链接MongoDB数据库
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
// 当连接失败
db.on("error", (error) => {
    console.log('MongoDB 连接失败', error)
});
// 链接成功
db.once("open", () => {
  console.log('数据库连接成功')
});

// 组织导出模型类
module.exports = {
    // 书写的时候是User，数据库里最后是users，这是Mongoose的规则
    User: mongoose.model('User', require('./user')),
}
