import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";

console.log(import.meta.url);
console.log(process.cwd());

const pathToFile = new URL("./index.html", import.meta.url);

console.log(pathToFile);

const data = await readFile(pathToFile);

console.log(data.toString());

let template = data.toString();

const obj = {
  name: "jayant kushwah",
  message: "ram ram",
};

for (const [key, value] of Object.entries(obj)) {
  template = template.replace(`{{${key}}}`, value);
}

console.log(new URL("./output.html", import.meta.url).pathname);

await writeFile(new URL("./output.html", import.meta.url), template);

// …or convert safely:
await writeFile(
  fileURLToPath(new URL("./output.html", import.meta.url)),
  template,
);
