const config = require('config')

module.exports = [
  {
    id: 1,
    name: 'Emailer',
    source: 'EmailerPlugin.js',
    isActive: true,
    settings: {},
    PluginInstances: [{
      settings: {}
    }]
  },
  {
    id: 2,
    name: 'ManualProcessing',
    source: 'ManualProcessingPlugin.js',
    isActive: true,
    settings: {},
    PluginInstances: [{
      settings: {
        input_dir: config.default_modules_dir + '/ManualProcessing_1/in',
        output_dir: config.default_modules_dir + '/ManualProcessing_1/out',
        email_recipients: 'd.haralanov@erteco.de',
        email_subject: 'Manual Processing module started {{order.OrderNumber}}',
        email_body: 'OOS Development: There is a new order to be processed: orderNumber = {{order.OrderNumber}}'
      }
    }]
  },
  {
    id: 3,
    name: 'Publisher',
    source: 'PublisherPlugin.js',
    isActive: true,
    settings: {},
    PluginInstances: [{
      settings: {
        // api_url_upload: 'http://localhost:8081/files/'
        api_url_upload: 'http://localhost:3333/files/'
      }
    }]
  }
]
