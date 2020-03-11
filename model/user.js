const mongoose = require('mongoose')
const R = require('ramda')

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    refreshIds: [String],
    role: String,
    t: Number
})

userSchema.statics.findUserByName = function (username, cb) {
    console.log('username', username)
    return this.findOne({ username: username }, cb)
}

userSchema.statics.findUserById = async function (userId, cb) {
    console.log('find user by id', userId)
    try {
        const user = await this.findById(userId)
        console.log('user', R.omit(['password'], user._doc))
        return cb(null, R.omit(['password'], user._doc))
    } catch(err){
        return cb(err, false)
    }
    
}

userSchema.methods.validPassword = function (password, cb) {
    return cb(null, this.password === password)
}

const User = mongoose.model('User', userSchema)

module.exports = User