const { collectClass } = require('./collectClass.js')
const { compareSubpackageClass, compareClass} = require('./compareClass.js')
const { normalizeSubpackageClass, normalizeClass} = require('./normalizeClass.js')
const { normalizeFiles } = require('./normalizeFiles.js')
const { flattenAndUnique } = require('./utils.js')


const init = async ({commonStyle, fileRoot, cssName, subpackagefileDir, needAllFileClass}) =>{
  let errno=0, msg=''
  if(needAllFileClass && !fileRoot){
    msg = '如果是需要提取整个文件的公共样式, 需要写扫描文件入口! 如果不需要可以不传 needAllFileClass 参数'
    errno = 1
  }

  if(subpackagefileDir && !subpackagefileDir.length && !fileRoot){
    msg = '如果是需要提取所有分包的公共样式, 需要写扫描文件入口! 如果提取部分分包的公共样式需要添加 subpackagefileDir 参数'
    errno = 2
  }

  if(!cssName){
    cssName = 'wxss'
    msg = '如果没有传css文件后缀默认文件后缀为wxss'
    errno = 0
  }

  if(!commonStyle){
    commonStyle = `./commonStyle`
    msg = '如果没有设定公共样式文件名称，默认为名为commonStyle'
    errno = 0
  }

  needAllFileClass = needAllFileClass === 'false' ? false : needAllFileClass

  await normalizeFiles({fileRoot, cssName, subpackagefileDir, needAllFileClass}).then(res=>{
    const {mainfiles, subpackagefiles} = res
    Promise.all([collectClass(mainfiles),collectClass(subpackagefiles)]).then((res)=>{
      const files = Object.assign({},subpackagefiles,mainfiles)
      needAllFileClass && normalizeClass(files,compareClass(flattenAndUnique(Object.assign({},res[0],res[1]), fileRoot)),fileRoot, commonStyle, cssName)
    }).then(()=>{
      collectClass(subpackagefiles).then((res)=>{
        normalizeSubpackageClass(subpackagefiles, compareSubpackageClass(res), commonStyle, cssName)
      })
    })
  })
  return new Promise((resolve, reject)=>{
    resolve({
      msg,
      errno
    })
  })
}

module.exports = init