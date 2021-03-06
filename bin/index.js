#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const { init, extractAtomicClass } = require('../src/index')
const chalk = require('chalk')

const log = console.log

program
  .version(pkg.version)
  .arguments('[args...]')
  .option('-m, --main', 'collect main and subpackage class', false)
  .option('-s, --subPackage', 'collect subpackage class', false)
  .option('-e, --extract', 'collect subpackage atomic class', false)
  .action(async (args, options) => {
    const mainPackage = options.main
    const subPackage = options.subPackage
    const extract = options.extract
    const [ fileRoot, cssName, specSubPackage, commonStyle ] = args
    let specSubPackageList = []
    specSubPackage && (specSubPackageList = specSubPackage.split(','))
    log(chalk.yellow('==========mp-common-class compile start=========='))
    console.time('mp-common-class build time')
    let rs = null
    if (extract) {
      rs = await extractAtomicClass({ fileRoot, specSubPackage, cssName })
    } else {
      rs = await init({ commonStyle, fileRoot, cssName, mainPackage, subPackage, specSubPackage:specSubPackageList })
    }
    log(chalk.yellow('==========mp-common-class compile end=========='))
    console.timeEnd('mp-common-class build time')
    if (rs.errno !== 0) {
      log(chalk.red(rs.msg))
      process.exitCode = rs.errno
    } else {
      rs.msg ? log(chalk.yellow(rs.msg)) : log(chalk.green(rs.msg))
    }
  })

program.parse(process.argv)