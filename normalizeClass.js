const postcss = require('postcss');
const path = require('path');
const fs = require('fs');

/**
 * 将分包中的公共样式输出到分包的公共样式文件中
 * @param subpackageFiles 分包下的样式文件列表
 * @param commonClass 属于这个分包的公共样式
 */
const normalizeSubpackageClass = (subpackageFiles,commonClass) => {
  for(let subpackage in subpackageFiles){
    let subpackageCommonRoot = postcss.parse('')
    for(let i in commonClass[subpackage]) { commonClass[subpackage][i] = 1 }
    subpackageFiles[subpackage].map((file) => {
      fs.readFile(file, (err,data) => {
        if(err) throw err
        postcss(postCssNormallize({
          subpackageCommonRoot,
          commonClass:commonClass[subpackage],
          importClass:path.join(subpackage,`${commonStyle}`)
        })).process(data).then(function(res){
          fs.writeFile(`${file}`, res.css,() => {
            if (err) throw err;
            // console.log('The file has been saved!');
          })
          fs.writeFile(path.join(subpackage,`${commonStyle}`),subpackageCommonRoot.toString(),()=>{
            if (err) throw err;
            // console.log('The file has been saved!');
          })
        });
      })
    })
  }
}

/**
 * 将分包和主包中的公共样式输出到主包中的公共文件中
 * @param files 主包和分包中的公共样式
 * @param commonClass 属于这个分包的公共样式
 * @param importClass 公共样式文件的路径
 */
const normalizeClass = async (files,commonClass,importClass) => {
  for(let i in commonClass) { commonClass[i] = 1 }
  let subpackageCommonRoot = postcss.parse('')
  for(let fileName in files){
    files[fileName].map((file)=>{
      fs.readFile(file, (err,data)=>{
        if(err) throw err
        postcss(postCssNormallize({
          subpackageCommonRoot,
          commonClass:commonClass,
          importClass:path.join(importClass,`${commonStyle}`)
        })).process(data).then(function(res){
          fs.writeFile(`${file}`,res.css,()=>{
            if (err) throw err;
            // console.log('The file has been saved!');
          })
          fs.writeFile(path.join(importClass,`${commonStyle}`),subpackageCommonRoot.toString(),()=>{
            if (err) throw err;
            // console.log('The file has been saved!');
          })
        });
      })
    })
  }
}

/**
 * 将公共样式在原文件中删除 并将公共样式输出到公共样式文件中
 * @param options postcss的options 有公共样式文件节点 公共样式 输出公共样式的文件路径
 */
const postCssNormallize = (options = {})  => {
  const { subpackageCommonRoot, commonClass, importClass } = options
  let appendImport = false
  return {
    postcssPlugin:'postcss-delete-add',
    Rule(node) {
      if(node.parent.type === 'root'){
        if(commonClass[node.selector]){
          if(!appendImport){
            appendImport = true
            node.parent.prepend(new postcss.AtRule({ name: 'import', params: `\"${importClass}\"` }))
          }
          commonClass[node.selector] === 1 && subpackageCommonRoot.append(node.clone())
          node.parent.removeChild(node)
          commonClass[node.selector] = commonClass[node.selector] + 1
        }
      }
    },
    AtRule: {
      media: (atRule) => {
        let commonAtRule = atRule.name + atRule.params 
        atRule.nodes.forEach((rule)=>{
          commonAtRule += rule.selector
          rule.nodes.forEach((node)=>{
            commonAtRule += node.prop 
            commonAtRule += node.value
          })
        })
        if(commonClass[commonAtRule]){
          if(!appendImport){
            appendImport = true
            atRule.parent.prepend(new postcss.AtRule({ name: 'import', params: `\"${importClass}\"` }))
          }
          commonClass[commonAtRule] === 1 && subpackageCommonRoot.append(atRule.clone())
          atRule.parent.removeChild(atRule)
          commonClass[commonAtRule] += 1
        }
      },
      keyframes: (atRule) => {
        let commonAtRule = atRule.name + atRule.params 
        atRule.nodes.forEach((rule)=>{
          commonAtRule += rule.selector
          rule.nodes.forEach((node)=>{
            commonAtRule += node.prop 
            commonAtRule += node.value
          })
        })
        if(commonClass[commonAtRule]){
          if(!appendImport){
            appendImport = true
            atRule.parent.prepend(new postcss.AtRule({ name: 'import', params: `\"${importClass}\"` }))
          }
          commonClass[commonAtRule] === 1 && subpackageCommonRoot.append(atRule.clone())
          atRule.parent.removeChild(atRule)
          commonClass[commonAtRule] += 1
        }
      }
    }
  }
}

module.exports.normalizeSubpackageClass = normalizeSubpackageClass
module.exports.normalizeClass = normalizeClass