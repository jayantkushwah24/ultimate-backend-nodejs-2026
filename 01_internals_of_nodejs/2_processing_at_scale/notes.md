# Processing at Scale & Fundamentals of Threads — SDE-3 Deep Dive

---

## 🔷 1. How Programs Execute on Our Machines

### Execution Pipeline

Program (binary / script)
↓
Process created by OS
↓
Threads scheduled
↓
CPU executes instructions


### Key Concepts

- **Program** → static file
- **Process** → running instance with memory + resources
- **Thread** → execution path inside process
- **CPU** → executes machine instructions
- **Kernel Scheduler** → decides which thread runs

---

## 🔷 2. Step-by-Step: How Software Actually Runs

### Detailed Flow

User runs program
↓
Kernel creates process
↓
Virtual memory allocated
↓
Executable mapped into memory
↓
CPU starts execution (user mode)
↓
System calls when OS services needed
↓
Interrupts + scheduler manage CPU time


### User Mode vs Kernel Mode

| Mode | Access |
|------|--------|
| User | Restricted |
| Kernel | Full hardware access |

**Interview tip:** Always mention privilege rings.

---

## 🔷 3. How Computers Run Many Tasks

### Concurrency vs Parallelism

Single Core (Concurrency)

Time →
[T1][T2][T3][T1][T2]

Multi-Core (Parallelism)

Core1: [T1][T1][T1]
Core2: [T2][T2][T2]
Core3: [T3][T3][T3]


### Mechanisms Enabling Scale

- Timer interrupts
- Preemptive scheduling
- DMA (Direct Memory Access)
- Async I/O
- Thread pools

---

## 🔷 4. Context Switching — Deep Dive

### Definition

Context switch = saving one thread’s state and restoring another’s.

---

### What Gets Saved

Registers
Program Counter
Stack Pointer
CPU flags
SIMD/FPU state
Kernel metadata


---

### Context Switch Flow

Timer interrupt fires
↓
CPU enters kernel mode
↓
Kernel saves current thread state
↓
Scheduler picks next thread
↓
Kernel restores next thread state
↓
Return to user mode


---

### Performance Costs

**Major costs:**

- Register save/restore
- Cache cold start
- TLB invalidation
- Kernel overhead

⚠️ Frequent context switching = throughput killer.

---

### Process vs Thread Switch

| Type | Cost |
|------|------|
| Thread switch | Medium |
| Process switch | High (page table change) |

---

## 🔷 5. Client-Server Architecture

### Basic Model

Client → Request → Server
Client ← Response ← Server


---

### Definitions

**Client**
- Initiates communication
- Example: browser, mobile app

**Server**
- Processes requests
- Provides resources/services

---

### Scaled Architecture

Clients
↓
Load Balancer
↓
App Servers
↓
Cache / DB / Queue


---

### Key Properties

- Stateless servers scale better
- Idempotent APIs enable retries
- Backpressure prevents overload
- Horizontal scaling preferred

---

## 🔷 6. Introduction to Threads

### Definition

A thread is the smallest unit of execution inside a process.

---

### Process vs Thread

| Feature | Process | Thread |
|--------|--------|--------|
| Memory | Separate | Shared |
| Creation cost | High | Lower |
| Communication | IPC | Shared memory |
| Isolation | Strong | Weak |

---

### Thread Lifecycle

NEW → RUNNABLE → RUNNING → BLOCKED → TERMINATED


---

### Types of Threads

- Kernel threads
- User (green) threads
- M:N runtime threads (Go model)

---

## 🔷 7. Synchronization Primitives

### Mutex

lock()
critical section
unlock()


Use when exclusive access required.

---

### Semaphore

Controls access to **N resources**.

---

### Condition Variable

Used for wait/notify patterns.

---

### Atomics & CAS

Important for lock-free systems.

CAS(ptr, expected, new)


---

### Common Failures

**Deadlock conditions:**

1. Mutual exclusion  
2. Hold and wait  
3. No preemption  
4. Circular wait  

Break any one → no deadlock.

---

## 🔷 8. Thread Pools & Event Models

### Thread Pool

Task Queue → Worker Threads → Execution


**Benefits**

