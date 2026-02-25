function union(arr1, arr2) {
  let arr = [];
  let i = 0;
  let j = 0;
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] < arr2[j]) {
      arr.push(arr1[i]);
      i++;
    } else if (arr2[j] < arr1[i]) {
      arr.push(arr2[j]);
      j++;
    } else if (arr1[i] == arr2[j]) {
      arr.push(arr1[i]);
      i++;
      j++;
    }
  }
  while (i < arr1.length) {
    arr.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    arr.push(arr2[j]);
    j++;
  }
  return arr;
}

console.log(union([1, 2, 3, 5, 8], [0, 2, 3, 4]));
console.log(union(["a"], ["b"]));
console.log(union([1], ["1", 1]));


// Assignment: Implementing the union Function in JavaScript
// Objective:
// The goal of this assignment is to implement a function union that combines two
// JavaScript arrays into a new array that contains the union of elements from both lists
// while preserving order and avoiding duplicates. The funcon must use ES6 features
// such as Set , spread operators, and recursion where necessary.
// Instrucons:
// Part 1: Implemenng the union Funcon
// 1. Write a funcon union(arr1, arr2) that takes two arrays as input.
// 2. The funcon should return a new array containing all unique elements from both
// arr1 and arr2 .
// 3. Order of elements must be preserved (i.e., first occurrence from either array must
// appear first in the result).
// 4. The funcon must work for:
// Primive values (numbers, strings, booleans, null, undefined)
// Plain objects ( {} ) and arrays ( [] ) (including nested objects/arrays)
// Avoid using JSON.stringify() for object comparison. Instead, implement a
// deep equality check.
// 5. Do not use any third-party libraries.
// Part 2: Wring Tests
// 1. Write test cases using Jest to verify that:
// Primive values are handled correctly.
// Arrays with duplicate values return unique elements in the correct order.
// Objects and nested objects are correctly idenfied as unique or duplicates.
// Mixed types are correctly processed.
// 06/03/2025, 22:58 StackEdit
// https://stackedit.io/app# 1/2
// 2. Save your test cases in a union.test.js file and ensure they run using npm
// test .
// Example Cases:
// const union = require('./union');
// console.log(union([1, 2, 3], [2, 3, 4]));
// // Output: [1, 2, 3, 4]
// console.log(union(['a'], ['b']));
// // Output: ['a', 'b']
// console.log(union([1], ['1', 1]));
// // Output: [1, '1']
// console.log(union([{ a: { b: 10 } }], [{ a: { b: 20 } }]));
// // Output: [{ a: { b: 10 } }, { a: { b: 20 } }]
// console.log(union([{ b: 10, c: { z: { t: 5, _t: 5 }, f: [4] } }, 2],
// [{ b: 10, c: { z: { t: 5, _t: 5 }, f: [4] } }, '2']));
// // Output: [{ b: 10, c: { z: { t: 5, _t: 5 }, f: [4] } }, 2, '2']
// Bonus
// Opmize the funcon using ES6 features while keeping the implementaon clean
// and readable.
// Handle edge cases effecvely (e.g., empty arrays, deeply nested objects).
// Good luck!
