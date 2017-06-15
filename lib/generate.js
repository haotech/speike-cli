const Metalsmith = require('metalsmith')
const inquirer = require('inquirer')
const Handlebars = require('handlebars')
const render = require('consolidate').handlebars.render
const path = require('path')
const multimatch = require('multimatch')
const getOptions = require('./options.js')

Handlebars.registerHelper('author', function (res) {
  return new Handlebars.SafeString(res.data.root.author)
})

module.exports = function (name, src, dest, done) {
  const metadata = getOptions(name, src)

  Metalsmith(path.join(src, 'template'))
    .source('.')
    .destination(dest)
    .use(ask(metadata.prompts))
    .use(template(metadata.skipCompile))
    .build(done)
}

/**
 * Prompt plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function ask (prompts) {
  prompts = Object.keys(prompts).map(key => Object.assign({name: key}, prompts[key]))

  return function (files, metalsmith, done) {
    const metadata = metalsmith.metadata()
    inquirer.prompt(prompts).then((answers) => {
      for (var key in answers) {
        metadata[key] = answers[key]
      }
      done()
    })
  }
}

/**
 * Template in place plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function template (skipCompile) {
  skipCompile = typeof skipCompile === 'string'
    ? [skipCompile]
    : skipCompile

  return function (files, metalsmith, done) {
    const metadata = metalsmith.metadata()

    const promises = Object.keys(files).map(file => {
      if (skipCompile && multimatch([file], skipCompile, { dot: true }).length) {
        return Promise.resolve()
      }
      
      return new Promise((resolve, reject) => {
        const str = files[file].contents.toString()

        render(str, metadata, (err, res) => {
          if (err) reject(err)
          files[file].contents = Buffer.from(res)
          resolve()
        })
      })
    })

    Promise.all(promises).then(() => {
      done(null)
    }, done)
  }
}
