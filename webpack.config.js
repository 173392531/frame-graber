module.exports = {
    devServer: {//开发服务器配置
      port: 3000,//客户端的端口号
      progress: true,//进度条
      contentBase: "./dist",//返回的资源目录
      compress: true,//是否压缩
      proxy: {
        "/api": "http://localhost:3000"//转发请求到3000端口号
      }
    },
  }
  