const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
})

// module.exports = {
//   // 端口号配置
//   devServer: {
//     port: 8080,
//     open: true,// 自动打开浏览器
//   }
// }
