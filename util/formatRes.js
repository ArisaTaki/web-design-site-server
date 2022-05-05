module.exports = (code ,msg, data) => {
    return {
        message: msg,
        code: code,
        data: {
            ...data
        }
    }
}
