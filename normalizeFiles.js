const path = require('path')
const fsPromise = require('fs/promises')
const fg = require('fast-glob');
const { scanFiles } = require('./utils.js')
/**
 * 返回分包目录以及主包特定目录下的所有样式文件
 * @param cssName css文件的后缀名
 * @param subpackagefileDir 需要扫描的几个分包目录
 * @param fileRoot 入口文件夹名称
 * @param needAllFileClass 是否需要提取主包和分包的公共样式
 * @returns {Object} 
 */
const normalizeFiles = async ({fileRoot = '', cssName = 'wxss', subpackagefileDir = [], needAllFileClass = false}) => {
  let files = {}
  let subPackagesDir = []
  let mainDir = []
  let allDir = []
  
  if(fileRoot){
    const data = await fsPromise.readFile(path.resolve(fileRoot, './app.json'), 'utf8')
    const jsonObject = JSON.parse(data)

    jsonObject.subPackages.forEach(subpackage=>{
      subPackagesDir.push(fileRoot + '/' +subpackage.root)
    })

    allDir = fg.sync(`${fileRoot}/**`, { onlyDirectories: true, deep: 1 })

    allDir.forEach(alldir => {
      if(!subPackagesDir.includes(alldir)){
        mainDir.push(alldir)
      }
    })
  }

  if(needAllFileClass && !subpackagefileDir.length){ //扫描所有样式文件
    files = scanFiles(mainDir, subPackagesDir, cssName, fileRoot)
  }else if(needAllFileClass && subpackagefileDir.length){ //扫描部分分包和总目录下所有样式文件
    files = scanFiles(mainDir, subpackagefileDir, cssName, fileRoot)
  }else if(!needAllFileClass && subpackagefileDir.length){ //只需要扫描部分分包 
    files = scanFiles([], subpackagefileDir, cssName)
  }else if(!needAllFileClass && !subpackagefileDir.length){ //扫描全部分包不扫描主包
    files = scanFiles([], subPackagesDir, cssName)
  }
  return new Promise((resolve,reject)=>{
    resolve(files)
  })
}

module.exports.normalizeFiles = normalizeFiles