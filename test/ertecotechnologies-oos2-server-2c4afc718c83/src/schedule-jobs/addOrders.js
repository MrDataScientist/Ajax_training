const path = require('path')
const fs = require('fs-extra')
const Joi = require('joi')
const Bounce = require('bounce')
const config = require('config')
const logger = require('../lib/logger').child(module)
const emailer = require('../lib/emailer')
const { Merchant, Order, Product, sequelize } = require('../models')

// const notifier = require('../lib/notifier')

const orderJsonSchema = Joi.object({
  order: Joi.object({
    OrderID: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
    MerchantToken: Joi.string().required()
  }).required(),
  user: Joi.object().required(),
  billing: Joi.object().required(),
  line_item: Joi.object().min(1).required().pattern(/^[0-9]*$/, Joi.object({
    SKU: Joi.string().required()
  }))
})

module.exports = async function addOrders (job) {
  logger.info(`Scanning for new orders in ${config.orders_input_dir}`)

  let ordersAdded = []
  let ordersFailed = []

  await fs.ensureDir(config.orders_input_dir)
  await fs.ensureDir(config.orders_original_dir)
  await fs.ensureDir(config.orders_unknown_dir)

  const files = await fs.readdir(config.orders_input_dir)
  const orderFiles = files.filter(filename => filename.split('.').pop().toLowerCase() === 'json')

  let filename
  for (filename of orderFiles) {
    try {
      // Copy original order file
      await ensureCopyJsonFile(config.orders_input_dir, config.orders_original_dir, filename)

      // Read order file
      const orderJson = await fs.readJson(path.join(config.orders_input_dir, filename))

      // Delete order file
      await fs.unlink(path.join(config.orders_input_dir, filename))

      const { productOrdersAdded, productOrdersFailed } = await addOrder(orderJson, filename)
      ordersAdded = ordersAdded.concat(productOrdersAdded)
      ordersFailed = ordersFailed.concat(productOrdersFailed)
    } catch (err) {
      Bounce.rethrow(err, 'system')
      ordersFailed.push(filename)
      logger.warn(err)
    }
  }

  // Send email
  if (orderFiles.length) {
    emailer.sendTemplate('email-new-orders', {
      orderFiles: orderFiles.join(', '),
      orderFilesCount: orderFiles.length,
      ordersAddedList: ordersAdded.join(', '),
      ordersAddedCount: ordersAdded.length,
      ordersFailedList: ordersFailed.join(', '),
      ordersFailedCount: ordersFailed.length
    }, {
      subject: `${config.email.subject_prefix} Loaded ${ordersAdded.length} new orders (${ordersFailed.length} errors)`
    })
  }
}

async function addOrder (orderJson, filename) {
  const productOrdersAdded = []
  const productOrdersFailed = []

  // Validate json schema
  const jsonValidation = Joi.validate(orderJson, orderJsonSchema, { allowUnknown: true })
  if (jsonValidation.error) {
    await ensureCreateJsonFile(config.orders_unknown_dir, filename, orderJson)
    throw new Error(`Invalid new order file json schema - ${filename}. ${jsonValidation.error.message}`)
  }

  const merchantToken = orderJson.order.MerchantToken
  const orderID = orderJson.order.OrderID
  const orderNumber = merchantToken + '_' + orderID

  // Validate merchant
  const merchant = await Merchant.findByToken(merchantToken)
  if (!merchant) {
    await ensureCreateJsonFile(config.orders_unknown_dir, filename, orderJson)
    throw new Error(`Merchant (${merchantToken}) does not exist. ${merchantToken}`)
  }

  for (const id in orderJson.line_item) {
    let productOrderJson
    let productToken
    let order

    try {
      productOrderJson = JSON.parse(JSON.stringify(orderJson))
      productToken = orderJson.line_item[id].SKU

      productOrderJson.line_item = orderJson.line_item[id]
      productOrderJson.line_item.LineItem = id
      productOrderJson.order.OrderNumber = orderNumber + '_' + id

      // Validate order exists
      const orderExists = await Order.findById(productOrderJson.order.OrderNumber)
      if (orderExists) {
        await createMissingProductJsonFile(orderJson, productOrderJson)
        throw new Error(`Order ${orderNumber}: Already exists.`)
      }

      // Validate product
      const product = await Product.findByToken(productToken)
      if (!product) {
        await createMissingProductJsonFile(orderJson, productOrderJson)
        throw new Error(`Order ${orderNumber}: Product (${productToken}) does not exist.`)
      }

      // Validate tasks
      const tasks = await product.getProductTasks()
      if (!tasks || !tasks.length) {
        await createMissingProductJsonFile(orderJson, productOrderJson)
        throw new Error(`Order ${orderNumber}: Product (${productToken}) has no tasks.`)
      }

      // Create order
      const transaction = await sequelize.transaction()
      try {
        order = await Order.create({
          id: productOrderJson.order.OrderNumber,
          state: 'new',
          MerchantId: merchant.id,
          ProductId: product.id,
          orderJson: productOrderJson,
          isApproved: !product.orderApproval
        }, {
          transaction
        })

        await order.createWorkflow({transaction})

        await transaction.commit()
      } catch (err) {
        await transaction.rollback()
        throw err
      }
      productOrdersAdded.push(productOrderJson.order.OrderNumber)
    } catch (err) {
      productOrdersFailed.push(productOrderJson.order.OrderNumber)
      Bounce.rethrow(err, 'system')
      logger.warn(err)
    }
  }

  return {
    productOrdersAdded,
    productOrdersFailed
  }
}

// Copy file with timestamp if it already exists
async function ensureCopyJsonFile (srcDir, destDir, filename) {
  const exists = await fs.pathExists(path.join(destDir, filename))
  const newFilename = exists
      ? filename.replace('.json', '') + '-' + Date.now() + '.json'
      : filename

  await fs.copy(
    path.join(srcDir, filename),
    path.join(destDir, newFilename)
  )
}

// Create json file with timestamp if it already exists
async function ensureCreateJsonFile (destDir, filename, json) {
  const exists = await fs.pathExists(path.join(destDir, filename))
  const newFilename = exists
      ? filename.replace('.json', '') + '-' + Date.now() + '.json'
      : filename

  await fs.writeJson(path.join(destDir, newFilename), json, {spaces: 2})
}

async function createMissingProductJsonFile (orderJson, productOrderJson) {
  const missingProductOrderJson = JSON.parse(JSON.stringify(orderJson))
  missingProductOrderJson.line_item = {}
  missingProductOrderJson.line_item[productOrderJson.line_item.LineItem] = orderJson.line_item[productOrderJson.line_item.LineItem]

  await ensureCreateJsonFile(config.orders_unknown_dir, 'order-' + productOrderJson.order.OrderNumber + '.json', missingProductOrderJson)
}
