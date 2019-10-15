

/**
 * 写一个找出abcdef...字符串中第一个出现且在字符串中只出现一次的字符
 */

 function getChart(str) {
   let flag = false;
   let arrStr = str.split("");
   for(let i=0;i<arrStr.length;i++) {
     console.log(str.lastIndexOf(arrStr[i]));
    //  console.log(str.indexOf(arrStr[i]));
     if(str.indexOf(arrStr[i]) === str.lastIndexOf(arrStr[i])) {
      flag = arrStr[i];
      break;
     }
   }
   return flag;
 }

 let str = "abbccdsdffaee"
 console.log(getChart(str));

 /**
  * 写一个将整数数组按奇偶数分成两部分，数组左边是奇数，右边是偶数
  */
  // function sort(arr) {
  //   let sortArr = [];
  //   for(let i=0;i<arr.length;i++) {
  //     if(arr[i]%2===0) {
  //       sortArr.push(arr[i]);
  //     }else {
  //       sortArr.unshift(arr[i]);
  //     }
  //   }
  //   return sortArr;
  // }

  // let arr = [1,2,3,5,4,6,7,8];
  // console.log(sort(arr));
  // console.log(arr);

  // 最后一道题不会很简单，我认为它的意思是像splice方法那样，调用后能够修改原来的数组。
  Array.prototype.sort = function(arr)  {
    // 使用this就能改变原数组

    // 数组深拷贝的三种方式
    // let sortArr = this.slice(0);
    let sortArr = this.concat();
    // let sortArr = [...this];//需要数组的深拷贝，然后才能使用sortArr，否则下面清空，也会导致sortArr的改变
    this.length =0;//清空数组
    for(let i=0;i<sortArr.length;i++) {
      if(sortArr[i]%2===0) {
        this.push(sortArr[i]);
      }else {
        this.unshift(sortArr[i]);
      }
    }
    // return console.log(sortArr);
  }
  let arr = [1,2,3,5,4,6,7,8];
  arr.sort();
  console.log(arr);

/**
 * 从1-10000的所有对称数
 * 
 */

 /*
  {
    let handleArr = [];
    for (let index = 1; index < 10000; index++) {
      let arrIndex = index.toString().split("");
      let flag = true;
      for(let i=0;i<arrIndex.length/2;i++) {
        if(arrIndex[i] !== arrIndex[arrIndex.length-1-i]) {
          flag = false;
          break;
        }
      }
      // 如果检验通过，push进handle中
      if(flag) {
        handleArr.push(Number(arrIndex.join("")));
      }
      // console.log(index.toString().split(""));
    }
    console.log(handleArr);
  }
  */

  {
    let p = function (flag) {
      return new Promise((resolve, reject) => {
        if(flag === 1) {
          resolve({
            error_code: "101",
            message:"success",
            data:2
          })
        }else if (flag === 2) {
          resolve({
            error_code: "102",
            message: "success",
            data: 3
          })
        }else {
          reject({
            error_code: "100",
            message: "fail",
            data: null
          })
        }
      }) 
    }
    p(1).then(res => {
      console.log(res);
      return p(res.data)
    }).then(res => {
      console.log(res);
      return p(res.data)
    }).then(res => {
      console.log(res);
    }).catch(err => {
      console.log("fail");
      console.log(err);
    })
  }