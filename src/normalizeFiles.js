const path = require('path')
const fsPromise = require('fs/promises')
const fg = require('fast-glob');
const { scanFiles } = require('./utils.js')
/**
 * 返回分包目录以及主包特定目录下的所有样式文件
 * @param cssName css文件的后缀名
 * @param fileRoot 入口文件夹名称
 * @param mainPackage 是否提取主包样式
 * @param subPackage 是否提取分包样式
 * @param specSubPackage 指定的部分分包数组
 * @returns {Object} 
 */
const normalizeFiles = async ({fileRoot = '', cssName = 'wxss', mainPackage = false, subPackage = false, specSubPackage = []}) => {
  let files = {}
  let subPackagesDir = []
  let mainDir = []
  let allDir = []
  const dirPath = process.cwd()
  if(fileRoot){
    const data = await fsPromise.readFile(path.resolve(dirPath, fileRoot, './app.json'), 'utf8')
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

  if(mainPackage && !subPackage){ //只提取主包的样式
    files = scanFiles(mainDir, [], cssName, fileRoot)
  }else if(mainPackage && subPackage && specSubPackage.length){ //提取主包和部分分包的样式
    files = scanFiles(mainDir, specSubPackage, cssName, fileRoot)
  }else if(mainPackage && subPackage && !specSubPackage.length){ //提取主包和全部分包的样式
    files = scanFiles(mainDir, subPackagesDir, cssName, fileRoot)
  }else if(!mainPackage && subPackage && !specSubPackage.length){ //只提取全部分包样式
    files = scanFiles([], subPackagesDir, cssName)
  }else if(!mainPackage && subPackage && specSubPackage.length){ //只提取部分分包样式
    files = scanFiles([], specSubPackage, cssName)
  }
  return new Promise((resolve,reject)=>{
    resolve(files)
  })
}

module.exports.normalizeFiles = normalizeFiles