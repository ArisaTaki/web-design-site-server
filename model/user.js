const mongoose = require("mongoose");
const baseModal = require("./base-model");
const md5 = require('../util/md5')

const userSchema = new mongoose.Schema({
    ...baseModal,
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        set: value => md5(value),
        //不会带出password，查询的时候
        select: false
    },
    image: {
        type: String,
        default: null,
    }
});

module.exports = userSchema;
