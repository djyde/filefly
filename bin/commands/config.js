exports.command = 'config'
exports.desc = 'Open config file'
const conf = require('../conf')
const open = require('open')
const path = require('path')

exports.handler = function () {
  const dir = path.parse(conf.path).dir
  console.log('Openning', dir)
  open(dir)
}