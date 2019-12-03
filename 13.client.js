// 中间层

const http = require('http')

// request, get
//这样写没有跨域问题。默认创建一个新的端口，然后访问到http://localhost:3000上。
// http.get('http://localhost:3000', () => {
//   console.log('发送请求');
// }); 

// 一般用request 方法，可以发送请求体，也可以用axios
let config = {
  port: '3000',
  pathname: 'localhost',
  headers: {
    // a:1,
    // 'Content-Type': 'application/x-www-form-urlencoded'
  },
  method: 'post'
};

// 发送请求，返回结果会给res，但是这个方法没有错误返回
// 请求后，会将响应的结果，放到函数中
// 还需要注意的是，发送的post 请求，需要通知是否发送完毕请求，然后关闭
let client = http.request(config, (res) => {
  res.on('data', (chunk)=> {
    // console.log('下面的client.end("a=1")是向服务端发送信息');
    // console.log('chunk已经经过服务端的修改');
    // console.log('客户端获取到的数据');
    console.log(chunk.toString());
  })
})

// 可写流，可以通过这个方式来关闭
// 此处的数据格式，需要与headers中定义的contennt-type 有所呼应
client.end('eeee');