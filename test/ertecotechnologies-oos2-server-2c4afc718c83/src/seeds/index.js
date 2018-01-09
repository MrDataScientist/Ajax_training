const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const {
  sequelize,
  Plugin,
  PluginInstance,
  Merchant,
  Product,
  ProductTask,
  Order,
  OrderLog,
  Workflow,
  WorkflowTask
} = require('../models')

const merchantSeeds = require('./merchants')
const pluginSeeds = require('./plugins')
const productSeeds = require('./products')

async function init (force = true) {
  console.time('DB init')
  await sequelize.sync({force})
  console.timeEnd('DB init')
}

async function seed () {
  console.time('DB seed')
  await Promise.all(merchantSeeds.map(s => Merchant.create(s)))
  await Promise.all(pluginSeeds.map(s => Plugin.create(s, {include: [PluginInstance]})))
  await Promise.all(productSeeds.map(s => Product.create(s, {include: [ProductTask]})))
  console.timeEnd('DB seed')
}

async function seedOrders () {
  console.time('Seed orders')
  await Order.destroy({force: true, where: {}})
  await Workflow.destroy({force: true, where: {}})
  await WorkflowTask.destroy({force: true, where: {}})
  await OrderLog.destroy({force: true, where: {}})

  const directoriesToDelete = [
    'orders_dir',
    'orders_input_dir',
    'orders_original_dir',
    'orders_unknown_dir',
    'orders_archive_dir',
    'default_modules_dir'
  ]

  for (const dir of directoriesToDelete) {
    await fs.remove(config[dir])
  }

  await fs.ensureDir(config.orders_input_dir)

  const testOrdersDir = path.join(__dirname, 'test_orders')
  const files = await fs.readdir(testOrdersDir)
  for (const filename of files) {
    await fs.copy(
      path.join(testOrdersDir, filename),
      path.join(config.orders_input_dir, filename)
    )
  }
  console.timeEnd('Seed orders')
}

async function initAndSeedAll () {
  try {
    await init()
    await seed()
    await seedOrders()
  } catch (err) {
    console.log(err)
  }
}


initAndSeedAll()


// module.exports = {
//   init,
//   seed,
//   seedOrders,
//   initAndSeedAll
// }
