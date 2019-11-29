// 流 读取文件

const fs = require('fs')

// flags?: string;
// encoding?: string;
// fd?: number;
// mode?: number;
// autoClose?: boolean;
// start?: number;
// end?: number;
// highWaterMark?: number;
let rs = fs.createReadStream('111a.txt', {
  flags: 'r',
  encoding: null,
  mode: 0o666,
  autoClose: true,
  start: 0,
  // end: 102,
  highWaterMark: 12, //一般不需要设置
})
rs.on('open', (fd) => {
  console.log('open');
  console.log(fd);
})

let arr = [];
let times = 0;

// 箭头函数没有this变量
rs.on('data', function (data) {
  console.log('data');
  console.log(data);
  this.pause();
})
rs.on('end', (event) => {
  console.log('end');
  console.log(Buffer.concat(arr).toString());
  console.log(event);
})
rs.on('close', (event) => {
  console.log('close');
  console.log(event);
})
rs.on('error', (err) => {
  console.log('error');
  console.log(err);
})

// 比较常用的方法
// data， end， Buffer.concat()
{
  console.log("--------------------------------------");
  const fs = require('fs');
  const rs = fs.createReadStream('111a.txt');

  // 用一个数组存储数据
  let arr = [];

  // 检测data事件，获取数据，并将数据传入data中。
  rs.on('data', (data) => {
    // console.log(data);
    arr.push(data);
  });

  // 检测end事件，将数据通过buffer转换成正式格式
  rs.on('end', (event) => {
    let fileData = Buffer.concat(arr).toString();
    console.log(fileData);
  });
}