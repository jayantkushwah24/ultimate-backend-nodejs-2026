/*
# types supported in ts

primitive data type in ts
-number
-string
-null
-boolean
-undefined
-symbol
-bigint

let/const <var_name> : <data_type> = value; // type annotation or type signature

*/

let id: number = 24;
let firstName = "jayant"; // TS will understand automatically that is firstName is string (inference)
// myName = 12; TSC throws error
let lastName: string = "kushwah";
// console.log(firstName + " " + lastName);

// union of types
let userid: number | string = 16; // union
userid = "26";

let apiRequestStatus: "pending" | "success" | "error" = "pending";
// apiRequestStatus = "done"; this is wrong

/**
 * arrays
 * let <var_name> : data_type[] = [val1 , val2...]
 */

let rollNumber: number[] = [1, 2, 3, 4, 5];
let heterogenousArray: any[] = [3, 4, true, "jayant", 4.67, { a: 1, b: 2 }];
let heteroArray2: (boolean | number | string)[] = [3, 6, true, "jayant"];
// array in the form of typed tuple
let heteroArray3: [boolean, number, string] = [true, 24, "jayant"];
// console.log(heteroArray3);

/**
 * how to define type for objects
 * -classes -> data member , member function
 * -interface -> its a contract
 */

class Car {
  name: string
  constructor(name: string) {
    this.name = name;
  }
  display() {
    console.log(this.name);
  }
}

interface Product {
  brand: string,
  name: string,
  price: number,
  display(): void
}

let product1: Product = {
  brand: "apple",
  name: "iphone",
  price: 83500,
  display() {
    console.log("display");
  },
}

let car1: Car = {
  name: "hyundai",
  display: function () {
    console.log("display");
  },
}

function add(a: number, b?: number): number {
  return a + (b || 0);
}
// console.log(add(3));

const dob = new Date(2000, 1, 6);
console.log(dob.toLocaleDateString());
