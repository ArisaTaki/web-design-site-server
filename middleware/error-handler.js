const util = require('util')
const formatRes = require('../util/formatRes')

module.exports = () => {
    return (err, req, res, next) => {
        res.status(500).json(
            formatRes(500, err[0].msg, {
                error: util.format(err)
            })
        )
    }
}
