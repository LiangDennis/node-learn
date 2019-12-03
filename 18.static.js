const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs').promises
const {
  createReadStream
} = require('fs')
const mime = require('mime')

// 提供一个静态服务，然后封装成类

class HttpServer {
  // 第二种方式，通过constructor 方式
  constructor() {
    // 在初始的时候就执行
    this.handleRequest = this.handleRequest.bind(this)
  }

  async handleRequest(req, res) {
    let {
      pathname,
      query
    } = url.parse(req.url, true)
    let filepath = path.join(__dirname, pathname)
    // 无论是不是文件，都要发送过去，所以将这个方法封装一下，
    // 方便以后测试，每个功能松散，
    try {
      let statObj = await fs.stat(filepath);// 文件是否存在
      console.log(filepath);
      this.sendFile(statObj, filepath, req, res);// 就把文件发回去
    } catch (error) {
      this.sendError(error, res)
    }
  }
  async sendFile(statObj, filepath, req, res) { // 发送文件需要判断是不是目录
    if (statObj.isDirectory()) {
      // 测试多层的文件夹
      // filepath = path.join(filepath, '16.index.html') // 增加index.html
      // filepath = path.join(filepath, 'images/mm6.jpg') // 增加index.html
      console.log(filepath);
      filepath = path.join(filepath, 'images/img/mm6.jpg') // 增加index.html
      // await 需要使用try catch捕获异常
      try {
        await fs.access(filepath) // 如果有就继续
      } catch (error) {
        this.sendError(error, res) // 没有就报错
      }
    }
    // 返回文件逻辑
    res.setHeader('Content-Type', mime.getType(filepath) + ';charset=utf-8');
    // 提问者问题：找到了index.html 文件为什么不用塞进end 函数里面去，也可以返回给客户端
    // res.write() res.end() pipe()的方式，它其实调用的end 的方法，这是流的原理
    createReadStream(filepath).pipe(res); 
  }
  sendError(e, res) {
    console.log(e);
    res.statusCode = 404;
    res.end('Not Found')
  }
  // 开启一个服务
  start(...args) {
    // 此处的this 会指向createServer，但是希望指向的是HttpServer
    // 第一种方式，直接绑定this，需要在浏览器中请求，才能看到结果，比较简单
    // let server = http.createServer(this.handleRequest.bind(this))
    // 第二种方式，通过constructor 的方式
    let server = http.createServer(this.handleRequest)
    server.listen(...args)
  }

}

let hs = new HttpServer();
hs.start(3000, () => {
  console.log(`start server`);
})