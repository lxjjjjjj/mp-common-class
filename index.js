const { collectClass } = require('./collectClass.js')
const { compareSubpackageClass, compareClass} = require('./compareClass.js')
const { normalizeSubpackageClass, normalizeClass} = require('./normalizeClass.js')
const { normalizeFiles } = require('./normalizeFiles.js')
const { flattenAndUnique } = require('./utils.js')


const init = async ({commonStyle, fileRoot, cssName, mainPackage, subPackage, specSubPackage, alreadyScanFiles, classObj}) =>{
  let errno = 0, msg = '编译完成'

  if(mainPackage && !fileRoot){
    msg = '如果是需要提取整个文件的公共样式, 需要写扫描文件入口! 如果不需要可以不传 mainPackage 参数'
    errno = 1
    return new Promise((resolve, reject)=>{
      resolve({
        msg,
        errno
      })
    })
  }

  if(subPackage && specSubPackage &&!specSubPackage.length && !fileRoot){
    msg = '如果是需要提取所有分包的公共样式, 需要写扫描文件入口! 如果提取部分分包的公共样式需要添加 subpackagefileDir 参数'
    errno = 2
    return new Promise((resolve, reject)=>{
      resolve({
        msg,
        errno
      })
    })
  }

  if(!subPackage && !mainPackage && !alreadyScanFiles){
    msg = '如果既不扫描主包也不扫描分包，请提供扫描之后的数据'
    errno = 3
    return new Promise((resolve, reject)=>{
      resolve({
        msg,
        errno
      })
    })
  }

  if(!cssName){
    cssName = 'wxss'
    msg = '如果没有传css文件后缀默认文件后缀为wxss'
    errno = 0
  }

  if(!commonStyle){
    commonStyle = `commonStyle`
    msg = '如果没有设定公共样式文件名称，默认为名为commonStyle'
    errno = 0
  }


  if(alreadyScanFiles){
    const { mainfiles, subpackagefiles, mainClass, subpackageClass } = classObj
    const files = Object.assign({},subpackagefiles,mainfiles)
    await mainPackage && normalizeClass(files,compareClass(flattenAndUnique(Object.assign({},mainClass,subpackageClass), fileRoot)),fileRoot, commonStyle, cssName)
    subPackage && normalizeSubpackageClass(subpackagefiles, compareSubpackageClass(subpackageClass), commonStyle, cssName)
  }else{
    await normalizeFiles({fileRoot, cssName, mainPackage, subPackage, specSubPackage}).then(res=>{
      const {mainfiles, subpackagefiles} = res
      Promise.all([collectClass(mainfiles),collectClass(subpackagefiles)]).then((res)=>{
        const files = Object.assign({},subpackagefiles,mainfiles)
        mainPackage && normalizeClass(files,compareClass(flattenAndUnique(Object.assign({},res[0],res[1]), fileRoot)),fileRoot, commonStyle, cssName)
      }).then(()=>{
        collectClass(subpackagefiles).then((res)=>{
          subPackage && normalizeSubpackageClass(subpackagefiles, compareSubpackageClass(res), commonStyle, cssName)
        })
      })
    })
  }
  return new Promise((resolve, reject)=>{
    resolve({
      msg,
      errno
    })
  })
}

module.exports = init