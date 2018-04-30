const rp = require('request-promise')
const jwt = require('jsonwebtoken')
const Router = require('koa-router')
const config = require('config')
const { Admin } = require('../models')

const router = Router()

router.post('/auth/login', async (ctx, next) => {
  const params = ctx.request.body
  const user = await Admin.findOne({
    where: {
      username: params.username
    }
  })

  if (user && user.verifyPassword(ctx.request.body.password)) {
    const token = jwt.sign({iss: user.id}, config.jwt.secret, config.jwt.options)
    ctx.set('Authorization', 'Bearer ' + token)
    ctx.body = true
  } else {
    ctx.throw(401, 'Bad username or password')
  }
})

// authentication middleware
router.use(async (ctx, next) => {
  // await next()
  var token, msg, payload, parts, scheme, credentials
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

  if (!token) {
    ctx.throw(401, 'No Authorization header found\n')
  }

  try {
    payload = jwt.verify(token, config.jwt.secret, {})
  } catch (e) {
    msg = 'Invalid token' + (true ? ' - ' + e.message + '\n' : '\n')
  }

  if (payload) {
    ctx.state.user = await Admin.findById(payload.iss, {
      attributes: ['id', 'name', 'username', 'roles'],
      raw: true
    })

    if (ctx.state.user) {
      ctx.state.user.roles = ctx.state.user.roles || []
      await next()
    } else {
      ctx.throw(401, 'User not found')
    }
  } else {
    ctx.throw(401, msg)
  }
})

router.get('/auth/user', async (ctx, next) => {
  ctx.body = {
    data: {
      id: ctx.state.user.id,
      name: ctx.state.user.name,
      username: ctx.state.user.username,
      roles: ctx.state.user.roles
    }
  }
})

module.exports = router
