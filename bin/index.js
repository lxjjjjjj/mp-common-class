#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const init = require('../index')
const chalk = require('chalk')

const log = console.log

program
  .version(pkg.version)
  .arguments('[args...]')
  .option('-m, --main', 'collect main and subpackage class', false)
  .option('-s, --subPackage', 'collect subpackage class', false)
  .option('-a, --alreadyScanFiles', 'already collected all class', false)
  .action(async (args, options) => {
    const mainPackage = options.main
    const subPackage = options.subPackage
    const alreadyScanFiles = options.alreadyScanFiles
    const [ commonStyle, fileRoot, cssName, specSubPackage, classObj ] = args
    log(chalk.yellow('==========mp-common-class compile start=========='))
    console.time('mp-common-class build start time')
    const rs = await init({ commonStyle, fileRoot, cssName, mainPackage, subPackage, specSubPackage, alreadyScanFiles, classObj })
    log(chalk.yellow('==========mp-common-class compile end=========='))
    console.timeEnd('mp-common-class build end time')
    if (rs.errno !== 0) {
      log(chalk.red(rs.msg))
      process.exitCode = rs.errno
    } else {
      rs.msg ? log(chalk.yellow(rs.msg)) : log(chalk.green(rs.msg))
    }
  })

program.parse(process.argv)