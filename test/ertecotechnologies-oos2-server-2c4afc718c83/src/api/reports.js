/////////////////// THIS IS A FAST AND UGLY FOR DEMO PURPOSES ONLY

const Router = require('koa-router')
const config = require('config')
const { hasRole, hasRoleMiddleware } = require('./auth_helpers')

const router = Router()

// Mongoose connection & models definition
////////////////////////////////////////////////////////////////////////
const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
mongoose.connect(config.mongoUrl, {useMongoClient: true}).then((response) => {
  console.log('mongo connection created')
}).catch((err) => {
  console.log(err)
})

// mongoose.set('debug', true)

const User = mongoose.model('User', new Schema({
  userID: {type: Number},
  merchantToken: {type: String},
  username: {type: String, requierd: true},
  email: {type: String},
  roles: [String]
}))

const Statistic = mongoose.model('Statistic', new Schema({
  userID: {type: Schema.Types.ObjectId},
  orderID: {type: String},
  date: {type: Date, default: Date.now, required: true},
  imageData: {
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true}
  },
  resolution: {
    width: {type: Number, required: true},
    height: {type: Number, required: true}
  }
}))
////////////////////////////////////////////////////////////////////////

// ONLY ADMINS
// router.use(hasRoleMiddleware('admin'))

router.get('/users', async ctx => {
  ctx.body = await User.find({username: new RegExp('^' + ctx.query.query, 'i')})
})

router.get('/', async ctx => {
  const { userID } = ctx.query

  if (!hasRole(ctx.state.user, 'admin') && userID !== ctx.state.user._id) {
    ctx.throw(401, 'No permission')
  }

  const match = {}

  if (ctx.query.userId) {
    match.userID = mongoose.Types.ObjectId(ctx.query.userId)
  }

  if (ctx.query.merchantToken) {
    match['User.merchantToken'] = ctx.query.merchantToken
  }

  ctx.body = await Statistic.aggregate([
    {$lookup: {
      from: 'users',
      localField: 'userID',
      foreignField: '_id',
      as: 'User'
    }},
    {$unwind: '$User'},
    {$match: match},
    {$group: {
      _id: {year: {$year: '$date'}, month: {$month: '$date'}},
      count: {$sum: 1}
    }},
    {$project: {
      year: '$_id.year',
      month: '$_id.month',
      count: 1
    }},
    {$sort: {year: -1, month: -1}}
  ])
})

module.exports = router
