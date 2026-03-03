# Database Internals & LSM Tree Deep Dive

## Designing High-Performance Databases for Petabyte Scale

This document explains:

- Internal architecture of traditional RDBMS
- Internal architecture of NoSQL systems
- Log-Structured Merge (LSM) Tree in depth
- Storage engine internals
- Write/read paths
- Compaction strategies
- Scaling & distributed considerations

This is systems-level database engineering knowledge.

---

# 1️⃣ Database Internals (General View)

A database engine consists of:

+-----------------------------+
| Query Processor |
+-----------------------------+
| Execution Engine |
+-----------------------------+
| Storage Engine |
+-----------------------------+
| Disk / SSD |
+-----------------------------+

---

## Core Components

| Component      | Responsibility          |
| -------------- | ----------------------- |
| Query Parser   | Parse SQL / Query       |
| Optimizer      | Choose execution plan   |
| Executor       | Run physical operations |
| Buffer Manager | Manage memory pages     |
| Storage Engine | Manage data persistence |
| WAL            | Durability              |
| Index Manager  | Efficient data lookup   |

---

# 2️⃣ RDBMS Internal Architecture

Traditional RDBMS (e.g., MySQL, PostgreSQL) use:

- B+ Trees for indexing
- Write-Ahead Logging (WAL)
- Fixed page-based storage

---

## B+ Tree Storage

    [50]

/ \

[20,40] [60,80]

- Balanced tree
- Leaf nodes contain actual data
- Optimized for range queries
- Efficient for read-heavy workloads

---

## Write Path in RDBMS

1. Write request received
2. Write logged to WAL (append-only)
3. Modify page in memory
4. Eventually flushed to disk
5. B+ tree rebalanced if necessary

Problem:

- Random disk writes
- Frequent page splits
- Expensive rebalancing under heavy write load

---

## Why RDBMS Struggles at Scale

- Schema rigidity
- Fixed row size expectations
- Heavy index maintenance
- Vertical scaling model
- Random I/O cost explosion

---

# 3️⃣ NoSQL Database Internals

Designed for:

- Schema-less data
- Horizontal scaling
- Write-heavy workloads
- Petabyte storage

Core model:

Key → Value

Example:

"user:123" → {json blob}

---

# 4️⃣ Append-Only Log Architecture

Instead of updating in-place:

Write = Append

WAL:
[ key1:value1 ]
[ key2:value2 ]
[ key1:value3 ] ← update

Old data remains until cleanup.

Benefits:

- Sequential disk writes (fast)
- No random disk seek
- High throughput

Problem:

- Duplicate entries
- Growing file size
- Memory index growth

---

# 5️⃣ LSM Tree (Log Structured Merge Tree)

Designed for write-optimized workloads.

Used in:

- Cassandra
- HBase
- BigTable
- LevelDB
- RocksDB

---

# Core LSM Components

          Write Path
               ↓
       +----------------+
       |  WAL (Disk)    |
       +----------------+
               ↓
       +----------------+
       |  MemTable (RAM)|
       +----------------+
               ↓ (Flush)
       +----------------+
       |  SSTable L0    |
       +----------------+
               ↓
       +----------------+
       |  SSTable L1    |
       +----------------+
               ↓
       +----------------+
       |  SSTable L2    |
       +----------------+

Hierarchical storage levels.

---

# 6️⃣ Write Path in LSM

1. Append to WAL
2. Insert into MemTable
3. When MemTable full:
   - Sort keys
   - Flush to disk as SSTable
   - Clear MemTable
   - Start new WAL

Important:

Writes are always sequential.

---

# 7️⃣ MemTable Internals

Usually implemented as:

- Skip list
- Balanced tree
- Sorted structure

Why sorted?

Because SSTables must be sorted.

---

# 8️⃣ SSTable (Sorted String Table)

Properties:

- Immutable
- Sorted by key
- Contains unique keys
- Stored on disk

Structure:

+----------------------+
| Data Blocks |
+----------------------+
| Block Index |
+----------------------+
| Bloom Filter |
+----------------------+
| Footer Metadata |
+----------------------+

---

# 9️⃣ Read Path in LSM

Read algorithm:

