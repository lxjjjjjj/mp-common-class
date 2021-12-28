#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const init = require('../index')
const chalk = require('chalk')

const log = console.log

program
  .version(pkg.version)
  .arguments('[args...]')
  .action(async (args,options) => {
    const [ commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass ] = args
    const rs = await init({ commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass })
    if (rs.errno !== 0) {
      log(chalk.red(rs.msg))
      process.exitCode = rs.errno
    } else {
      rs.msg ? log(chalk.yellow(rs.msg)) : log(chalk.green(rs.msg))
    }
  })

program.parse(process.argv)