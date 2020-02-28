const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    refreshIds: [String],
    t: Number
})

userSchema.statics.findUserByName = function(username, cb){
    console.log('username', username)
    return this.findOne({username: username}, cb)
}

userSchema.methods.validPassword  = function(password, cb){
    return cb(null, this.password === password)
}

const User = mongoose.model('User', userSchema)

module.exports = User