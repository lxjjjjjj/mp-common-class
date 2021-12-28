const shell = require('shelljs')
const chalk = require('chalk')

const { collectClass } = require('./collectClass.js')
const { compareSubpackageClass, compareClass} = require('./compareClass.js')
const { normalizeSubpackageClass, normalizeClass} = require('./normalizeClass.js')
const { normalizeFiles } = require('./normalizeFiles.js')
const { flattenAndUnique } = require('./utils.js')
const args = process.argv.splice(2)

let [commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass] = args
if(needAllFileClass && !fileRoot){
  shell.echo(chalk.red('如果是需要提取整个文件的公共样式, 需要写扫描文件入口! 如果不需要可以不传 needAllFileClass 参数'))
  shell.exit(1)
}

if(subpackagefileDir && !subpackagefileDir.length && !fileRoot){
  shell.echo(chalk.red('如果是需要提取所有分包的公共样式, 需要写扫描文件入口! 如果提取部分分包的公共样式需要添加 subpackagefileDir 参数'))
  shell.exit(1)
}

if(!cssName){
  cssName = 'wxss'
  shell.echo(chalk.yellow('如果没有传css文件后缀默认文件后缀为wxss'))
}

if(!commonStyle){
  commonStyle = `./commonStyle.${cssName}`
  shell.echo(chalk.yellow('如果没有设定公共样式文件名称，默认为名为commonStyle'))
}

needAllFileClass = needAllFileClass === 'false' ? false : needAllFileClass

normalizeFiles({fileRoot, cssName, subpackagefileDir, needAllFileClass}).then(res=>{
  const {mainfiles, subpackagefiles} = res
  Promise.all([collectClass(mainfiles),collectClass(subpackagefiles)]).then((res)=>{
    const files = Object.assign({},subpackagefiles,mainfiles)
    needAllFileClass && normalizeClass(files,compareClass(flattenAndUnique(Object.assign({},res[0],res[1]), fileRoot)),fileRoot)
  }).then(()=>{
    collectClass(subpackagefiles).then((res)=>{
      normalizeSubpackageClass(subpackagefiles, compareSubpackageClass(res))
    })
  })
})