# Node.js — Deep Technical Notes

---

# 1. What is Node.js?

Node.js is a **JavaScript runtime built on the V8 engine that executes JavaScript outside the browser using an event-driven, non-blocking I/O architecture**.

It is designed for:

* Network servers
* APIs
* Streaming systems
* Real-time applications
* CLI tools
* Microservices

Node.js is optimized for **high concurrency with low memory overhead**, not CPU-heavy workloads.

## Key Design Philosophy

Node follows this model:

> "Use a single thread to orchestrate many concurrent I/O operations."

Instead of:

* Thread-per-request (Java, Spring)
* Process-per-request (PHP, older systems)

Node uses:

* Event loop
* Async callbacks
* OS-level async I/O

---

# 2. What Node.js is NOT

Understanding this is critical for senior engineering roles.

Node.js is NOT:

## Not a programming language

Node runs JavaScript — it does not define the language.

## Not multi-threaded request execution

Node uses:

* Single main thread
* Thread pool for blocking work

## Not ideal for CPU-heavy workloads

Examples:

* Image processing
* ML inference
* Video encoding
* Large sorting algorithms

These block the event loop.

## Not the V8 engine itself

Node embeds V8 but adds:

* libuv
* OS bindings
* APIs
* module system

---

# 3. Node.js Internal Architecture

Node is composed of these major layers:

```
User Code
   ↓
Node APIs (fs, http, timers, etc.)
   ↓
V8 Engine
   ↓
libuv
   ↓
OS Kernel
```

---

# 4. Core Components Inside Node.js

## V8 Engine

Executes JavaScript.

## libuv

Provides:

* Event loop
* Thread pool
* Async I/O abstraction
* Cross-platform APIs

This is the **real backbone of Node**.

## Node Core APIs

Examples:

* fs
* http
* crypto
* stream
* buffer

These are C++ bindings exposed to JavaScript.

---

# 5. Event Loop (Critical Concept)

The event loop is how Node achieves concurrency.

Phases:

1. Timers
2. Pending callbacks
3. Idle / prepare
4. Poll
5. Check
6. Close callbacks

Simplified model:

```
while(true):
  execute_microtasks()
  run_next_event_loop_phase()
```

---

# 6. Thread Pool

libuv uses a thread pool for operations that cannot be async at OS level:

Examples:

* File system operations
* DNS lookup
* crypto
* compression

Default size:

```
4 threads
```

Configurable:

```
UV_THREADPOOL_SIZE=8
```

---

# 7. How Node.js Code is Written (Execution Model)

Example:

```js
const fs = require("fs");

fs.readFile("file.txt", () => {
  console.log("done");
});

console.log("end");
```

Execution order:

```
1. readFile scheduled
2. "end" printed
3. thread pool reads file
4. callback queued
5. event loop executes callback
```

Output:

```
end
done
```

---

# 8. Call Stack vs Callback Queue vs Microtask Queue

Node execution model relies on:

## Call Stack

Executes synchronous JS.

## Callback Queue

Stores:

* setTimeout callbacks
* I/O callbacks

## Microtask Queue (higher priority)

Stores:

* Promises
* process.nextTick

Execution priority:

```
Call Stack
Microtasks
Event Loop Queue
```

---

# 9. Chrome V8 Engine

V8 is a high-performance JavaScript engine written in C++.

Responsibilities:

* Parse JavaScript
* Compile to machine code
* Execute code
* Manage memory
* Garbage collection

Pipeline:

```
JS → Parser → AST → Ignition → TurboFan → Machine Code
```

---

# 10. V8 Execution Pipeline

## Step 1 — Parsing

JavaScript → AST

## Step 2 — Ignition Interpreter

Produces bytecode.

## Step 3 — Profiling

Detects hot functions.

## Step 4 — TurboFan JIT Compiler

Optimizes hot code into machine code.

---

# 11. Hidden Classes (Important Optimization)

V8 optimizes objects using **hidden classes**.

Bad:

```js
obj.a = 1;
obj.b = 2;
```

Good:

```js
const obj = { a: 1, b: 2 };
```