1. Check MemTable
2. Check L0 SSTables
3. Check L1
4. Check L2 ...
5. Use Bloom filters to skip files
6. Use sparse index
7. Binary search inside block

Worst case:
Search multiple levels.

---

# 🔟 Bloom Filter

Probabilistic structure.

- False positive possible
- No false negative

Purpose:

Avoid disk lookup if key not present.

Space efficient bit array + hash functions.

---

# 1️⃣1️⃣ Sparse Index

Instead of indexing every key:

Index every Nth key.

Example:

Key10 → Offset1
Key20 → Offset2
Key30 → Offset3

Reduces memory footprint.

---

# 1️⃣2️⃣ Compaction (Critical Concept)

Problem:

Multiple SSTables contain duplicates.

Solution:

Merge & deduplicate.

---

## Compaction Types

### 1. Size-Tiered Compaction

Merge similarly sized SSTables.

### 2. Leveled Compaction

Each level:

- Larger size
- No overlapping key ranges

Example:

L0 → 4 files
Merge → L1
L1 grows 10x L0

Benefits:

- Predictable read performance
- Reduced overlapping

---

# Compaction Process

Merge Sort Algorithm:

SSTable1: A C E
SSTable2: B C F

Result:
A B C E F (keep latest C)

Old files deleted after merge.

---

# 1️⃣3️⃣ Deletes in LSM

Deletes are not immediate.

Insert tombstone:

keyX → null

During compaction:
Old versions removed.

---

# 1️⃣4️⃣ Performance Characteristics

## Write Performance

Excellent.

Sequential disk write.

O(1) amortized.

---

## Read Performance

Slightly worse than B+ tree.

Multiple file lookups possible.

Optimized via:

- Bloom filters
- Compaction
- Caching

---

# 1️⃣5️⃣ Comparison: B+ Tree vs LSM

| Feature              | B+ Tree  | LSM Tree         |
| -------------------- | -------- | ---------------- |
| Write                | Random   | Sequential       |
| Read                 | Fast     | Slightly slower  |
| Update               | In-place | Append-only      |
| Fragmentation        | Low      | Needs compaction |
| Write-heavy workload | Weak     | Strong           |
| SSD friendly         | Moderate | Very good        |

---

# 1️⃣6️⃣ Distributed Scaling

LSM supports:

- Sharding by key range
- Consistent hashing
- Replication
- Leader-follower
- Quorum reads/writes

SSTables distributed across nodes.

---

# 1️⃣7️⃣ Durability

Ensured by:

- WAL fsync
- Replication
- Checkpointing
- Snapshotting

Crash recovery:

Rebuild MemTable from WAL.

---

# 1️⃣8️⃣ Advanced Concepts

## Write Amplification

Data rewritten multiple times during compaction.

## Read Amplification

Multiple SSTables checked.

## Space Amplification

Temporary duplicate data.

Trade-offs carefully tuned.

---

# 1️⃣9️⃣ Real World Examples

| Database     | Storage Engine |
| ------------ | -------------- |
| Cassandra    | LSM-based      |
| HBase        | LSM-based      |
| BigTable     | LSM-based      |
| RocksDB      | LSM-based      |
| MySQL InnoDB | B+ Tree        |

---

# 2️⃣0️⃣ Why LSM Wins at Petabyte Scale

- Sequential writes
- SSD optimized
- Easy partitioning
- Background compaction
- Immutable storage simplifies replication

---

# Final Architecture Summary

Client
↓
Coordinator Node
↓
Partition by Key
↓
WAL Append
↓
MemTable
↓
Flush → SSTable
↓
Compaction
↓
Optimized Disk Layout

---

# Interview-Level Questions

### Q1: Why are SSTables immutable?

To simplify concurrency and enable safe background compaction.

### Q2: What causes write amplification?

Repeated rewriting during compaction.

### Q3: Why is LSM better for SSD?

Sequential writes reduce wear and maximize throughput.

### Q4: How does LSM handle updates?

Append new version; old versions cleaned during compaction.

### Q5: What is the main trade-off?

Excellent write performance vs increased read complexity.

---

# Core Insight

LSM Trees trade:

Complex writes in B+ Trees  
for  
Complex reads + compaction in LSM

But gain:

Massive write throughput  
Better horizontal scalability  
Petabyte-ready architecture
