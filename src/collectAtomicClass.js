const postcss = require('postcss');
const fs = require('fs');
const { handleTransCompoundtoSingle } = require('./transfer')
/**
 * 收集文件中所有原子类class节点
 * @param Files 不同分包或者主包下的文件
 * @returns {Object} 返回所有文件下的样式集合
 */
const collectAtomicClass = async (Files) => {
  if(!Object.keys(Files).length) return

  let AllClass = {}
  let promiseArr = []

  for(let filePackage in Files){
    AllClass[filePackage]= new Array(Files[filePackage].length)
    Files[filePackage].forEach((file,index)=>{
      AllClass[filePackage][index]=[]
      promiseArr.push(
        new Promise((resolve,reject)=>{
          fs.readFile(file, (err,data) => {
            if(err) reject(err)
            postcss(postCssAtomicCollect({
              classCollection: AllClass[filePackage][index]
            })).process(data).then(()=>{
              resolve()
            }).catch((err)=>{
              reject(err)
              console.log(err,'收集class阶段wxss文件执行失败')
            })
          })
        })
      )
    })
  }
  await Promise.all(promiseArr).catch(err=>{
    console.log('postCssCollect err',err)
  })
  return new Promise((resolve,reject) => {
    resolve(AllClass)
  })
}

/**
 * 遍历css文件
 * @param options postcss插件的传参 目前传一个收集样式的集合
 */
const postCssAtomicCollect = (options = {})  => {
  const classCollection = options.classCollection
  return {
    postcssPlugin:'postcss-get-common',
    Rule(node) {
      if(node.parent.type === 'root'){
        node.nodes.forEach((rule)=>{
          const trasferClass = handleTransCompoundtoSingle(rule.prop, rule.value)
          if(trasferClass) {
            Object.keys(trasferClass).forEach(key => {
              let commonRule = ''
              commonRule += key + ' : '
              commonRule += trasferClass[key] + ' : '
              classCollection.push(commonRule)
            })
          } else {
            classCollection.push(`${rule.prop} : ${rule.value}`)
          }
        })
      }
    },
    AtRule: {
      media: (atRule) => {
        atRule.nodes.forEach((rule)=>{
          rule.nodes.forEach((node)=>{
            const trasferClass = handleTransCompoundtoSingle(node.prop, node.value)
            if(trasferClass) {
              Object.keys(trasferClass).forEach(key => {
                let commonRule = ''
                commonRule += key + ' : '
                commonRule += trasferClass[key] + ' : '
                classCollection.push(commonRule)
              })
            } else {
              classCollection.push(`${rule.prop} : ${rule.value}`)
            }
          })
        })
      },
      keyframes: (atRule) => {
        atRule.nodes.forEach((rule)=>{
          rule.nodes.forEach((node)=>{
            const trasferClass = handleTransCompoundtoSingle(node.prop, node.value)
            if(trasferClass) {
              Object.keys(trasferClass).forEach(key => {
                let commonRule = ''
                commonRule += key + ' : '
                commonRule += trasferClass[key] + ' : '
                classCollection.push(commonRule)
              })
            } else {
              classCollection.push(`${rule.prop} : ${rule.value}`)
            }
          })
        })
      }
    }
  }
}

module.exports.collectAtomicClass = collectAtomicClass