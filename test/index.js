const test = require('ava')
const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const SpeikeInit = require('../lib/init.js')
const utils = require('../lib/utils.js')
const cacheTemplatePath = path.join(__dirname, '.speike-templates')
const targetPath = path.join(__dirname, 'speike-cli-unit-test')

const answers = {
  name: 'speike-cli-test',
  author: 'Berwin <liubowen.niubi@gmail.com>',
  description: 'speike-cli unit test'
}

test.before(() => {
  inquirer.prompt = (questions) => {
    const _answers = {}
    for (var i = 0; i < questions.length; i++) {
      const key = questions[i].name
      _answers[key] = answers[key]
    }
    return Promise.resolve(_answers)
  }
})

test.cb('should generation speike-cli-unit-test project', t => {
  const init = new SpeikeInit({
    template: 'speike-template-haotech',
    name: 'speike-cli-unit-test',
    cacheTemplatePath,
    targetPath,
    clone: false
  })

  init.run()

  const timer = setInterval(() => {
    if (utils.isExist(targetPath)) {
      clearInterval(timer)
      t.pass()
      t.end()
    }
  }, 1000)
})

test.cb('project content be equal to answers', t => {
  fs.readFile(path.join(targetPath, 'package.json'), 'utf8', (err, data) => {
    if (err) throw err
    const json = JSON.parse(data)
    t.is(json.name, answers.name)
    t.is(json.description, answers.description)
    t.is(json.author, answers.author)
    t.end()
  })
})

test.after(t => {
  utils.rmdir(cacheTemplatePath)
    .then(() => utils.rmdir(targetPath))
})
