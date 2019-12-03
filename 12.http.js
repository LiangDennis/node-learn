// 通过node 实现一个http 服务
// 都是通过核心模块来提供的 http 模块
const http = require('http')
const http2 = require('http2')
const https = require('https')

// 服务需要有特定的ip 和端口号
let server = http.createServer();

// 查询字符串的方法库
let querystring = require('querystring')

let url = require('url'); //方法 parse
// 一个完整的url
let requestUrl = 'http://username:password@github.com:80/s?offset=1&limit=30#app'
; let result = url.parse(requestUrl,true);
// console.log(result);
/*
Url {
  protocol: 'http:',
  slashes: true, 是否有/
  auth: 'username:password', 用户信息
  host: 'github.com:80',
  port: '80',
  *** hostname: 'github.com',
  hash: '#app', 这里可以访问到这个，一般是访问不到的。
  *** query: 'offset=1&limit=30', 这里的query 可能不是我们想要的，可以通过parse（path，true），将这个query 转换成一个对象。
  *** pathname: '/s',
  path: '/s?offset=1&limit=30',
  href: 'http://username:password@github.com:80/s?offset=1&limit=30#app'
}
*/


// 当有请求时，可以通过方法获取到请求信息
// 此处的回调方法可以在 http.createServer()时回调，也可以在此处回调
server.on('request', (req, res) => {
  // 1.请求行
  console.log(req.method);
  let {pathname, query} = url.parse(req.url, true) //url 不包含# 
  console.log(pathname, query);
  console.log(req.httpVersion); //版本号
  // 2.请求头
  console.log(req.headers); //headers 都是小写
  // 3.获取请求体
  let arr = new Array();
  req.on('data', (chunk)=> {
    console.log('data');
    arr.push(chunk);
    console.log(chunk.toString()); // data 方法不一定触发，如get 请求，get请求没有请求体，
                        // 流的原理，push(null) 就不会走on -- data
  })
  req.on('end', ()=> {
    // console.log(Buffer.concat(arr).toString());
    console.log('end'); // end 一定会触发
    // 请求结束后，将响应返回给客户端
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    // res.end(Buffer.concat(arr)); 
    let content = Buffer.concat(arr).toString();
    let type = req.headers['content-type'];
    if(type === 'application/json') {
      let obj = JSON.parse(content)
      return res.end(obj.a+'');
    }else if(type === 'application/x-www-form-urlencoded') {
      // a=1&b=2 表单形式的分解，正则 /[^=&]=[^=&]/
      // 正则比较麻烦，可以在浏览器中测试以下三行代码
      // let str = 'a=1&b=2';
      // str.replace(/([^=&])=([^=&])/g, function(...arr) {
      //   console.log(arr);
      // })
      // 直接使用封装好的模块，querystring
      // 第二个参数是字段间的分隔符，第三个参数是key value分隔符
      let obj = querystring.parse(content, '&', '=')
      return res.end(obj.a+'')
    }else {
      return res.end(content)
    }

  })

  // 响应
  // 设置响应行，设置响应头，设置响应体
  // res.statusCode = 404; //响应状态码
  // res.setHeader('Content-Length', '1'); // 设置响应的内容只有一个字节
  // res.end('end');
  // res.end('123');

  // res.setHeader('Content-Type','text/plain;charset=utf-8;');
  // 不同浏览器有不同的区别，360极速浏览器能够将中文转换，而谷歌好像不行。
  // res.end('中文'); 
});


let port = 3000;

// 开启一个端口号，端口号一般是3000
server.listen(port, () => {
  console.log(`server start ${port}`);
});

// 如果另外打开这个文件，会报错，会报错就说明server能够监听错误
server.on('error', (err) => {
  if (err.errno === "EADDRINUSE") {
    // 这里不需要在回调了，因为会再执行一次回调
    server.listen(++port);
  }
})

// console.log(http);
// console.log(http2);
// console.log(https);