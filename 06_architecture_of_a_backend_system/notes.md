Backend System Architecture – Deep Technical Notes

1. Backend System Architecture Overview

A backend system is responsible for:

Business logic execution

Data persistence

Authentication & authorization

API exposure (REST/GraphQL/gRPC)

Scalability & reliability

Observability

At scale, backend architecture is a distributed system problem, not just an API problem.

2. High-Level Backend Architecture
   2.1 Basic Monolithic Architecture
   Client → Load Balancer → Application Server → Database

Characteristics:

Single deployable unit

Shared memory space

Simple but limited scalability

Use case:

Early-stage startups

Internal tools

2.2 Layered Architecture
Presentation Layer
↓
Application Layer (Business Logic)
↓
Domain Layer
↓
Data Access Layer
↓
Database

Benefits:

Separation of concerns

Maintainability

Testability

2.3 Microservices Architecture
Client
↓
API Gateway
↓
Service A Service B Service C
↓ ↓ ↓
DB A DB B DB C

Characteristics:

Independent deployability

Service isolation

Network-based communication

Tradeoffs:

Network latency

Operational complexity

Distributed tracing required

3. Computing Capabilities in Backend Systems

Backend performance is bounded by:

CPU

Memory

Disk

Network

OS scheduler

3.1 CPU

Important CPU factors:

Clock speed (GHz)

Number of cores

Hyperthreading

Context switching cost

Cache hierarchy

Backend workloads:

I/O-bound (most APIs)

CPU-bound (image processing, encryption, ML inference)

3.2 Concurrency Model
Event-driven (Node.js style)

Single-threaded event loop

Non-blocking I/O

Worker threads for CPU-heavy tasks

Thread-per-request (Java, C#)

Thread pool

Blocking I/O

High memory overhead per thread

Async + Reactor Pattern

Event loop dispatch

Efficient under high concurrency

4. Storage Hierarchy in Computer Systems

Storage hierarchy directly impacts backend latency.

4.1 Primary Storage
4.1.1 Registers

Inside CPU

Fastest

Few bytes

Latency: ~0.3 ns

4.1.2 Cache Memory

CPU cache reduces memory access time.

L1 Cache

Closest to CPU core

Smallest (~32–64 KB per core)

Fastest

Latency: ~1 ns

L2 Cache

Larger (~256 KB–1 MB)

Slightly slower

Latency: ~3–5 ns

L3 Cache

Shared among cores

Much larger (~8–64 MB)

Slower than L1/L2

Latency: ~10–20 ns

4.1.3 RAM (Main Memory)

Volatile

Stores active processes

Much slower than cache

Latency: ~80–120 ns

4.2 Secondary Storage
HDD

Mechanical

Slow seek time

Latency: ~5–10 ms

SSD (SATA)

Flash-based

No mechanical movement

Latency: ~100–500 µs

NVMe SSD

PCIe based

Much faster than SATA

Latency: ~20–100 µs

4.3 Tertiary / Distributed Storage

Network Attached Storage (NAS)

Object storage (S3)

Distributed file systems

Latency: depends on network (~1–100 ms)

5. Latency Factors in Backend Systems

Latency is cumulative.

Total latency = CPU time + memory delay + disk I/O + network delay + lock contention

5.1 CPU-Related Latency

Context switching

Cache misses

Branch misprediction

Lock contention

5.2 Memory-Related Latency

Cache miss → L1 → L2 → L3 → RAM

Page faults

Memory fragmentation

5.3 Disk Latency

Random I/O vs Sequential I/O

Filesystem overhead

Disk queue depth

5.4 Network Latency

TCP handshake

DNS lookup

Packet retransmission

Congestion

Cross-region distance

6. Memory Management Concepts
   6.1 Thrashing

Definition:
When system spends more time swapping pages than executing instructions.

Cause:

Insufficient RAM

Excessive processes

Poor memory limits

Effect:

High disk I/O

CPU idle waiting for I/O

System slowdown

Detection:

High swap usage

High page faults

Low CPU utilization

Fix:

Increase RAM

Reduce concurrency

Tune memory limits

7. Distributed System Failure Patterns
   7.1 Thundering Herd Problem

Definition:
Many clients simultaneously request the same resource after cache expiry.

Example:

Cache expires

10,000 users hit DB at once

Impact:

DB overload

Cascading failure

Solutions:

Cache locking

Staggered expiration

Request coalescing

Background refresh

Circuit breaker

8. Scaling Strategies
   8.1 Vertical Scaling (Scale Up)

Increase:

CPU cores

RAM

Disk speed

Pros:

Simple

No distributed complexity

Cons:

Hardware limit

Expensive

Single point of failure

8.2 Horizontal Scaling (Scale Out)

Add more machines.

Client
↓
Load Balancer
↓
Server 1
Server 2
Server 3

Pros:

High availability

Elastic scaling

Fault tolerance

Cons:

Distributed system complexity

Data consistency challenges

9. Stateless vs Stateful Systems
   Stateless

No session stored in memory

Scales horizontally easily

Stateful

Session in memory

Needs sticky sessions or shared storage

Best practice:

Use stateless services

Store session in Redis or DB

10. Load Balancing

Types:

Round Robin

Least Connections

IP Hash

Weighted

Load balancers:

L4 (Transport layer)

L7 (Application layer)

11. Caching Layers in Backend Systems

Caching reduces latency dramatically.

Levels:

CPU Cache

Application Memory Cache

Distributed Cache (Redis)

CDN Cache

12. Database Scaling
    12.1 Read Replicas

Write to primary

Read from replicas

Improves:

Read scalability

12.2 Sharding

Split data across multiple databases.

Shard key examples:

User ID

Region

Tradeoff:

Complex joins

Cross-shard queries expensive

13. CAP Theorem

In distributed systems, you can only guarantee:

Consistency

Availability

Partition tolerance

You must sacrifice one.

14. Observability in Backend Systems

Essential components:

Logging

Metrics

Distributed tracing

Health checks

Golden signals:

Latency

Traffic

Errors

Saturation

15. Backend Performance Optimization Strategy

Measure first (never guess)

Identify bottleneck

Optimize highest latency contributor

Add caching

Scale horizontally

Re-architect if required

16. Backend Architecture Maturity Model

Stage 1: Monolith
Stage 2: Modular monolith
Stage 3: Service-oriented
Stage 4: Microservices
Stage 5: Distributed event-driven system

17. Practical Engineering Rule

Performance hierarchy (fastest → slowest):

Registers
→ L1
→ L2
→ L3
→ RAM
→ SSD
→ Network
→ Cross-region network

The farther from CPU, the higher the latency.

18. Core Engineering Truth

Backend scalability is not about frameworks.
It is about:

Understanding memory hierarchy

Reducing latency at every layer

Designing stateless services

Handling failure by default

Measuring everything

END OF FILE
