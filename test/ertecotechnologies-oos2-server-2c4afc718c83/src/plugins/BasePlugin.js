const fs = require('fs-extra')
const utils = require('../lib/utils')
const logger = require('../lib/logger')
const emailer = require('../lib/emailer')

module.exports = class BasePlugin {

  static get settingsDefinition () {
    return []
  }

  constructor (params) {
    this._task = params.task
    this._blockers = params.blockers
    this._workflow = params.workflow
    this._order = params.order
    this._plugin = params.plugin
    this._pluginInstance = params.pluginInstance

    this.utils = utils
    this.logger = logger.child(this.constructor.name, `(Order ${this._order.id} | Task ${this._task.priority} id=${this._task.id})`)
    this.emailer = emailer
    this.settings = {}
  }

  // Internally called after constructor
  async _init () {
    await this._initSettings()
    await this._initDirecotries()
  }

  async _initSettings () {
    const definitions = this.constructor.settingsDefinition

    for (let definition of definitions) {
      const { name, scope } = definition

      this.settings[name] = definition.default || ''

      if (scope.includes('plugin') && this._plugin.settings[name]) {
        this.settings[name] = this._plugin.settings[name]
      }

      if (scope.includes('instance') && this._pluginInstance.settings[name]) {
        this.settings[name] = this._pluginInstance.settings[name]
      }

      if (scope.includes('task') && this._task.settings[name]) {
        this.settings[name] = this._task.settings[name]
      }

      if (definition.required && !this.settings[name]) {
        await this._task.setState('error', {error: `Setting '${name}' is required`})
      }
    }
  }

  async _initDirecotries () {
    await fs.ensureDir(this._task.getInDirectory())
    await fs.ensureDir(this._task.getOutDirectory())
  }

  // Internally called for handling plugin's run() function
  async _run (initialRun) {
    try {
      this.logger.debug(`Task run ${initialRun ? 'initialRun' : 'update'}`)
      await this.run(initialRun)
    } catch (error) {
      await this._task.setState('error', {error})
    }
  }

  // Public methods
  async run (initialRun) {
    throw new Error(`${this.constructor.name} doesn't have run() function`)
  }

  async setReady (data) {
    await this._task.setState('ready', {data})
  }

  async copyBlockersOutDirectories (destDir) {
    for (const srcDir of this.blockersOutDirectories) {
      await fs.copy(srcDir, destDir, {overwrite: true})
    }
  }

  // Public getters
  get orderNumber () {
    return this._order.id
  }

  get orderJson () {
    return this._order.orderJson
  }

  get orderDirectory () {
    return this._order.getDirectory()
  }

  get taskInDirectory () {
    return this._task.getInDirectory()
  }

  get taskOutDirectory () {
    return this._task.getOutDirectory()
  }

  get blockersInDirectories () {
    return this._blockers.map(blocker => blocker.getInDirectory())
  }

  get blockersOutDirectories () {
    return this._blockers.map(blocker => blocker.getOutDirectory())
  }
}
