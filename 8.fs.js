

/*
{
  const fs = require('fs');

  // 读取文件不存在会报错
  // 写入文件，文件不存在会创建
  fs.readFile('a.txt',function(err,data) {
    if(err) {
      console.log(err);
      return;
    }
    console.log(data);
    // 写入文件，参数：文件路径、文件内容，回调函数
    // 复制一个a.txt
    fs.writeFile('b.txt',data+"hello",function() { 
      console.log("success");
    });
  });

  // 不适合大文件来使用，否则可能导致内存的浪费，限定为64K
  // 解决：读取一点，写入一点
}
*/


/*
// 异步读取文件
{
  // 读取一点，写入一点
  // 'r' 读取文件
  // 'w' 写入文件
  // 'r+' 在读的基础上可以写，但是文件不存在时会报错
  // 'w+' 在写的基础上读取，如果文件不存在时会创建
  const fs = require('fs')
  fs.open('a1.txt', 'r', (err, fd)=> { //fd 表示file descriptor，文件描述符，可以认为fd是读取的那个文件还有读的操作，它记录了这两件事
    if(err) {
      console.log(err);
      return;
    }
    // console.log(fd);
    let buffer = Buffer.alloc(3);
    fs.read(fd, buffer, 0, 3, 0, (err,byte) =>{// byte 是真正读取的个数，因为有可能没有三个
      console.log("读取完成");
      console.log(byte,buffer);
      console.log(byte,buffer.toString());

      fs.open('a.txt','w', (err, wfd) => {
        if(err) {
          return console.log(err);
        };
        // console.log(wfd);
        fs.write(wfd,buffer,0,3,0,(err)=> {
          if(err) {
            return console.log(err);
          }
          console.log("written,buffer");
          console.log("写入成功");
        });

        fs.close(wfd,()=> {
          console.log("关闭写");
        });
      });

      // 读取完成后要关闭，因为读取文件有它自己的线程
    });
    fs.close(fd,(err)=> {
      if(err) {
        console.log(err);
        return;
      }
      console.log("关闭读");
    });
  });
}
*/

// 异步方式，已理解
/*
{
  const fs = require('fs');
  fs.open('a1.txt','r',(err, rfd) => {
    if(err)return console.log(err.code+" r-open");
    fs.open('111a.txt', 'w', (err, wfd) => {
      if(err)return console.log(err.code+" w-open");
      let buffer = Buffer.alloc(100);
      fs.read(rfd,buffer,0,3,0,(err,bytesRead)=> {
        if(err)return console.log(err.code+" read");
        console.log(bytesRead);//为实际读取的字节数
        // 将读到的buffer写入三次，readFile是打开后清空然后再写入
        fs.write(wfd, buffer,0,bytesRead,0,(err)=> {
          if(err)return console.log(err.code+" write");
          console.log("success");
        });
        // fs.write(wfd, buffer,0,12,12,(err)=> {
        //   if(err)return console.log(err);
        //   console.log("success");
        // });
        // fs.write(wfd, buffer,0,12,24,(err)=> {
        //   if(err)return console.log(err);
        //   console.log("success");
        // });
      });
    })
  });
}
*/

// async + await
{
  const fs = require('fs');

  async function fn() {
    try {
      let rfd = await fs.openSync('111a.txt', 'r');
      let wfd = await fs.openSync('a.txt', 'w');
      let buffer = Buffer.alloc(100);
      let len = await fs.readSync(rfd, buffer, 0, 100, 0);
      console.log(len); //len 为实际的长度
      // console.log(buffer.slice(0,len));
      await fs.writeSync(wfd, buffer.slice(0, len)); //将有数据的部分传入
      console.log("success");
    } catch (error) {
      throw new Error(error.code);
    }
  }
  fn().then(res => {
    console.log(res);
  }).catch(err=> {
    console.log(err);
  });
}

// 异步迭代 套路 创建一个 next() 
{
  const fs = require('fs');

  const SIZE = 5;
  let buffer = Buffer.alloc(SIZE);
  // 需要判断err
  fs.open('111a.txt','r',(err, rfd)=> {
    fs.open('b1.txt','w',(err,wfd) => {
      let readOffet = 0;
      let writeOffet = 0;
      //co函数 异步递归
      function next() {
        fs.read(rfd,buffer,0,SIZE,readOffet, (err,bytesRead) => {
          if(bytesRead === 0) {
            // 如果没有字节要读了，就退出递归，并关闭fd
            fs.close(wfd,()=>{});
            // 防止关了读的，写不到了
            return fs.close(rfd,()=>{});
          }
          fs.write(wfd,buffer,0,bytesRead,writeOffet, (err)=> {
            readOffet += bytesRead;
            writeOffet += bytesRead;
            // console.log('success');
            next();
          });
        })
      }
      next();
    });
  });
}

/*
// 同步读取文件
{
  const fs = require('fs');
  // fs.open('a1.txt','r',(err,fd)=> {
  //   if(err) {
  //     return console.log(err.path);
  //   }
  //   console.log(fd);
  // });

  const size = 10;
  let buffer = Buffer.alloc(size);
  // 同步

  // 打开文件，获取到readFd
  try {
    var readFd = fs.openSync('a.txt','r');
  } catch (error) {
    console.log(error.code);
  }
  console.log(readFd);
  // 读取文件，文件内容保存到buffer中
  try {
    var readFlag = fs.readSync(readFd,buffer,0,size,0);
  } catch (error) {
    console.log(error.code);
  }
  console.log(readFlag);
  console.log(buffer.toString());
  // 关闭读取
  fs.closeSync(readFd);

  // 打开文件，获取writeFd
  let writeFd = fs.openSync('a1.txt', 'w');
  // 写入文件，将保存在buffer中的文件写入
  try {
    var writeFlag = fs.writeSync(writeFd, buffer);
  } catch (error) {
    console.log(error.code);
  }
  console.log(writeFlag);
  // 关闭写入
  fs.closeSync(writeFd);
}
*/



/*
{
  // 尝试读取图片信息，并复制一张图片
  const fs = require('fs');

  fs.readFile('images/mm5.jpg',function (err,data) {
    if(err) {
      console.log(err);
      return;
    }
    // console.log(data);
    fs.writeFile('zz.jpg',data,function (err) {
      if(err) {
        console.log(err);
        return;
      }
      console.log("success");
    })
  });
}
*/