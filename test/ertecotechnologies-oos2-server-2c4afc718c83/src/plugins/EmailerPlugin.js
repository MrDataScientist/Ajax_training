const path = require('path')
const fs = require('fs-extra')
const { pope } = require('pope')
const BasePlugin = require('./BasePlugin')

module.exports = class EmailerPlugin extends BasePlugin {

  static get settingsDefinition () {
    return [
      {name: 'email_recipients', type: 'string', default: '', required: true, scope: ['task']},
      {name: 'email_subject', type: 'string', default: '', required: true, scope: ['task']},
      {name: 'email_body', type: 'text', default: '', required: true, scope: ['task']}
    ]
  }

  async run (initialRun) {
    if (initialRun) {
      // Replace variables
      const to = pope(this.settings.email_recipients, this.orderJson)
      const subject = pope(this.settings.email_subject, this.orderJson)
      const text = pope(this.settings.email_body, this.orderJson)

      // Send email
      await this.emailer.send({to, subject, text})

      // Write output json file
      await fs.writeJson(
        path.join(this.taskOutDirectory, 'email.json'),
        { to, subject, text },
        { spaces: 2 }
      )

      // Set task to ready
      await this.setReady()
    } else {
      this.logger.error(`This plugin should be run() only once`)
    }
  }
}
