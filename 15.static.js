// 静态资源

// 浏览器 访问index.html --> style.css
const http = require('http')
const url = require('url')
const path = require('path')
const fs = require('fs')

// 链式写法
// http.createServer((req, res) => {

// }).listen(3000)

// 通过localhost:3000/16.index.html 的时候，index.html --> style.css
// server 当有访问时，将目录下的index.html返回给浏览器
let server = http.createServer((req, res) => {
  // fs 操作 绝对路径
  let {
    pathname
  } = url.parse(req.url);
  let filepath = path.join(__dirname, pathname)
  // console.log(filepath);
  // 获取到url上index.html的绝对路径，但是这个文件有可能是不存在的

  // exists（不支持异步），access（写起来还要判断两次），stat 三个都可以判断文件
  fs.stat(filepath, (err, statObj) => {
    if (err) {
      res.statusCode = 404;
      res.end('Not Found')
    } else {
      if(statObj.isDirectory()) {
        // 如果是文件夹 需要读取文件中的index.html
        filepath = path.join(filepath, '16.index.html')
        fs.access(filepath, (err) => {
          if(err) {
            res.statusCode = 404;
            res.end('Not Found')
          }else {
            // readFile writeFile pipe
            res.setHeader('Content-Type', 'text/html;charset=utf-8')
            fs.createReadStream(filepath).pipe(res)
          }
        })
      }else {
        // 如果是文件读取出来就OK
        // 最好说这个文件是什么类型
        let t = require('mime').getType(filepath)
        res.setHeader('Content-Type', t+';charset=utf-8')
        fs.createReadStream(filepath).pipe(res)
      }
    }
  })
})

server.listen(3000)

// 同时也有更好的写法，用类去写