var jwt = require('jsonwebtoken')

const createTokens = ({userId, fingerprint, SECRET, Refresh, accessSecLifeTime, refreshMillisecLifeTime}) =>{
  const access = jwt.sign({ userId }, SECRET, { expiresIn: accessSecLifeTime })
  //создать рефрэш и сохранить параметры в бд.
  const now = new Date()
  console.log('now', Number(now))
  const refresh = new Refresh({
      "userId": userId,
      //"ua": String, /* user-agent */
      "fingerprint": fingerprint,
      //"ip": String,
      "expiresIn": Number(now) + refreshMillisecLifeTime,
      "createdAt": now,
      "updatedAt": now
  })
  return {access, refresh}
}

module.exports.createTokens = createTokens