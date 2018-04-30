const path = require('path')
const fs = require('fs-extra')
const config = require('config')
const { sequelize, Admin, Merchant } = require('../models')

const adminSeeds = require('./admins')
const merchantSeeds = require('./merchants')

async function init (force = true) {
  console.time('DB init')
  await sequelize.sync({force})
  console.timeEnd('DB init')
}

async function seed () {
  console.time('DB seed')
  await Promise.all(adminSeeds.map(s => Admin.create(s)))
  await Promise.all(merchantSeeds.map(s => Merchant.create(s)))
  console.timeEnd('DB seed')
}

async function initAndSeedAll () {
  try {
    await init()
    await seed()
    process.exit()
  } catch (err) {
    console.log(err)
    process.exit()
  }
}

initAndSeedAll()
