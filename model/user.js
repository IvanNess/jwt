const mongoose = require('mongoose')
const R = require('ramda')
const Refresh = require('./refresh')

const deviceLimit = 5

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
        //если применять рамду после операции со схемой, то результат будет в свойстве _doc
        console.log('user', R.omit(['password'], user._doc))
        return cb(null, R.omit(['password'], user._doc))
    } catch (err) {
        return cb(err, false)
    }

}

userSchema.methods.validPassword = function (password, cb) {
    return cb(null, this.password === password)
}

userSchema.methods.addRefresh = async function (refreshId, cb) {
    //удалим старые рефрэши

    let newRefreshIds = []
    for (const id of this.refreshIds) {
        const refresh = await Refresh.findById(id)
        console.log('refreshId', id)
        console.log('refresh', refresh)
        const now = Date.now()
        console.log(`${refresh.expiresIn} < ${now}`)
        if (refresh.expiresIn < now) {
            console.log('expired')
            await Refresh.deleteOne({ _id: id })
        } else {
            console.log('not expired')
            newRefreshIds = [...newRefreshIds, id]
        }
    }

    console.log('newRefreshIds', newRefreshIds)
    if (newRefreshIds.length < deviceLimit) {
        console.log('length <=5')
        this.refreshIds = [...newRefreshIds, refreshId]
    } else {
        console.log('length > 5')
        this.refreshIds = [refreshId]
    }
    console.log('this', this)
    await this.save()
    return cb()
}

userSchema.statics.updateRefreshIds = async function ({oldRefresh, newRefresh}, cb) {
    try{
        console.log('update refresh ids')
        console.log('old refresh', oldRefresh)
        const oldRefreshId = oldRefresh._id
        const user = await this.findById(oldRefresh.userId)
        console.log('user', user)
        const newRefreshIds = R.without(oldRefreshId.toString(), user.refreshIds)
        console.log('newRefreshIds', newRefreshIds)
        const withNewRefreshId = [...newRefreshIds, newRefresh._id.toString()]
        console.log('withNewRefreshId', withNewRefreshId)
        user.refreshIds = withNewRefreshId
        await user.save()
        console.log('after update', user)
        //если применять рамду после операции со схемой, то результат будет в свойстве _doc
        console.log('password', user.password)
        const omitPasswordUser = R.omit(['password'], user._doc)
        console.log('omitPasswordUser', omitPasswordUser)
        return cb(false, omitPasswordUser)
    } catch(err){
        return cb(err, null)
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User