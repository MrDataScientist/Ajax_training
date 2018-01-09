const config = require('config')
const Router = require('koa-router')
const { Merchant, Order, Product, Sequelize } = require('../models')
const Op = Sequelize.Op

const router = Router()

// PUBLIC ORDER STATUS
router.get('/orders/:orderNumber/status', async (ctx) => {
  const order = await Order.findById(ctx.params.orderNumber, {
    include: [Merchant, Product]
  })

  ctx.assert(order, 404, 'Order not found')

  ctx.body = {
    status: order.state,
    description: order.stateDescription,
    data: order.dataUrl,
    orderNumber: order.id
  }
})

// PUBLIC ShowMySite Auth check
router.get('/orders/sms-user', async (ctx) => {
  const merchantToken = ctx.query.merchantToken
  const userID = parseInt(ctx.query.userID)

  const merchant = await Merchant.findOne({
    where: {
      token: merchantToken
    }
  })
  ctx.assert(merchant, 404, 'Merchant not found')

  const order = await Order.findOne({
    where: {
      state: 'ready',
      MerchantId: merchant.merchantID,
      userId: userID
    },
    include: [{
      model: Product,
      as: 'Product',
      where: {token: {[Op.in]: config.sms_products}}
    }],
    order: [['createdAt', 'DESC']]
  })
  // ctx.assert(order, 404, false)
  ctx.assert(order, 404, 'Order not found')

  const orderJson = await order.getJsonFileContent()
  ctx.assert(orderJson, 404, 'Order json not found')

  ctx.body = {
    orderID: order.orderID,
    StartDate: orderJson.line_item.StartDate,
    EndDate: orderJson.line_item.EndDate,
    TimePeriod: orderJson.line_item.TimePeriod,
    Transactions: orderJson.line_item.Transactions
  }
})

module.exports = router
