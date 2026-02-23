# Node.js Globals, Modules, Package & Build System — Deep Dive (SDE-3 Level)

---

# 1️⃣ Global Variables in Node.js

## 🔹 What is “Global” in Node?

In Node.js, **global scope is NOT the same as browser global scope**.

In browsers:

window === global object


In Node:

global === global object


But here’s the critical part:

> Every file in Node.js is wrapped inside a function.

---

## 🔹 Module Wrapper Function

Node internally wraps each file like this:

```js
(function (exports, require, module, __filename, __dirname) {
  // your file code
});

This means:

Variables declared with var, let, const

Are scoped to the module

NOT global

🔹 Actual Global Object

In Node:

global

In modern JS (universal):

globalThis
🔹 Important Built-in Globals
Global	Purpose
global	Global object
process	Process metadata
Buffer	Binary handling
setTimeout	Timer
setImmediate	Immediate execution
__dirname	Directory path
__filename	File path
require	CommonJS loader
🔹 Why Globals Are Dangerous
Problems:

Memory leaks

Hard-to-track state mutation

Implicit coupling

Breaks modularity

Senior engineering rule:

Avoid mutable globals in production services.

2️⃣ Node.js Module System — Overview

Node has two module systems:

CommonJS (CJS)

ES Modules (ESM)

Understanding BOTH deeply is required.

3️⃣ CommonJS (CJS)
🔹 Syntax
const fs = require('fs');

module.exports = function () {};
🔹 Execution Model

Synchronous loading

Blocking require

Exports are mutable object references

Cached after first load

🔹 Module Caching
require('./file')
require('./file')

Loaded only once.

Stored in:

require.cache

This is critical for:

Singletons

Stateful modules

🔹 Export Patterns
Named export (object)
module.exports = {
  add,
  subtract
};
Single export
module.exports = function () {};
🔹 Circular Dependencies in CJS

CJS allows circular dependencies but exports partially initialized objects.

Example issue:

Module A requires B

Module B requires A

One gets incomplete export

Must understand for large systems.

4️⃣ ES Modules (ESM)

Modern standard.

🔹 Enable ESM

In package.json:

{
  "type": "module"
}

Or use .mjs

🔹 Syntax
import fs from 'fs';
export const x = 10;
export default function () {};
🔹 ESM Characteristics

Static analysis friendly

Hoisted imports

Asynchronous loading

Strict mode by default

Immutable live bindings

🔹 Named Export
export const add = () => {};

Import:

import { add } from './math.js';
🔹 Default Export
export default function () {};

Import:

import fn from './file.js';

Only ONE default export allowed.

🔹 Live Bindings (Important)

ESM exports are live references, not copies.

If exported variable changes, import sees updated value.

5️⃣ CommonJS vs ES Modules — Deep Comparison
Feature	CommonJS	ESM
Load time	Runtime	Static
Sync/Async	Sync	Async
Tree shaking	No	Yes
Default export	Yes (object)	Explicit
Circular deps	Partial exports	Better handling
Top-level await	No	Yes
🔥 Interview Insight

ESM is statically analyzable, which enables tree shaking and optimization.

6️⃣ Node Module Resolution Algorithm

When you do:

require('express')

Node resolves in order:

Built-in module

node_modules in current dir

Parent directories upward

Global modules

🔹 Resolution Steps

For file:

require('./file')

Checks:

file.js
file.json
file.node
file/index.js
🔹 ESM Resolution

More strict.

Must include:

./file.js

No implicit extensions in strict ESM.

7️⃣ Package Management
🔹 package.json

Core metadata file.

Example:

{
  "name": "app",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "exports": {},
  "dependencies": {},
  "devDependencies": {}
}
🔹 dependencies vs devDependencies
Type	Used In
dependencies	Runtime
devDependencies	Build/test
🔹 SemVer (Semantic Versioning)
MAJOR.MINOR.PATCH

Example:

^1.2.3
~1.2.3

Understanding version ranges is critical for production stability.

8️⃣ Node Module Types
🔹 Core Modules

Example:

fs

http

path

🔹 Local Modules
./utils.js
🔹 Third-party Modules

Installed via:

npm install express

Stored in:

node_modules/
9️⃣ Export Patterns Deep Dive
Named Export

Best for libraries with multiple utilities.

Default Export

Best for:

Classes

Main function

Mixed Export
export default class A {}
export const helper = () => {};
🔟 Build Systems in Node Ecosystem

Node itself does not require build system.

But production apps often use:

🔹 Bundlers

webpack

rollup

esbuild

Used for:

Tree shaking

Code splitting

Optimization

🔹 Transpilers

Babel

TypeScript

Convert modern JS → older syntax.

🔹 Native Addons Build System

Node uses:

node-gyp

C++ bindings

N-API

For performance-critical modules.

1️⃣1️⃣ Advanced Topics
🔹 Tree Shaking

Only possible with ESM due to static analysis.

🔹 Dynamic Import
const module = await import('./file.js');

Async loading.

🔹 Conditional Exports

In package.json:

"exports": {
  "import": "./esm.js",
  "require": "./cjs.js"
}

Allows dual module support.

🔹 Dual Package Hazard

When package supports both CJS and ESM incorrectly, duplicate instances can load.

🔹 Top-Level Await

ESM allows:

await fetch();

CJS does not.

1️⃣2️⃣ Performance Considerations
CJS

Faster startup

Simpler

ESM

Better optimization

Better tooling

Future standard

1️⃣3️⃣ Architecture-Level Understanding

In large systems:

Avoid deep dependency trees

Lock versions

Use shrinkwrap / lockfile

Avoid global mutable state

Separate domain modules clearly

🔥 SDE-3 Interview Questions
❓ Why does Node wrap modules in a function?

To provide module-level scope isolation and avoid global pollution.

❓ Difference between default and named export?

Default → single primary export
Named → multiple exports
ESM supports static analysis.

❓ Why is ESM better for tree shaking?

Because imports are statically analyzable at parse time.

❓ What is require.cache?

Stores loaded modules to avoid re-execution.

❓ What is dual package hazard?

Loading same package in CJS and ESM forms can cause two separate instances.

🚀 Final Big-Picture View

Node module ecosystem includes:

Execution scope isolation

Two module systems

Resolution algorithm

Package versioning

Dependency graph management

Build tooling ecosystem

Native bindings

Runtime caching

Performance implications

If you can explain:

Module wrapper

require cache

ESM live bindings

Resolution algorithm

Export patterns

Dual package hazard

Tree shaking mechanics

You are operating at senior backend depth.