- Limits concurrency
- Reduces thread creation cost
- Improves CPU utilization

---

### Reactor Pattern (Event Loop)

Event Demultiplexer
↓
Event Loop
↓
Handlers


Best for high I/O concurrency.

---

### When to Use What

| Workload | Best Model |
|---------|-----------|
| CPU heavy | Thread pool |
| Massive I/O | Event loop |
| Mixed | Hybrid |

---

## 🔷 9. Memory & Cache Effects (SDE-3 Gold)

### Memory Hierarchy

Registers
↓
L1 Cache
↓
L2 Cache
↓
L3 Cache
↓
RAM
↓
Disk


---

### Critical Performance Killers

- Cache misses
- False sharing
- TLB misses
- Page faults
- NUMA remote memory

---

## 🔷 10. Key Laws You Must Know

### Amdahl’s Law

S = 1 / ((1 - p) + p/N)


Limits parallel speedup.

---

### Little’s Law

L = λ × W


Used for queue sizing.

---

---

# 🎯 MOCK INTERVIEW QUESTIONS (SDE-3 LEVEL)

---

## ❓ Execution & OS

**Q:** What happens when a program starts?

**Model Answer:**  
Kernel creates a process, sets up virtual memory and page tables, maps executable segments, initializes stack/heap, then schedules the main thread for execution in user mode.

---

## ❓ Context Switching

**Q:** Why is context switching expensive?

**Model Answer:**  
Because it involves saving/restoring registers, possible TLB flush, cache pollution, and kernel scheduler overhead. Frequent switching reduces CPU cache locality and overall throughput.

---

## ❓ Threads vs Processes

**Q:** When would you prefer threads over processes?

**Model Answer:**  
When tasks share memory heavily and require low-latency communication. Processes are preferred when isolation and fault containment matter more.

---

## ❓ Client-Server Scaling

**Q:** How do you scale a stateless service?

**Model Answer:**  

- Add load balancer  
- Horizontally scale replicas  
- Externalize session state  
- Add caching  
- Implement backpressure  

---

## ❓ Synchronization

**Q:** How do you avoid deadlocks in production systems?

**Model Answer:**

- Global lock ordering  
- Timeouts + retry  
- Try-lock with backoff  
- Reduce lock scope  
- Prefer lock-free structures where safe  

---

## ❓ Thread Pool Sizing

**Q:** How many threads should a service have?

**Model Answer:**

CPU-bound:

≈ number of cores


I/O-bound:

cores × (1 + wait_time / compute_time)


Always validate with load testing.

---

---

# ⏱️ 60-MINUTE SDE-3 STUDY PLAN

## Minute 0–10 — Core Mental Model

- Process vs thread
- User vs kernel mode
- Virtual memory basics

✅ Goal: explain execution pipeline clearly.

---

## Minute 10–25 — Context Switching Mastery

Study deeply:

- What is saved
- Why expensive
- TLB/cache impact
- Thread vs process switch

🔥 This is heavily tested.

---

## Minute 25–40 — Concurrency Models

Focus on:

- Thread pools
- Event loop (reactor)
- Async I/O
- Backpressure

Be ready to compare tradeoffs.

---

## Minute 40–50 — Synchronization

Must know cold:

- Mutex
- Semaphore
- CAS
- Deadlock prevention
- Memory visibility

---

## Minute 50–60 — Scale Thinking

Practice explaining:

- Client-server scaling
- Stateless design
- Queue backpressure
- Little’s Law usage

---

# 🧠 Final SDE-3 Reality Check

If you truly understand this topic, you should be able to:

- Draw full execution path from code → CPU  
- Explain context switch at register level  
- Compare event loop vs thread-per-request  
- Diagnose thread pool saturation  
- Reason about cache/TLB effects  
- Apply Little’s Law in capacity planning  

If you cannot do these **without notes**, you are not yet at SDE-3 depth.

---

# ✅ Next Recommended Step

If you want to stand out for FAANG-level backend roles, the next deep dives should be:

- Lock-free data structures  
- Futex internals (Linux)  
- epoll vs kqueue vs IOCP  
- NUMA-aware systems  
- Go scheduler / Node libuv internals  
