const ora = require('ora')
const download = require('download-git-repo')
const utils = require('./utils.js')

const SPEIKE_DOWNLOAD = Symbol('speike-cli#downloadAndGenerate')

class init {
  constructor(options) {
    this.options = options
  }

  run() {
    const {template: rawTemplate, targetPath, clone} = this.options
    const template = rawTemplate.indexOf('/') > -1 ? rawTemplate : 'haotech/' + rawTemplate

    this[SPEIKE_DOWNLOAD]({template, targetPath, clone})
  }

  /**
   * Download Template
   */
  [SPEIKE_DOWNLOAD]({template, targetPath, clone}) {
    const spinner = ora('downloading template')
    spinner.start()

    function ensureTargetPath(targetPath) {
      return utils.isExist(targetPath) ? utils.rmdir(targetPath) : Promise.resolve()
    }

    ensureTargetPath(targetPath).then(() => {
      download(template, targetPath, {clone}, err => {
        spinner.stop()
        if (err) return console.error(err)
        console.log('Generated %s', template)
      })
    })
  }
}

module.exports = init