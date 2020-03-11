const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var jwt = require('jsonwebtoken')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
const R = require('ramda')

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')

const User = require('./model/user')
const Refresh = require('./model/refresh')

const createTokens = require('./utilities').createTokens

mongoose.connect('mongodb+srv://netninja:113720@ch-cluster-q8e41.mongodb.net/test',
    { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', err => {
    console.log('error connection', err)
})

const SECRET = 'secret_foo'

// passport.serializeUser((user, done)=>{
//     console.log('serialize', user)
//     //done(null, user.id)
//     done(null, user._id)
// })

// passport.deserializeUser((id, done)=>{
//     console.log('deserialize')

//     User.findById(id).then(user=>{
//         console.log('deserialize')
//         done(null, user)
//     })
// })

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromBodyField('access');
opts.secretOrKey = SECRET;
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    //если неправильный токен, то он сюда даже и не попадет.
    console.log('jwt', jwt_payload)
    if (jwt_payload) {
        console.log('jwt', jwt_payload)

        User.findUserById(jwt_payload.userId, function (err, user) {
            console.log('jwt found user', user)
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
        //return done(null, jwt_payload)
    }

    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });
}));

passport.use(new LocalStrategy(
    function (username, password, done) {
        console.log('localStrategy')
        console.log('data', username, password)
        console.log('User', User)
        User.findUserByName(username, function (err, user) {
            console.log('found user', user)
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            user.validPassword(password, (err, isValid) => {
                console.log(isValid)
                if (err) { return done(err); }
                if (!isValid) { return done(null, false, { message: 'Incorrect password.' }) }
                return done(null, user);
            })
        });
    }
));

const app = express()

app.use(
    cors({
        origin: "http://localhost:3000", // allow to server to accept request from different origin
        //methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        //credentials: true // allow session cookie from browser to pass through
    })
);

app.use(bodyParser.json()); //чтобы парсить json
//app.use(bodyParser.urlencoded({ extended: true })); //чтобы парсить данные формы

app.use(passport.initialize())
//app.use(passport.session())

app.get('/', (req, res) => {
    res.send('hello world!')
})

app.post('/profile',
    (req, res, next) => {
        console.log('get profile', req.body.access)
        const refreshId = req.body.refresh
        passport.authenticate('jwt', (err, user, next) => {
            console.log('jwt authenticate', err, user)
            if (!user || err) {
                res.send({ message: 'access denied' })
            } else {
                res.send({ message: 'access allowed', user })
            }
        })(req, res, next)
    }
)
//     passport.authenticate('jwt', {
//         successRedirect: '/success',
//         failureRedirect: '/login',
//     })
// )

app.post('/refresh', async (req, res, next) => {
    console.log('refresh', req.body)
    const refreshId = req.body.refresh
    const fingerprint = req.body.fingerprint
    try {
        const refresh = await Refresh.findById(refreshId)
        const now = Number(new Date())
        console.log('date', now, refresh.expiresIn)
        if (refresh.fingerprint === fingerprint && now <= refresh.expiresIn) {
            const { access: newAccess, refresh: newRefresh } = createTokens({ userId: refresh.userId, accessSecLifeTime: 60, refreshMillisecLifeTime: 6 * 60 * 1000, fingerprint, SECRET, Refresh })
            await newRefresh.save()
            //отправить рефрэш и эксэс токен в респонсе
            Refresh.findByIdAndDelete(refreshId, (err, res) => {
                console.log('deleted', err, res)
            })
            User.findUserById(refresh.userId, (err, user) => {
                if (err) {
                    res.send({ message: err })
                } else if (user) {
                    res.send({
                        access: newAccess,
                        refresh: newRefresh._id,
                        user,
                        message: 'refresh is valid and updated'
                    })
                }
            })
        } else {
            Refresh.findByIdAndDelete(refreshId)
            res.send('refresh is out of date or missmatched fingerprint')
        }
    } catch (err) {
        console.log(err)
        res.send('refresh is invalid')
    }
})

// app.get('/login', (req, res, next)=>{
//     res.send('failure to login')
// })

// app.get('/success', (req, res, next)=>{
//     console.log('success', req.body)
// })

app.post('/',

    // passport.authenticate('local', (username, password, done)=>{
    //     console.log('username', username)
    //     console.log('password', password)
    // }),

    (req, res, next) => {
        console.log('post')
        console.log(req.body)
        passport.authenticate('local', async (err, user, done) => {
            console.log('user', user)
            //res.append('user', user)
            if (!user) {
                return res.send('Incorrect user or password.')
            }
            const fingerprint = req.body.fingerprint
            const { access, refresh } = createTokens({ userId: user._id, fingerprint, accessSecLifeTime: 60, refreshMillisecLifeTime: 6 * 60 * 1000, SECRET, Refresh })
            await refresh.save()
            //отправить рефрэш и эксэс токен в респонсе
            res.send({
                access,
                refresh: refresh._id
            })
            //res.redirect('http://localhost:3000')
            //next(null, token)

            //создать эксэс и рефреш токены, отослать юзеру
        })(req, res, next)
    },


    // passport.authenticate('local', 
    // { successRedirect: '/', failureRedirect: '/login' }
    // )
)

app.post('/create', async (req, res, next) => {
    console.log('create', req.body)
    const user = req.body
    const dbUsernameCheck = await User.findOne({ 'username': req.body.username })
    if (dbUsernameCheck) {
        return res.send('Username is not available. Lets try another name.')
    }
    new User({ ...user }).save(async (err, user) => {
        const fingerprint = req.body.fingerprint
        console.log('user', user, user._id)
        const { access, refresh } = createTokens({ userId: user._id, fingerprint, SECRET, Refresh, accessSecLifeTime: 60, refreshMillisecLifeTime: 6 * 60 * 1000 })
        await refresh.save()
        //отправить рефрэш и эксэс токен в респонсе
        res.send({
            access,
            refresh: refresh._id
        })
    })
})

db.once('open', () => {
    app.listen(4000, () => {
        console.log('server is running')
    })
})