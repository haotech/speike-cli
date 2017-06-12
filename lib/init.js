const ora = require('ora')
const download = require('download-git-repo')
const utils = require('./utils.js')
const generate = require('./generate.js')

const SPEIKE_DOWNLOAD = Symbol('speike-cli#downloadAndGenerate')

class init {
  constructor(options) {
    this.options = options
  }

  run() {
    const {template: rawTemplate, name, cacheTemplatePath, targetPath, clone} = this.options
    const template = rawTemplate.indexOf('/') > -1
      ? rawTemplate
      : 'haotech/' + rawTemplate

    this[SPEIKE_DOWNLOAD]({name, template, cacheTemplatePath, targetPath, clone})
  }

  /**
   * Download Template
   */
  [SPEIKE_DOWNLOAD]({name, template, cacheTemplatePath, targetPath, clone}) {
    const spinner = ora({text: 'downloading template...', spinner: 'arrow3'}).start()

    function ensureTargetPath(path) {
      return utils.isExist(path)
        ? utils.rmdir(path)
        : Promise.resolve()
    }

    ensureTargetPath(cacheTemplatePath).then(() => {
      download(template, cacheTemplatePath, {clone}, err => {
        spinner.stop()
        if (err) return console.error(err)

        generate(name, cacheTemplatePath, targetPath, (err) => {
          if (err) return console.error(err)
          console.log()
          console.log('Generated %s', name)
        })
      })
    })
  }
}

module.exports = init