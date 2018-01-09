const path = require('path')
const fs = require('fs-extra')
const nodemailer = require('nodemailer')
const { pope } = require('pope')
const config = require('config')
const logger = require('./logger').child(module)
const templates = {}
const templatesDir = path.resolve(__dirname, '../templates')

// Read template files in sync only once
fs.readdirSync(templatesDir)
  .filter(filename => filename.split('.').pop().toLowerCase() === 'html')
  .forEach(filename => {
    templates[path.parse(filename).name] = fs.readFileSync(path.join(templatesDir, filename), 'utf8')
  })

const transporter = nodemailer.createTransport(config.smtp)

function send (mailOptions) {
  mailOptions = {
    from: config.email.from,
    to: [config.email.to],
    subject: config.email.subject_prefix,
    text: mailOptions.html ? null : 'OOS text',
    ...mailOptions
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, response) {
      if (err) {
        logger.error('Email error', {mailOptions})
        reject(err)
      } else {
        logger.info(`Email sent to ${mailOptions.to} - ${mailOptions.subject}`)
        resolve(response)
      }
    })
  })
}

function sendTemplate (template, data, mailOptions) {
  const templateData = {
    currentDate: new Date(),
    ...data
  }

  mailOptions.html = pope(templates[template], templateData)

  return send(mailOptions)
}

module.exports = {
  send,
  sendTemplate
}
