const Metalsmith = require('metalsmith')
const inquirer = require('inquirer')
const render = require('consolidate').handlebars.render
const path = require('path')
const getOptions = require('./options.js')

module.exports = function (name, src, dest, done) {
  const metadata = getOptions(name, src)

  const metalsmith = Metalsmith(path.join(src, 'template'))
    .source('.')
    .destination(dest)
    .use(ask(metadata.prompts))
    .use(template)
    .build(done)
}

/**
 * Prompt plugin.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

function ask(prompts) {
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

function template(files, metalsmith, done){
  const metadata = metalsmith.metadata()

  const promises = Object.keys(files).map(file => {
    return new Promise((resolve, reject) => {
      const str = files[file].contents.toString()

      render(str, metadata, (err, res) => {
        if (err) reject(err)
        files[file].contents = new Buffer(res)
        resolve()
      })
    })
  })

  Promise.all(promises).then(() => {
    done(null)
  }, done)
}