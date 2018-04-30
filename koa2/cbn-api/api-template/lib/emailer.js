const path = require('path')
const fs = require('fs-extra')
const nodemailer = require('nodemailer')
const config = require('config')

const transporter = nodemailer.createTransport(config.smtp)

function send (mailOptions) {
  mailOptions = {
    from: config.email.from,
    to: config.email.to,
    subject: 'Some default subject',
    text: 'Some default text',
    ...mailOptions
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, response) {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = {
  send
}
