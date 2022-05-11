const fg = require('fast-glob');

/**
 * 将数组拍平并且去重
 * @param classMap 样式数组
 * @param fileRoot 文件入口
 * @returns {Object} 
 */
const flattenAndUnique = (classMap, fileRoot) => {
  for(let key in classMap){
    if(key === fileRoot){
      classMap[key] = classMap[key].flat()
    }else{
      classMap[key] = Array.from(new Set(classMap[key].flat()))
    }
  }
  return classMap
}

/**
 * 扫描文件目录下的样式文件
 * @param mainDirs 主包下的文件目录
 * @param subpackageDirs 分包下的文件目录
 * @param cssName 文件后缀名
 * @param fileRoot 文件入口
 * @returns {Object} 
 */
const scanFiles = (mainDirs, subpackageDirs, cssName, fileRoot) => {
  let mainfiles = {}, subpackagefiles = {}
  mainDirs.length && mainDirs.forEach(dir=>{
    if(!mainfiles[`${fileRoot}`]) mainfiles[`${fileRoot}`] =[]
    mainfiles[`${fileRoot}`] = mainfiles[`${fileRoot}`].concat(fg.sync([`${dir}/**/*.${cssName}`]))
  })
  subpackageDirs.length && subpackageDirs.forEach(dir=>{
    subpackagefiles[dir]=fg.sync([`${dir}/**/**/*.${cssName}`]);
  })
  return {
    mainfiles,
    subpackagefiles
  }
}
/**
 * 扫描文件目录下的样式文件
 * @param fileLength 当前文件的文件路径
 * @param classLength 公共样式的文件路径
 * @returns {Number} 
 */
const initDeep = (fileLength, classLength) => {
  let pathDeep = ''
  let len = fileLength - classLength
  if(len === 0){
    pathDeep = './'
  }else{
    for(let i=0; i<len; i++){
      pathDeep += '../'
    }
  }
  return pathDeep
}
module.exports.flattenAndUnique = flattenAndUnique

module.exports.scanFiles = scanFiles

module.exports.initDeep = initDeep