Consistent object shape improves performance.

---

# 12. Inline Caching

V8 caches property access:

```
obj.user.name
```

Becomes fast after repeated access.

This is why **consistent object structure matters**.

---

# 13. Garbage Collection in V8

V8 uses:

## Generational GC

Memory split into:

* New space
* Old space

Most objects die young.

Algorithms:

* Scavenge
* Mark-Sweep
* Mark-Compact

---

# 14. Memory Model

Important memory regions:

* Stack
* Heap
* Code space
* Large object space

Common Node production issue:

> Memory leaks from retained references.

---

# 15. Node.js Modules System

Two systems exist:

## CommonJS

```
require()
module.exports
```

## ES Modules

```
import
export
```

Node resolves modules using:

* file path
* node_modules
* package.json

---

# 16. Streams (Core Node Concept)

Streams allow **processing data incrementally**.

Types:

* Readable
* Writable
* Duplex
* Transform

Used heavily in:

* HTTP
* File system
* Compression
* Networking

---

# 17. Buffers

Node uses Buffers for binary data.

They are:

* Fixed size
* Outside V8 heap
* Backed by raw memory

Important for:

* TCP
* file system
* streaming

---

# 18. Why Node is Fast

Node performance comes from:

* V8 JIT compilation
* Event loop concurrency
* Non-blocking I/O
* Streams
* Minimal thread switching

Not from:

* raw CPU execution

---

# 19. Node.js Weaknesses

Important for SDE-3 understanding:

* Event loop blocking risk
* Harder debugging of async flows
* Memory leaks from closures
* CPU-bound tasks perform poorly

Senior engineers mitigate using:

* worker threads
* clustering
* microservices
* queues

---

# 20. Mental Model for Senior Engineers

Think of Node as:

> A JavaScript orchestrator for async OS operations.

Not:

> A computation engine.

---

# 21. Real Interview Insight

At SDE-3 level, interviewers expect you to understand:

* Event loop internals
* libuv thread pool
* V8 optimization behavior
* memory leaks
* streams and backpressure
* async architecture tradeoffs

Not just Express APIs.

---
JavaScript is both interpreted and compiled.

If someone says “JS is interpreted,” they’re simplifying. Modern engines like V8 (used in Chrome and Node.js) use Just-In-Time (JIT) compilation.

Here’s the real execution model.

The Accurate Answer

JavaScript is:

Parsed → Interpreted → JIT-compiled to machine code at runtime

So it is neither purely interpreted nor traditionally compiled.

How It Actually Works (Modern Engines like V8)
1️⃣ Parsing Phase

Source code → AST (Abstract Syntax Tree)

let x = 10;


Becomes an internal tree representation.

2️⃣ Bytecode Generation (Interpreter Stage)

V8’s Ignition interpreter converts AST → bytecode.

This is fast to start.

3️⃣ Profiling

Engine monitors execution:

Which functions run frequently?

Which code paths are hot?

4️⃣ JIT Compilation (TurboFan)

Hot code gets compiled into optimized machine code.

That means:

First run → slower

Repeated runs → very fast

Why This Hybrid Model Exists

Pure Interpretation:

Fast startup

Slow execution

Ahead-of-Time Compilation:

Slow startup

Fast execution

JIT gives:

Fast startup

Fast hot-code execution

Best of both worlds.

So Is JavaScript Compiled?

Yes — but:

Not ahead-of-time like C/C++

Not purely interpreted like old scripting engines

It’s dynamically JIT-compiled at runtime.

In Node.js Specifically

Node uses:

V8

JIT compilation

Optimization tiers

De-optimization when assumptions break

Example:

If you change object shapes dynamically:

obj.a = 1;
obj.b = 2;


V8 may de-optimize compiled code.

That’s why senior engineers care about:

Hidden classes

Inline caching

Stable object shapes

SDE-3 Level Understanding

The real interview answer:

“JavaScript is executed by a JIT compiler. Modern engines first interpret code to bytecode and then dynamically compile hot code paths to optimized machine code.”

If you just say “interpreted language,” that signals beginner-level understanding.

# End of Notes
