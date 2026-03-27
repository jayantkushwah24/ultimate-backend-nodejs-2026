const response: any = "24";
const numericLength: number = (response as string).length; // forced type assertion

type Book = {
  type: string;
};
let bookString = '{ "name": "How to win friends and influence people" }';
let bookObject = JSON.parse(bookString) as Book;
console.log(typeof bookObject);

const inputElement = document.getElementById("container1") as HTMLInputElement;

let value: any;
value = "jayant";
value = [1, 2, 3];
value = true;
value.toUpperCase();

let newValue: unknown;
newValue = "kushwah";
newValue = [4, 5, 6];
newValue = false;
//Unlike the any type, TypeScript checks the type before performing operations on it.you need to use the type assertion to explicitly tell the TypeScript compiler the type
if (typeof newValue == "string") {
  newValue.toUpperCase();
}

try {
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
  console.log(error);
}

const data: unknown = "jayant";
const stringData: string = data as string;

type Role = "admin" | "user";
function redirectBasedOnRole(role: Role): void {
  if (role == "admin") {
    console.log("Redirecting to admin dashboard");
    return;
  }
  if (role == "user") {
    console.log("Redirecting to user dashboard");
    return;
  }
  role; // type never
}

// type never
function neverReturnAnything(): never {
  while (true) {}
}
