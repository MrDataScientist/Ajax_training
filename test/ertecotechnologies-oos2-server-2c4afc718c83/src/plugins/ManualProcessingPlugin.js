const path = require('path')
const fs = require('fs-extra')
const { pope } = require('pope')
const BasePlugin = require('./BasePlugin')

module.exports = class ManualProcessingPlugin extends BasePlugin {
  static get settingsDefinition () {
    return [
      {name: 'input_dir', type: 'string', default: '', required: true, scope: ['instance']},
      {name: 'output_dir', type: 'string', default: '', required: true, scope: ['instance']},
      {name: 'email_recipients', type: 'string', default: '', required: true, scope: ['instance']},
      {name: 'email_subject', type: 'string', default: 'Manual Processing module started', required: true, scope: ['instance']},
      {name: 'email_body', type: 'text', default: 'Order {{ order.OrderNumber }}', required: true, scope: ['instance']}
    ]
  }

  async run (initialRun) {
    const pluginOrderInputDir = path.join(this.settings.input_dir, this.orderNumber)
    const pluginOrderOutputDir = path.join(this.settings.output_dir, this.orderNumber)

    const jsonFile = path.join(this.settings.input_dir, `${this.orderNumber}.json`)
    const doneFile = path.join(this.settings.output_dir, `${this.orderNumber}.done`)
    const errorFile = path.join(this.settings.output_dir, `${this.orderNumber}.error`)

    await fs.ensureDir(pluginOrderInputDir)
    await fs.ensureDir(pluginOrderOutputDir)

    if (initialRun) {
      // Create order .json file
      await fs.writeJson(jsonFile, this.orderJson, {spaces: 2})

      // Copy blocker tasks output to plugin.settings.input_dir
      await this.copyBlockersOutDirectories(pluginOrderInputDir)

      // Send email
      const to = pope(this.settings.email_recipients, this.orderJson)
      const subject = pope(this.settings.email_subject, this.orderJson)
      const text = pope(this.settings.email_body, this.orderJson)
      await this.emailer.send({to, subject, text})
    } else {
      // Check if .done or .error files exist
      const doneFileExists = await fs.pathExists(doneFile)
      const errorFileExists = await fs.pathExists(errorFile)

      if (doneFileExists) {
        const doneFileContent = await fs.readFile(doneFile)

        // Move output directory to task's out directory
        await fs.move(pluginOrderOutputDir, this.taskOutDirectory, {overwrite: true})

        // Remove files and dirs
        await fs.remove(jsonFile)
        await fs.remove(doneFile)
        await fs.remove(pluginOrderInputDir)

        // Set task to ready
        await this.setReady({done: doneFileContent.toString()})
      } else if (errorFileExists) {
        // Read the .error
        const errorFileContent = await fs.readFile(errorFile)
        await fs.remove(errorFile)
        throw new Error(errorFileContent.toString())
      }
    }
  }
}
