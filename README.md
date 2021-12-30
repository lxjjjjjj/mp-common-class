# mp-common-class

一个可以提取形如微信小程序项目目录中公共样式的脚本,

可以提取每个文件夹(分包)内的公共样式,

也可以提取整个项目中文件夹的各个文件夹(分包)中的公共样式

### 支持
1.只提取主包的样式

2.提取主包和部分分包的样式

3.提取主包和全部分包的样式

4.只提取全部分包样式

5.只提取部分分包样式 
### 参数

commonStyle 公共样式文件名称

fileRoot 项目总目录 默认为空

cssName css文件后缀 默认wxss

mainPackage 是否需要将主包中的样式提取出来 是传true 否传false 默认false

subPackage 是否需要将分包中的样式提取到分包中 是传true 否传false 默认false

specSubPackage 指定的分包目录 如果无需指定传空数组即可

mainPackage 主包 | subPackage分包 | specSubPackage 指定分包 | 结果
---|--- | --- | ---
true | false | [] | 只提取主包样式
true | true | [] | 主包+全部分包
true | true | ['subpackage1'] | 主包+指定分包
false | true | [] | 所有分包
false | true | ['subpackage1'] | 指定分包

### 使用

npm i mp-common-class

mpCommonClass commonStyle fileRoot cssName mainPackage subPackage specSubPackage

example:
mpCommonClass './testCommon' 'dist/wx' 'wxss' true false []"
