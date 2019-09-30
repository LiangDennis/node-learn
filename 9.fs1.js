
// fs 能够操作文件
// 删除文件，给文件改名

// 具体方法
// fs.access fs.existsSync 文件是否存在
// fs.readFile fs.readFileSync 读取文件
// fs.writeFile fs.writeFileSync 写入文件
// fs.rename 重命名
// fs.unlink 删除文件

// 其他方法 next() 递归

// ----------------同时还有文件夹的方法--------------------

/*
const fs = require('fs');

// 添加文件
setTimeout(() => {
  fs.writeFile('b.txt',"hello",err => err ? console.log(err) : console.log("success file"));
}, 1000);

// 没有文件时会报错
// 给文件改名
fs.rename('b1.txt','b111.txt',err=> err ? console.log(err) : console.log("success"));

// 删除文件
setTimeout(() => {
  fs.unlink('b.txt',err => err ? console.log(err) : console.log("success unlink"));
}, 2000);
*/


// 文件夹的方法
// 创建目录 删除目录 读取目录
{
  // const fs = require('fs');

  // 创建文件夹的要求
    /**
     * 1.已创建的文件夹，不能重复创建，否则会报错。
     * 2.创建文件夹只能一层一层的创建，否则会报错。
     */

  // fs.mkdirSync('a-images');
  // fs.mkdirSync('a-images/b-images');
  // fs.mkdirSync('a-images/b-images/c-images/d-images');

  // 删除文件夹的要求
    /**
     * 1.删除文件夹只能一层一层的删除，不能总体删除，否则会报错
     */
  // fs.rmdirSync('a-images/b-images');
  // fs.rmdirSync('a-images');

}

/**
 * 需求 
 *    封装 参数 a/b/c/d/e/f 的方法
 *    异步迭代的套路
 */

 
{
  const fs = require('fs')
  // 使用异步的
  function mkdir(path, callback) {
    path = path.split("/");
    let index = 1;
    // 判断path是否已经存在，存在就创建下一层，否则就创建
    function  next() {
      console.log("begin");
      if(index === path.length+1) return callback();
      let dirpath = path.slice(0,index++).join("/");
      fs.access(dirpath, (err) => {
        console.log("access");
        if(err) {
          console.log("mkdir");
          // 不存在
          fs.mkdir(dirpath,next);
        }else {
          console.log("next");
          next();//存在创建下一层
        }
      })
    }
    next(); // 记得调用触发
  }
  mkdir("a/b/c/d/e/f",()=> {
    console.log("创建完成");
  })
}


// next方法透析
/*
{
  let i =0;
  function next() {
    if(i < 10) {
      console.log(i++);
      next();
    }else {
      return ;
    }
  }
  next();
}
*/
/*
{
  function show(i,callback) {
    let oneTime = 0;
    let twoTime = 0;
    function next() {
      // 将callback独立出来，而不应该在迭代中
      if(oneTime===6) return callback();
      if(i<3) {
        oneTime++;
        console.log(i++);
        // console.log("loading");
        show(i,next);
      }else {
        oneTime++;
        twoTime++;
        next();
        // console.log("before exit");
        // 不是这里调用callback
        // return callback();
      }
    }
    next();
    console.log("oneTime:"+oneTime);
    console.log("twoTime:"+twoTime);
  }
  show(0,()=> {
    console.log("success");
  })
}
*/