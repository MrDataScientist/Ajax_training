// Put fake data for ManualProcessing plugin. For test purposes only

const path = require('path')
const fs = require('fs-extra')
const klawSync = require('klaw-sync')
const config = require('config')

const inputDir = config.default_modules_dir + '/ManualProcessing_1/in'
const outputDir = config.default_modules_dir + '/ManualProcessing_1/out'

const paths = klawSync(inputDir, {
  nofile: true
})

for (const orderDir of paths) {
  const orderNumber = orderDir.path.split('/').pop()
  fs.outputFileSync(path.join(outputDir, orderNumber, 'data.txt'), 'SOMEDATA HERE')
  fs.outputFileSync(path.join(outputDir, `${orderNumber}.done`), 'DONE')
}
