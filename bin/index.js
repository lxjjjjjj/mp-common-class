#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const init = require('../index')
const chalk = require('chalk')

const log = console.log

program
  .version(pkg.version)
  .action(async options => {
    const [ commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass ] = options
    console.log('commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass',commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass)
    const rs = await init({ commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass })
    if (rs.code !== 0) {
      log(chalk.red(rs.msg))
      process.exitCode = rs.code
    } else {
      rs.msg ? log(chalk.yellow(rs.msg)) : log(chalk.green(rs.msg))
    }
  })

program.parse(process.argv)