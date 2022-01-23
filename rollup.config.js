import babel from 'rollup-plugin-babel';
import {uglify} from 'rollup-plugin-uglify';


export default {
  input: 'src/index.js', // 入口文件
  output: {
    format: 'umd',
    file: 'index.js', // 打包后输出文件
    name: 'commonClass',  // 打包后的内容会挂载到window，name就是挂载到window的名称
    sourcemap: true // 代码调试  开发环境填true
  },
  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    // 压缩代码
    uglify(),
  ]
}