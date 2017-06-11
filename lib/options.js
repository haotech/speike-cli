const fs = require('fs')
const path = require('path')
const utils = require('./utils.js')

module.exports = function (name, dir) {
  const metadata = getMetadata(dir)

  setDefaultPrompt(metadata, 'name', name)
  setDefaultPrompt(metadata, 'author', utils.getGitUser())

  return metadata
}

function getMetadata(dir) {
  const json = path.join(dir, 'metadata.json')
  const js = path.join(dir, 'metadata.js')

  if (utils.isExist(json)) {
    const data = fs.readFileSync(json, 'utf-8')
    return JSON.parse(data)
  }

  if (utils.isExist(js)) {
    return require(js)
  }
}

function setDefaultPrompt(opts, key, value) {
  const prompts = opts.prompts || (opts.prompts = {})

  if (!prompts[key] || typeof prompts[key] !== 'object') {
    prompts[key] = {
      'type': 'string',
      'message': key,
      'default': value
    }
  } else {
    prompts[key]['default'] = value
  }
}