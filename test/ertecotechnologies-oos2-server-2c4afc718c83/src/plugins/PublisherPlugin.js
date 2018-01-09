const path = require('path')
const fs = require('fs-extra')
const rp = require('request-promise')
const BasePlugin = require('./BasePlugin')

module.exports = class PublisherPlugin extends BasePlugin {
  static get settingsDefinition () {
    return [
      // number_of_retries
      // max_active_tasks
      {name: 'api_url_upload', type: 'string', default: '', required: true, scope: ['instance']}
    ]
  }

  async run (initialRun) {
    if (initialRun) {
      const zipFile = path.join(this.taskInDirectory, `${this.orderNumber}.zip`)

      // Zip blocker tasks' directories
      await this.utils.archive(zipFile, this.blockersOutDirectories)

      // Send zip to api
      const response = await rp.post(this.settings.api_url_upload + this.orderNumber + '.zip', {
        json: true,
        formData: {
          file: fs.createReadStream(zipFile)
        }
      })

      const url = response.url || 'Unknown url'
      await fs.outputFile(`${this.taskOutDirectory}/url.txt`, url)

      // Set task to ready
      await this.setReady({url})
    } else {
      this.logger.error(`This plugin should be run() only once`)
    }
  }
}
