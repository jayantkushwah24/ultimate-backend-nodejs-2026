## Globals, CommonJS vs ES Modules, Top-Level Await, import.meta.url, Paths, SSR vs CSR

This is senior-level clarity. No confusion. No shallow explanations.

---

# 1️⃣ Global Variables in Node.js

## 🔹 What is “Global” in Node?

In browsers:

window === global object


In Node:

global === global object


Modern universal reference:

globalThis


---

## 🔹 Important Built-in Globals (Node)

| Global | Description |
|--------|-------------|
| global | Global object |
| globalThis | Standard global reference |
| process | Process info & environment |
| Buffer | Binary data handling |
| setTimeout | Timer |
| setImmediate | Next tick after I/O |
| __dirname | Directory path (CJS only) |
| __filename | File path (CJS only) |
| require | Module loader (CJS only) |
| module | Current module object |
| exports | Alias for module.exports |

---

## 🔥 Critical Concept

Every file in Node is wrapped in a function:

```js
(function (exports, require, module, __filename, __dirname) {
  // your file code
});

So:

var x = 10;

is NOT global.

It is module-scoped.

2️⃣ Globals in CommonJS vs ES Modules
🔹 CommonJS (CJS)

Available globals:

require

module

exports

__dirname

__filename

global

Example:

console.log(__dirname);
🔹 ES Modules (ESM)

Not available:

❌ require

❌ __dirname

❌ __filename

❌ module

❌ exports

Available:

import

export

import.meta

globalThis

process

🔹 Why the Difference?

CJS is runtime-based.

ESM is statically analyzable and follows ECMAScript standard.

ESM does not allow CommonJS magic variables.

3️⃣ Top-Level Await (TLA)
🔹 What Is It?

Ability to use await outside async functions.

Only works in ES Modules.

Example
const data = await fetch("https://api.example.com");

This is valid in:

.mjs files

"type": "module"

Not valid in CommonJS.

🔹 Why It Matters

Allows:

Async module initialization

Database connection before export

Dynamic config loading

🔥 Warning

Top-level await blocks module execution.

If many modules depend on it → startup slowdown.

4️⃣ import.meta.url
🔹 What Is It?

Provides the absolute file URL of the current module.

Example:

console.log(import.meta.url);

Output:

file:///Users/jayant/project/file.js
🔹 Replacing __dirname in ESM

In CJS:

__dirname

In ESM:

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
🔥 Why This Exists

ESM is based on URL spec, not filesystem assumption.

Works in:

Node

Browsers

Deno

5️⃣ Absolute Path vs Relative Path
🔹 Relative Path
./file.js
../utils/file.js

Relative to current file.

🔹 Absolute Path

Filesystem root-based:

/Users/jayant/project/file.js

In Node:

path.resolve()
path.join()
🔥 Common Mistake

Using:

require('./file')

inside deeply nested folder without understanding resolution base.

🔹 How Node Resolves Modules

Built-in module

node_modules in current dir

Parent directories upward

Global install

6️⃣ SSR vs CSR

This is frontend-architecture critical.

🔹 CSR (Client Side Rendering)
Flow
Browser loads JS
   ↓
JS builds UI
   ↓
API calls made
   ↓
Content rendered

Example: React SPA.

Pros

Smooth navigation

Good interactivity

Less server load

Cons

Slower first paint

SEO weaker

Blank screen until JS loads

🔹 SSR (Server Side Rendering)
Flow
Request
   ↓
Server renders HTML
   ↓
Browser receives full page
   ↓
Hydration happens

Example: Next.js SSR.

Pros

Better SEO

Faster first contentful paint

Good for content sites

Cons

Higher server load

Slower server response

Complex caching

🔥 SSR vs CSR Comparison
Feature	CSR	SSR
Initial Load	Slower	Faster
SEO	Weak	Strong
Server Cost	Low	Higher
Interactivity	High	High
Caching	Hard	Easier
🔹 Hybrid (Modern Approach)

Most modern frameworks:

Next.js

Nuxt

Remix

Use hybrid:

SSR for first load

CSR for navigation

7️⃣ Deep Interview-Level Concepts
🔹 Hydration

Server-rendered HTML becomes interactive by attaching JS.

🔹 Streaming SSR

Server sends HTML in chunks.

Reduces time-to-first-byte.

🔹 Static Site Generation (SSG)

Pre-render at build time.

Best performance.

8️⃣ Practical Scenarios
When to Use CSR

Internal dashboards

Admin panels

SaaS tools

When to Use SSR

Blogs

E-commerce

Marketing sites

SEO-heavy apps

9️⃣ Advanced Node Insight

ESM enables tree shaking

CJS uses require cache

import.meta.url helps portability

Top-level await affects dependency graph loading

Absolute paths improve stability in large codebases

🎯 SDE-3 Self-Test Questions
❓ Why doesn’t ESM support __dirname?

Because it follows ECMAScript spec and URL-based resolution, not CommonJS runtime wrapper.

❓ When should you avoid top-level await?

When module is widely depended on and startup performance matters.

❓ How does Node resolve a bare module specifier?

Searches node_modules upward from current directory.

❓ Why is SSR better for SEO?

Because HTML is delivered pre-rendered.

🚀 If You Understand All This

You understand:

Module execution context

ESM vs CJS internals

Path resolution

Modern rendering strategies

Node global behavior

That’s backend + frontend architectural maturity.