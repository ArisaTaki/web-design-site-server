const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const errorHandler = require('./middleware/error-handler')
const router = require('./router/index')
require('./model')

const app =express()

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const PORT = process.env.PORT || 3003

// 挂载路由
app.use('/api', router)

// 挂载统一处理服务端错误的中间件
app.use(errorHandler())

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})


