const { exec } = require('child_process')
const fs = require('fs-extra')
const archiver = require('archiver')

function archive (zipFile, directories = []) {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip')
    const writeStream = fs.createWriteStream(zipFile)

    archive.pipe(writeStream)

    archive.on('error', (err) => {
      reject(err)
    })

    for (const dir of directories) {
      archive.directory(dir)
    }

    archive.finalize()
    writeStream.on('close', () => {
      resolve(writeStream.path)
    })
  })
}

async function decompress (file, outputDir) {
  // TODO: this is a temporaly solution. This has dependency on MS Windows and 7-Zip software.
  var zipCmd = '7za'
  if (file.includes('.tar.gz')) {
    await this.executeCommand(`${zipCmd} x ${file} -so | ${zipCmd} x -aoa -si -ttar -o ${outputDir}`)
  } else if (file.includes('.zip')) {
    await this.executeCommand(`${zipCmd} x ${file} -o ${outputDir}`)
  }
}

function executeCommand (command) {
  return new Promise(function (resolve, reject) {
    this.logger.debug(`Execute command: ${command}`)
    exec(command, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error && error.code !== 2) {
        this.logger.warn(`Command not executed with message: ${error}`)
        reject({err: error, stdout, stderr})
      } else {
        this.logger.warn(`Command executed with message: ${stdout}`)
        resolve({stdout, stderr})
      }
    })
  })
}

module.exports = {
  archive,
  decompress,
  executeCommand
}
