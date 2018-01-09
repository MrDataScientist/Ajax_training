const http = require('http')
const path = require('path')

const Koa = require('koa')
const koaLogger = require('koa-logger')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const send = require('koa-send')
const qs = require('qs')
const config = require('config')

const app = new Koa()

const api = require('./api')

// ERROR HANDLING JSON
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.response.status === 404 && !ctx.response.body) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.status = typeof err.status === 'number' ? err.status : 500
    // application
    ctx.app.emit('error', err, ctx)

    if (config.env === 'development') {
      ctx.body = { error: err.message, stack: err.stack }
    } else if (err.expose) {
      ctx.body = { error: err.message }
    } else {
      ctx.body = { error: http.STATUS_CODES[ctx.status] }
    }
  }
})

app.use(koaStatic(path.join(__dirname, './public'), {maxage: 2 * 60 * 60 * 1000, gzip: true}))
app.use(koaLogger())
app.use(koaBody({queryString: {depth: 2}}))
app.use(async (ctx, next) => {
  ctx.query = qs.parse(ctx.querystring)
  await next()
})

// SIMULATE NETWORK LATENCY WHEN RUNNING LOCALY
// app.use(async (ctx, next) => {
//   await new Promise(r => { setTimeout(r, 350) })
//   await next()
// })

// LOAD API ROUTES
app.use(api.routes())

// ALWAYS GO TO INDEX.HTML (SPA client app)
app.use(async (ctx) => {
  await send(ctx, 'index.html', {root: path.join(__dirname, './public')})
})

module.exports = app
