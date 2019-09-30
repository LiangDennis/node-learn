async function hello1() {
  console.log("hello1");
  await hello2();
  console.log("hello3");
  return {
    error_code:10010,
    msg:'success'
  }
}
function hello2() {
  console.log("hello2");
}
// hello1();
let i = hello1();
console.log(i.then(res =>{
  console.log(res);
}));