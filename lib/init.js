const ora = require('ora')
const download = require('download-git-repo')
const utils = require('./utils.js')
const generate = require('./generate.js')
const logger = require('./logger.js')

const SPEIKE_GENERATE = Symbol('speike-cli#generate')
const SPEIKE_DOWNLOAD_AND_GENERATE = Symbol('speike-cli#downloadAndGenerate')

class init {
  constructor (options) {
    this.options = options
  }

  run () {
    const {template} = this.options

    utils.isLocalPath(template)
     ? this[SPEIKE_GENERATE]()
     : this[SPEIKE_DOWNLOAD_AND_GENERATE]()
  }

  /**
   * Generate from a local template
   * @param {String} template
   */
  [SPEIKE_GENERATE] () {
    const {name, template: rawTemplate, targetPath} = this.options
    const template = utils.getLocalTemplatePath(rawTemplate)
    if (!utils.isExist(template)) {
      console.log()
      logger.error('Local template "%s" not found.', template)
      return
    }
    generate(name, template, targetPath, (err) => {
      if (err) return logger.error(err)
      console.log()
      logger.success('Generated %s', name)
    })
  }

  /**
   * Download a generate from a template repo.
   * @param {String} template
   */
  [SPEIKE_DOWNLOAD_AND_GENERATE] () {
    const {name, template: rawTemplate, cacheTemplatePath, targetPath, clone} = this.options
    const spinner = ora({text: 'downloading template...', spinner: 'arrow3'}).start()

    const template = rawTemplate.indexOf('/') > -1
      ? rawTemplate
      : 'haotech/' + rawTemplate

    function ensureTargetPath (path) {
      return utils.isExist(path)
        ? utils.rmdir(path)
        : Promise.resolve()
    }

    ensureTargetPath(cacheTemplatePath).then(() => {
      download(template, cacheTemplatePath, {clone}, err => {
        spinner.stop()
        if (err) return logger.error(err)

        generate(name, cacheTemplatePath, targetPath, (err) => {
          if (err) return logger.error(err)
          console.log()
          logger.success('Generated %s', name)
        })
      })
    })
  }
}

module.exports = init
