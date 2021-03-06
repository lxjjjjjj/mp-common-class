/**
 * 获取分包的公共样式
 * @param subpackagesArr 分包文件的样式
 * @returns {Object} 返回分包中的公共样式
 */
const compareSubpackageClass = (subpackagesArr, weight = 2) => {
  let commonClassObj = {}
  for(let subpackage in subpackagesArr){
    commonClassObj[subpackage] = {}
    subpackagesArr[subpackage].forEach(classItem => {
      classItem.forEach((item) => {
        if(!commonClassObj[subpackage][item]) {
          commonClassObj[subpackage][item] = 1
        }else{
          commonClassObj[subpackage][item] += 1
        }
      })
    })
  }
  for(let commonClass in commonClassObj){
    for(let i in commonClassObj[commonClass]){
      if(commonClassObj[commonClass][i] < weight){
        delete commonClassObj[commonClass][i]
      }
    }
  }
  return commonClassObj
}

/**
 * 获取主包和分包的公共样式
 * @param filesArr 全部文件的样式
 * @returns {Object} 返回分包和主包中的公共样式
 */
const compareClass = (filesArr,weight = 2) => {
  let commonClassObj = {}
  for(let file in filesArr){
    filesArr[file].forEach(classItem => {
      if(!commonClassObj[classItem]) {
        commonClassObj[classItem] = 1
      }else{
        commonClassObj[classItem] += 1
      }
    })
  }
  for(let commonClass in commonClassObj){
    if(commonClassObj[commonClass] < weight){
      delete commonClassObj[commonClass]
    }
  }
  return commonClassObj
}

/**
 * 获取分包的原子类样式并且输出到文件中
 * @param filesArr 全部文件的样式
 * @returns { Object } 分包公共样式文件
 */
 const writeAtomicClass = (subpackagesArr) => {
  let commonClassObj = {}
  for(let subpackage in subpackagesArr){
    commonClassObj[subpackage] = {}
    subpackagesArr[subpackage].forEach(classItem => {
      classItem.forEach((item) => {
        if(!commonClassObj[subpackage][item]) {
          commonClassObj[subpackage][item] = 1
        }else{
          commonClassObj[subpackage][item] += 1
        }
      })
    })
  }
  return commonClassObj
}
module.exports.compareClass = compareClass

module.exports.compareSubpackageClass = compareSubpackageClass

module.exports.writeAtomicClass = writeAtomicClass