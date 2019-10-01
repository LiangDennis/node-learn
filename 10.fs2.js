

// 删除目录
/*
{
  const fs = require('fs')
  const path = require('path')

  // 只删除一层的目录结构，最终还要删除根目录a
  // 如何处理删除根目录a
  // 流程：fs.readdir fs.stat isFile fs.unlink fs.rmdir
  fs.readdir('a', (err,dirs)=> {
    if(err) {
      return console.log(err.code);
    }
    if(dirs.length <=0) {
      fs.rmdir('a',(err)=> {
        if(err) return console.log(err);
      });
      return console.log("remove ok")
    }

    dirs = dirs.map(dir=> path.join('a',dir));
    console.log(dirs);

    let index = 0;
    dirs.forEach(dir=> {
      fs.stat(dir,(err,statObj)=> {
        if(statObj.isFile()) {
          fs.unlink(dir,(err)=>{
            index++;
            if(index === dirs.length-1) {
              fs.rmdir('a',(err)=> {if(err) return console.log(err);});
            }
          });
        }else {
          fs.rmdir(dir,(err)=>{
            index++;
            if(index === dirs.length-1) {
              fs.rmdir('a',(err)=> {if(err) return console.log(err);});
            }
          });
        };
      })
    })
    fs.stat(dirs[0],(err,stats) => {
      console.log(stats.isDirectory());
    })
  });
}
*/

// ---------------------------递归删除目录---------------------------
// 深度 先序 串联
/*
{
  const fs = require('fs');
  const path = require('path');

  function preSeriesDeep(dir,callback) {
    // 思路：
    // 有儿子就删除儿子
    // 儿子删除完毕后删除自己 只想第一层和第二层的关系
  
    // 如果传进来的就是文件就直接删除

    // 如果dir是文件夹，里面只有一个文件，那么会先走else，因为传进来的a文件夹，而不是文件
    // 如果走的是else，因为callback是next，就会再执行一次next方法，当没有了文件了，就删除自己

    fs.stat(dir,(err,statObj)=>{
      if(err) {
        return console.log("not file or not derectory!"+err);
      }
      if(statObj.isFile()) {
        // 是文件删除即可
        fs.unlink(dir,callback);
      }else {
        fs.readdir(dir,(err,dirs)=> {
          dirs = dirs.map(item=> path.join(dir,item));
          let index = 0;
          function next() {
            if(index === dirs.length) return fs.rmdir(dir,callback)
            let currentPath = dirs[index++];
            // 删除当前第一个儿子 成功后删除第二个儿子，next是回调方法，执行完preSeriesDeep后才执行的方法
            preSeriesDeep(currentPath,next)
          }
          next();
        })
      }
    })
  }
  
  preSeriesDeep('a',() => {
    console.log("删除成功");
  });
}
*/

  // 总结：性能不高，因为将所有的目录串联起来了
    //   -> b -> c  ----删除
    // a -> e -> d  ----删除
    //   -> 1.js    ----删除


    // 深度 先序 并联
/*
{
  const fs = require('fs');
  const path = require('path');

  function preParallelDeep(dir,callback) {
    fs.stat(dir,(err,statObj)=> {
      if(statObj.isFile()) {
        fs.unlink(dir,callback);
      }else {
        fs.readdir(dir,(err,dirs)=> {
          dirs = dirs.map(item => path.join(dir,item));
          // 如果查询到没有儿子节点了 直接将自己删除即可，下面的再次调用preParallelDeep这个方法，也是通过这种方式删除
          if(dirs.length === 0) {
            return fs.rmdir(dir,callback);
          }

          // 这里可以想成是一个promise.all方法，就是将根节点的每个字节点删除，done也是promise.all方法的实现方式
          // 当所有的字节点都删除完成了，就删除自己
          let index = 0;
          function done() {
            if(++index === dirs.length) return fs.rmdir(dir,callback);
          }
          dirs.forEach(dir=> {
            preParallelDeep(dir,done);
          })
        })
      }
    })
  }
  preParallelDeep('a',()=>{
    console.log("remove ok");
  })
}
*/

// Promise 方式
/*
{
  const fs = require('fs')
  const path = require('path')

  function promiseFn(dir) {
    return new Promise((resolve,reject)=> {
      fs.stat(dir,(err,statObj)=> {
        if(statObj.isFile()) {
          // 删除成功的回调都是调用resolve
          fs.unlink(dir,resolve)
        }else {
          fs.readdir(dir,(err,dirs)=> {
            // 这里dirs返回的都是Promise对象，因此才可以使用Promise.all方法
            dirs = dirs.map(item=>promiseFn(path.join(dir,item)));
            // console.log(dirs);//[ 'a\\1.js', 'a\\b', 'a\\be' ]
            Promise.all(dirs).then(()=> {
              fs.rmdir(dir,resolve);//此处的dir不仅仅是传进来的'a'，而是每次调用的dir
            });
          })
        }
      })
    })
  }
  
  promiseFn('a').then(()=>{
    console.log("remove ok");
  })
}
*/

/*
// async 和 await
{
  const {rmdir,stat,readdir,unlink} = require('fs').promises
  const path = require('path')

  async function asyncAwait(dir) {
    try {
      let statObj = await stat(dir);
      if(statObj.isFile()) {
        await unlink(dir);
      }else {
        let dirs = await readdir(dir);
        dirs = dirs.map(item=> asyncAwait(path.join(dir,item)));
        // await也可以用在Promise之前
        // await Promise.all(dirs).then(()=> {
        //   rmdir(dir);
        // })
  
        // 视频写法
        await Promise.all(dirs);
        await rmdir(dir);
      }
    } catch (error) {
      console.log("错误是：");
      console.log(error);
    }
  }

  asyncAwait('a').then(()=> {
    console.log('remove ok');
  })
}
*/

/*
// 广度遍历删除 性能没有promise的性能高
// 使用队列将要删除的问件或者文件夹放进去
{
  const fs = require('fs');
  const path = require('path');

  function wide(dir) {
    let arr = [dir];
    let current = "";//当前的目录
    let index = 0;
    while(current = arr[index++]) {
      let dirs = fs.readdirSync(current);
      dirs = dirs.map(item => path.join(current,item));
      arr = [...arr,...dirs];//合并
    }
    // 循环删除即可，需要判断是否是文件
    // console.log(arr);
    for(let i=arr.length-1;i>=0;i--) {
      let statObj = fs.statSync(arr[i]);
      if(statObj.isFile()) {
        fs.unlinkSync(arr[i]);
      }else {
        fs.rmdirSync(arr[i]);
      }
    }
    console.log('remove ok');
  }
  wide('a');
}
*/


{
  // 异步广度删除
  // 找到所有的文件及文件夹，完成一个完整的文件队列
  // 所有完成后，删除所有文件夹

  const fs = require('fs')
  const path = require('path')

  function asyncWide(dir,callback) {
    let arr = [dir];
    let current = "";
    let index = 0;
    current = arr[index]
    fs.readdir(current,(err,dirs)=> {
      console.log(dirs);
    })
  }
  asyncWide('a',()=>{
    console.log('remove ok');
  });
}
