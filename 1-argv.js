// console.log("hello");

// 一、global对象

// 1.此处打印this用node环境打开的话是module.exports
// console.log(this);

// 2.可以直接输出global对象或者在匿名函数中调用this
// console.log(global);
(function () {
  // console.log(Object.keys(this));
})()

// 3.打印进程process
// console.log(process);
// console.log(process.platform);

// 关于process的常用参数解释
// argv代表用户传递的参数，默认有两个参数，没有实际意义
  // 执行node，只能通过命令 + 文件名 + 参数
  // console.log(process.argv.slice(2)); //收集用户参数
  // 将process.argv变成一个对象，你能够更好的获取其中的参数
  let config = process.argv.slice(2).reduce((memo,current,index,array) => {
    // 判断--是否存在，存在就将其作为key值，并将它作为value值
    if(current.includes("--")) {
      memo[current.slice(2)] = array[index];
    }
    return memo;
  },{}); // 此处的空对象是传给config的。
  // console.log(config);
  // 介绍：创建vue-cli时会用到process 命令行管家 帮你提供--help，必须先安装
    const program = require('commander');
    const chalk = require('chalk');
    // 配置命令，如执行一个程序
    program
      .command('create')
      .alias('c')//别名
      .description('create project')
      .action(()=>{
        console.log('create project');
        return false;
      })
    // 配置参数
    // 解析用户的参数，默认提供--help
    program
      .option('-p , --port <val>', 'set port')
      .version('1.2.0')
      // 订阅事件
      program.on('--help',()=>{
        console.log("\r\nExamples");
        console.log("  node 1.js --help");
        console.log("  node 1.js create    "+chalk.green('progress'));
      })
      .parse(process.argv)//最后解析，才可解析上述部分
      // chalk 粉笔 将命令行的一些字体设置颜色
    console.log(program.port);
// pid可以删除进程 chdir
// cwd() 用的表较多，意义：current wroking directory
// env 环境变量
// nextTick node中的微任务