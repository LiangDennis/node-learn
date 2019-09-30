
let path = require('path');
let a = "./../a.js";
let b = "E:/HTMLsublime/node/test1.js";
let c = "D:/1.js";

// resolve将相对路径转换成绝对路径
console.log(path.resolve(b,"L"));
// normalize去掉./，相当于格式化吧
console.log(path.normalize(a));
// isAbsolute判断是否为绝对路径
console.log(path.isAbsolute(a));
console.log(path.isAbsolute(b));
console.log(path.isAbsolute(c));
// 可以将其路径链接起来
console.log(path.join(a,b,c));
console.log(path.relative(a,b));
// resolve: [Function: resolve],
// normalize: [Function: normalize],
// isAbsolute: [Function: isAbsolute],
// join: [Function: join],
// relative: [Function: relative],
// toNamespacedPath: [Function: toNamespacedPath],
// dirname: [Function: dirname],
// basename: [Function: basename],
// extname: [Function: extname],
// format: [Function: bound _format],
// parse: [Function: parse],
// sep: '\\',
// delimiter: ';',
// win32: [Circular],
// posix: {
//   resolve: [Function: resolve],
//   normalize: [Function: normalize],
//   isAbsolute: [Function: isAbsolute],
//   join: [Function: join],
//   relative: [Function: relative],
//   toNamespacedPath: [Function: toNamespacedPath],
//   dirname: [Function: dirname],
//   basename: [Function: basename],
//   extname: [Function: extname],
//   format: [Function: bound _format],
//   parse: [Function: parse],
//   sep: '/',
//   delimiter: ':',
//   win32: [Circular],
//   posix: [Circular],
//   _makeLong: [Function: toNamespacedPath]
// },
// _makeLong: [Function: toNamespacedPath]