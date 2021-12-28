const postcss = require('postcss');
const fs = require('fs');

/**
 * 收集文件中所有class节点
 * @param Files 不同分包或者主包下的文件
 * @returns {Object} 返回所有文件下的样式数组
 */
const collectClass = async (Files) => {
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
            postcss(postCssCollect({
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
const postCssCollect = (options = {})  => {
  const classCollection = options.classCollection
  return {
    postcssPlugin:'postcss-get-common',
    Rule(node) {
      if(node.parent.type === 'root'){
        classCollection.push(node.selector)
      }
    },
    AtRule: {
      media: (atRule) => {
        let commonRule = atRule.name + atRule.params 
        atRule.nodes.forEach((rule)=>{
          commonRule += rule.selector
          rule.nodes.forEach((node)=>{
            commonRule += node.prop 
            commonRule += node.value
          })
        })
        classCollection.push(commonRule)
      },
      keyframes: (atRule) => {
        let commonRule = atRule.name + atRule.params 
        atRule.nodes.forEach((rule)=>{
          commonRule += rule.selector
          rule.nodes.forEach((node)=>{
            commonRule += node.prop 
            commonRule += node.value
          })
        })
        classCollection.push(commonRule)
      }
    }
  }
}

module.exports.collectClass = collectClass