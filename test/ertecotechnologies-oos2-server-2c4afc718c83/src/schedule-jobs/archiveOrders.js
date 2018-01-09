const Bounce = require('bounce')
const logger = require('../lib/logger').child(module)
const { Order, Product } = require('../models')

module.exports = async function archiveOrders () {
  logger.info('Auto archive orders')

  // Get ready orders
  const orders = await Order.findAll({
    where: {
      state: Order.states.ready
    },
    order: [['createdAt', 'asc']],
    include: [{
      model: Product
    }]
  }, {})

  for (const order of orders) {
    try {
      if (order.orderJson.line_item.EndDate) {
        const nowTime = new Date().getTime()
        const endTime = new Date(order.orderJson.line_item.EndDate).getTime()
        if (nowTime > endTime) {
          await order.archive(`Order closed by auto archiver job after EndDate ${order.orderJson.line_item.EndDate}`)
        }
      } else if (order.Product.archiveDays) {
        const orderTime = new Date().getTime() - new Date(order.updatedAt).getTime()
        const productArchiveTime = order.Product.archiveDays * 1000 * 60 * 60 * 24
        if (order.Product.archiveDays && orderTime > productArchiveTime) {
          await order.archive(`Order closed by auto archiver job after ${order.Product.archiveDays} days`)
        }
      }
    } catch (err) {
      Bounce.rethrow(err, 'system')
      logger.warn(err)
    }
  }
}
