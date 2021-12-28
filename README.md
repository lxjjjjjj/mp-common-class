# mp-common-class
一个可以提取形如微信小程序项目目录中公共样式的脚本

### 支持
1.只提取部分分包样式 

2.提取分包和主包的样式 

3.提取部分分包和主包的样式 

4.只提取全部分包样式 

### 参数

fileRoot 项目总目录 默认为空

cssName css文件后缀 默认wxss

subpackagefileDir 分包目录 默认空数组

needAllFileClass 是否需要将主包和分包中的样式提取出来 是传true 否传false 默认false

### 使用

npm i mp-common-class

mpCommonClass './testCommon' 'dist/wx' 'wxss' '' false"
