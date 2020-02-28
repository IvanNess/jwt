const mongoose = require('mongoose')

const refreshShema = mongoose.Schema({
    "userId": String,
    "ua": String, /* user-agent */
    "fingerprint": String,
    "ip": String,
    "expiresIn": Number,
    "createdAt": Number,
    "updatedAt": Number
})

const Refresh = mongoose.model('Refresh', refreshShema)

module.exports = Refresh