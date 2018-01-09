const fs = require('fs')
const path = require('path')

const plugins = {}

fs.readdirSync(__dirname)
  .filter(file => file.includes('.js') && file !== 'index.js' && file !== 'BasePlugin.js')
  .forEach(file => {
    plugins[file] = require(path.join(__dirname, file))
  })

module.exports = plugins
