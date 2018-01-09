const rp = require('request-promise')
const jwt = require('jsonwebtoken')
const Router = require('koa-router')
const config = require('config')

const router = Router()

router.post('/auth/login', async (ctx, next) => {
  const params = ctx.request.body

  try {
    const response = await rp({
      method: 'POST',
      url: config.auth_store_url,
      json: true,
      body: {
        username: params.username,
        password: params.password
      }
    })

    if (response && response.user) {

      const allRoles = Object.keys(response.user.roles).map(key => response.user.roles[key])

      const user = {
        id: parseInt(response.user.uid),
        username: response.user.name,
        email: response.user.mail,
        roles: []
      }

      if (allRoles.includes('oos admin')) {
          user.roles.push('admin')
      }
      if (allRoles.includes('oos viewer')) {
          user.roles.push('viewer')
      }

      if (!user.roles.includes('admin') && !user.roles.includes('viewer')) {
        return ctx.throw(401, 'No permissions')
      }

      const token = jwt.sign({
        iss: user.id,
        user
      }, config.jwt.secret, config.jwt.options)

      ctx.set('Authorization', 'Bearer ' + token)
      ctx.body = true
    } else {
      return ctx.throw(401, 'Bad credentials')
    }
  } catch (err) {
    ctx.throw(401, err)
  }

})

// authentication middleware
router.use(async (ctx, next) => {
  // return await next()

  var token, payload, parts, scheme, credentials
  if (ctx.header.authorization) {
    parts = ctx.header.authorization.split(' ')
    if (parts.length === 2) {
      scheme = parts[0]
      credentials = parts[1]
      if (/^Bearer$/i.test(scheme)) {
        token = credentials
      }
    } else {
      ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"')
    }
  }
  if (ctx.query.token) {
    token = ctx.query.token
  }

  ctx.assert(token, 401, 'No Authorization header found')

  try {
    payload = jwt.verify(token, config.jwt.secret, {})
  } catch (e) {
    ctx.throw(401, 'Invalid token - ' + e.message)
  }

  if (payload) {
    ctx.state.user = payload.user
    ctx.state.token = token

    if (ctx.state.user) {
      await next()
    } else {
      ctx.throw(401, 'User not found')
    }
  }
})

router.get('/auth/refresh', async (ctx, next) => {
  const token = jwt.sign({
    iss: ctx.state.user.id,
    user: ctx.state.user
  }, config.jwt.secret, config.jwt.options)

  ctx.set('Authorization', token)
  ctx.body = { token }
})

router.get('/auth/user', async (ctx, next) => {
  ctx.body = {data: ctx.state.user}
})

module.exports = router
