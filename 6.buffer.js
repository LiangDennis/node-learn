

const fs = require('fs');
const path = require('path')

let r = fs.readFileSync(path.resolve(__dirname,"a.txt"));

{
  // console.log("读取图片");
  // const fs = require('fs');
  // const path = require('path')
  // let r = fs.readFileSync(path.resolve(__dirname,"images/mm5.jpg"));
  // let buff = Buffer.from(r);
  // console.log(buff);
  // console.log(r.toString())
}

console.log(r);
console.log("使用Buffer转化");
// 只能使用Buffer转化成base64？？
console.log(Buffer.from('珠').toString('base64'));
console.log(Buffer.from(r).toString('base64'));
console.log("hello".toString('base64'));

// ##Buffer声明的方式

// 声明五个位置的buffer
let buf = Buffer.alloc(5);
console.log(buf);
// 不安全的声明模式，但是可以使用fill方法将其转换成0，特点是速度快
buf = Buffer.allocUnsafe(5);
buf.fill(0);
console.log(buf);

// 数组的形式
buf = Buffer.from([100,210,103]);
console.log(buf);

// 字符串的转换
buf = Buffer.from("梁展玮");
console.log(buf);

// ## Buffer常见方法
// 与数组类似
let arr = [[1,2,3],4,5];      // 浅拷贝
let arrCopy = arr.slice(0); //拷贝功能
console.log("数组");
console.log(arr);
arrCopy[0][1] = 100;
console.log(arrCopy);
console.log(arr); //原数组也发生改变，所以是个浅拷贝。

// 测试为什么一维数组不是浅拷贝
{
  // let arr = [2,1,3];
  // let arrCopy = arr.slice(0);
  // arrCopy[1] = [4,5,6];
  // console.log(arr);
  // console.log(arrCopy);

  // 测试一下reduce方法
  console.log("reduce");
  // let arr = [[1,2,3,4,5],[6,7,8]];
  // let len = arr.reduce((a,b)=> {
  //   return a+b.length;
  // });
  // console.log(Object.prototype.toString.call(len));
  // 数组的累加
  /*
    参数1.prev 上一次返回的值，
    参数2.item 本次的值，
    参数3.最后一个参数（prev初始值），涉及到一个对象类型，例如如果原数组里面存的是数字，最后一个参数传空数组[]的时候，
    默认数据是字符串拼接,这时候返回值也就是123456
    如果我们想做到里面的数组迭代相加，那我们在最后的参数传一个数字类型的参数，例如我们传0，这时候就按照数字相加，
    这里还需要注意的就是传的时候不能加" "如果加了引号还认为是字符串的拼接
  */
  let sum = [1,2,3,4,5,6,7,8,9].reduce((pre,item) => pre+item,0);
  console.log(sum);
  console.log("end reduce");
}

// Buffer也有同样的特性
{
  // Buffer 存放的是内存地址，如果截取某一段，改变的时候也会改变这个内存地址
  console.log("Buffer的浅拷贝");
  let buff = Buffer.from("Dennis");
  console.log(buff);
  let buffCopy = buff.slice(0);
  buffCopy[0] = 100;
  console.log(buff); //也会改变，同数组也是浅拷贝
  console.log(buffCopy);
  console.log(buffCopy.toString());
  // 常用方法
  // 判断是不是Buffer
  Buffer.isBuffer(buff);
  
}
// 拷贝
{
  console.log("拷贝copy");
  let buff1 = Buffer.from("Dennis");
  let buff2 = Buffer.from("展玮");
  let cpBuff = Buffer.alloc(12);//合并上面两个buffer，同时给定长度
  console.log(Object.prototype.toString.call(cpBuff));
  // ---------------------------写这个copy方法--------------------
  Buffer.prototype.copy = function (targetBuffer, targetStart, sourceStart=0, sourceEnd=this.length) {//有一个source的开始值和结束值，避免用户不给参数
    for(let i=0; i < sourceEnd - sourceStart;i++) {//确定循环次数
      // 将每次的循环结果，拷贝到目标buffer上
      targetBuffer[targetStart+i] = this[sourceStart+i];
    }
  }
  // 当前的buffer.copy(目标buffer，目标的开始位置，源的开始，源的结束)
  buff1.copy(cpBuff,0,0,6);
  buff2.copy(cpBuff,6,0,6);
  console.log(cpBuff);
  console.log(cpBuff.toString());
}

// concat 拼接
{
  // -----------------------concat方法重写-----------------------
  Buffer.concat = function (list, length = list.reduce((a,b) => a+b.length,0)) {
    let buff = Buffer.alloc(length);
    let offset = 0;
    list.forEach(buffItem => {
      buffItem.copy(buff,offset);
      offset+=buffItem.length;
    });
    return buff;
  }
  let buff1 = Buffer.from("Dennis");
  let buff2 = Buffer.from("展玮");
  let bufferCopy = Buffer.concat([buff1,buff2],9);
  console.log(bufferCopy.toString());
}

// 总结：isBuffer, length, 字节数, toString('base64(utf8)'), slice, fill