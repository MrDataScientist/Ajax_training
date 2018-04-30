const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const config = require('config')

const sequelize = new Sequelize(config.db)

const models = {}

// Import all model files in current directory
fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file))
    models[model.name] = model
  })

// Initialize model associations
Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

module.exports = models
