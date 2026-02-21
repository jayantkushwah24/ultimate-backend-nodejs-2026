# Deep Dive Notes: libuv Internals & Node.js Event Loop Architecture

---

# 1. libuv – Internal Architecture

## 1.1 Overview

libuv is a multi-platform asynchronous I/O library written in C.  
It provides:

- Event loop implementation
- Asynchronous TCP/UDP
- Async filesystem operations
- Thread pool
- Timers
- Signal handling
- Child process management
- Cross-platform abstraction layer

Node.js runtime stack:

JavaScript (User Code)  
↓  
Node.js C++ Core  
↓  
libuv  
↓  
Operating System (epoll / kqueue / IOCP)

V8 executes JavaScript.  
libuv handles concurrency and I/O multiplexing.

---

# 2. libuv Core Components

## 2.1 Event Loop (`uv_loop_t`)

Every Node.js process has:

- One main `uv_loop_t`
- Possibly additional loops in worker threads

Core function:
uv_run(loop, mode)


Modes:
- `UV_RUN_DEFAULT`
- `UV_RUN_ONCE`
- `UV_RUN_NOWAIT`

The event loop continues until:
- No active handles
- No active requests

---

## 2.2 Handles (`uv_handle_t`)

Handles represent long-lived resources attached to the event loop.

Examples:
- `uv_tcp_t`
- `uv_udp_t`
- `uv_timer_t`
- `uv_idle_t`
- `uv_async_t`
- `uv_poll_t`

Properties:
- Persistent
- Stored in loop's handle queue
- Must be explicitly closed
- Contain callback references

Lifecycle:
1. Initialize
2. Start
3. Active
4. Stop
5. Close

Handles maintain internal state flags:
- UV_HANDLE_ACTIVE
- UV_HANDLE_CLOSING
- UV_HANDLE_REF

---

## 2.3 Requests (`uv_req_t`)

Requests represent one-time asynchronous operations.

Examples:
- `uv_write_t`
- `uv_connect_t`
- `uv_fs_t`
- `uv_work_t`

Characteristics:
- Short-lived
- Executed once
- Freed after callback completes

Key Difference:

Handle = persistent object registered in event loop  
Request = one-shot async operation  

---

# 3. I/O Multiplexing Internals

libuv uses OS-specific mechanisms:

Linux → epoll  
macOS → kqueue  
Windows → IOCP  

All abstracted inside:

uv__io_poll()


This function:
- Waits for kernel events
- Dispatches ready file descriptors
- Queues callbacks

Poll strategy:
- If there are timers pending → poll timeout is limited
- If no timers → may block indefinitely
- If setImmediate exists → skip blocking

---

# 4. Thread Pool Internals

Default size: 4 threads

Configurable via:
UV_THREADPOOL_SIZE


Thread pool used for:
- File system operations
- DNS lookup (getaddrinfo)
- Crypto
- Compression

Work submission:
uv_queue_work()


Execution flow:
1. Task placed in work queue
2. Worker thread executes
3. Completion callback queued in loop

Important:
Network sockets DO NOT use thread pool.
They use OS async mechanisms.

---

# 5. Node.js Event Loop – Deep Internal Flow

Node event loop is built on libuv’s loop.

Simplified C-level structure:

while (uv_loop_alive(loop)) {
uv__run_timers();
uv__run_pending();
uv__run_idle();
uv__run_prepare();
uv__io_poll();
uv__run_check();
uv__run_closing_handles();
}


Each phase has its own callback queue.

---

# 6. Event Loop Phases (Detailed)

## 6.1 Timers Phase

Executes callbacks scheduled by:
- setTimeout()
- setInterval()

Timers stored in:
- Min-heap (optimized structure)
- Ordered by expiration time

Important:
Timers are not exact.
They are minimum threshold timers.

---

## 6.2 Pending Callbacks Phase

Executes:
- Deferred I/O callbacks
- TCP errors
- Some system-level events

---

## 6.3 Idle / Prepare

Internal use.
Used by Node core for:
- Scheduling internal operations
- Preparing for poll phase

---

## 6.4 Poll Phase (Critical Phase)

Main I/O execution phase.

Responsibilities:
- Retrieve new I/O events
- Execute I/O callbacks
- Block if necessary

Behavior rules:

If:
- No timers ready
- No setImmediate pending
- No I/O ready

Then:
→ Poll blocks waiting for events.

If setImmediate exists:
→ Poll will not block.

---

## 6.5 Check Phase

Executes:
- setImmediate()

Runs after poll phase.

---

## 6.6 Close Callbacks

Handles cleanup:
- socket.on('close')
- handle close events

---

# 7. Microtasks, NextTick, and Execution Order

Node.js has 3 queues:

1. Call Stack
2. NextTick Queue
3. Microtask Queue (Promises)
4. Event Loop Phase Queues

Execution priority:

1. Current call stack
2. process.nextTick queue
3. Promise microtask queue
4. Event loop phase

---

# 8. process.nextTick() – Internal Mechanics

Not part of libuv.
Implemented inside Node core.

Stored in:
process._tickCallback()


Characteristics:
- Executes immediately after current function
- Runs before Promise microtasks
- Runs before switching phases

Example:

```js
process.nextTick(() => console.log("A"));
Promise.resolve().then(() => console.log("B"));
Output:

A
B
8.1 Starvation Scenario
Recursive nextTick:

function loop() {
  process.nextTick(loop);
}
loop();
Effect:

Event loop never proceeds

I/O starvation occurs

This is why nextTick must be used carefully.

9. Microtask Queue (Promises)
Includes:

Promise.then()

queueMicrotask()

Executed:

After each phase

After nextTick queue empties

Difference from Browser:

Browser:

Microtasks run after each macrotask

Node:

nextTick runs before microtasks

Microtasks run after every phase

10. Complete Execution Order Example
setTimeout(() => console.log("timeout"), 0);
setImmediate(() => console.log("immediate"));
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
Typical output:

nextTick
promise
timeout or immediate
Inside I/O callback:

nextTick
promise
setImmediate
setTimeout
11. Advanced Timing Behavior
setTimeout vs setImmediate
Outside I/O:

Order is not guaranteed.

Inside I/O callback:

setImmediate runs first.

Reason:
Poll phase completes before check phase.

12. Memory & Data Structures
Timers:

Min-heap or RB-tree

Handles:

Linked lists

Requests:

Queue structures

Thread pool:

Work queue + worker threads

13. High-Level Execution Model
Call Stack
↓
process.nextTick queue
↓
Microtask queue
↓
Event Loop Phases:
    Timers
    Pending
    Idle/Prepare
    Poll
    Check
    Close
14. Performance Characteristics
Node scalability comes from:

Non-blocking I/O

Single-threaded event loop

Kernel-level multiplexing

Small memory overhead per connection

Limitations:

CPU-heavy tasks block loop

Long synchronous code blocks I/O

nextTick abuse causes starvation

15. Key Interview-Level Insights
libuv abstracts epoll/kqueue/IOCP

Node is single-threaded at JS level

Thread pool handles blocking tasks

Handles are long-lived

Requests are one-time operations

nextTick has higher priority than Promise

Poll phase drives I/O

setImmediate runs in check phase

Timers are threshold-based, not exact

16. Production-Level Debugging Tips
Use NODE_DEBUG=timer

Monitor event loop delay

Use clinic doctor

Avoid synchronous FS calls

Be careful with recursive nextTick

Use worker_threads for CPU tasks