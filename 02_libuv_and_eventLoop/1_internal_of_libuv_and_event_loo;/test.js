process.nextTick(() => {
  console.log("first nexttick");
});

console.log("hello");

Promise.resolve().then(() => {
  console.log("first promise");
});

function add(a, b) {
  return a + b;
}
console.log("sum : " + add(3, 4));

setTimeout(() => {
  console.log("first settime out");
}, 0);

Promise.reject().catch(() => {
  console.log("second promise rejected");
  process.nextTick(() => {
    console.log("second nexttick");
  });
});

// hello
// sum : 7
// first nexttick
// first promise
// second promise rejected
// second nexttick
// first settime out