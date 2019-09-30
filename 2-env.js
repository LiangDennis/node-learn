
// 1.chair cwd() current working directory

const path = require('path');
console.log(path.resolve());
console.log(process.cwd()); //在哪里执行就是代表哪里

// 2.env 环境变量
// 设置环境变量
console.log(process.env.a);

// 配置开发或者生产环境
let url = "";
if(process.env.NODE_ENV === "development") {
  url = "localhost"
}else {
  url = "www"
}
console.log(url);
// 开发时：localhost，生产时：www.xxx.cn
// 临时变量在命令行中获取 export（mac），set（window）
  // set NODE_ENV=development
  // node app.js

  // 3.微任务，nextTick node 中的微任务 Vue.nextTick
  // Vue.nextTick使用的是Promise，而node中是自身封装的nextTick

  // 微任务、node的nextTick比Promise快，用异步不需要用Promise，用nextTick
  Promise.resolve().then(()=> {console.log("Promise")});
  process.nextTick(() => {
    console.log("nextTick");
  })
  // 事件环
  // 浏览器的事件环有两个队列：一个定时器的，一个微任务的
  // node 的事件环有六个队列：最好看day5视频，重要的有timer（setTimeout，setInterval），poll（轮询），check（setImmediate）
  // 结束一个poll或者check都会清空微任务，微任务为promise和process.nextTick()
  let fs = require('fs')
  fs.readFile('./1-argv.js',(file)=> {
    setTimeout(() => {
      console.log("settimeout");
    }, 0)
    setImmediate(() => {
      console.log("setImmediate");
    })
    console.log(file);
  });

  // 此处输出与视频不一致，可能是node的版本不一致
  setTimeout(() => {
    console.log('timeout1');
    Promise.resolve().then(() => {
      console.log("promise1");
    })
  }, 0);
  Promise.resolve().then(() => {
    console.log("promise2");
    setTimeout(() => {
      console.log('timeout2')
    }, 0);
  })