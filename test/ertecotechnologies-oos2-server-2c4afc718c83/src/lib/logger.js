const path = require('path')
const winston = require('winston')
const config = require('config')
require('winston-daily-rotate-file')

const transports = []

if (config.log.console) {
  transports.push(
    new (winston.transports.Console)({
      level: config.log.console_level,
      colorize: true,
      prettyPrint: true
    })
  )
}

if (config.log.file) {
  transports.push(
    new (winston.transports.DailyRotateFile)({
      filename: config.log.file,
      level: config.log.file_level,
      datePattern: 'yyyy-MM-dd.',
      prepend: true,
      maxDays: config.log.maxDays,
      zippedArchive: true
      // maxsize: 5000000 // If maxsize is set log query fails
    })
  )
}

const logger = new winston.Logger({
  level: config.log.level,
  padLevels: true,
  transports
})

// Add pseudo 'child' concept
function child (name, postfix = '') {
  name = name.id ? path.basename(name.id).replace('.js', '') : name
  const levelFunctions = {}

  Object.keys(logger.levels).forEach(level => {
    levelFunctions[level] = (message, ...rest) => {
      logger[level](`[${name.padEnd(16)}] ${message} ${postfix}`, ...rest)
    }
  })

  return levelFunctions
}

module.exports = {
  logger,
  child
}
