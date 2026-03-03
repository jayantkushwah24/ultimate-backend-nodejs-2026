### Summary of Video Content: Designing a High-Performance Database with LSM Trees

This video presents a detailed conceptual walkthrough of designing a high-performance database system oriented towards **fast reads and writes**, **durability**, and **support for unstructured data at petabyte scale**. It contrasts traditional relational database management systems (RDBMS) with modern NoSQL designs, eventually leading to the explanation of the **Log-Structured Merge (LSM) Tree** data structure, which underpins many modern scalable databases.

---

### Key Requirements for the Database Design

- **Fast reads and writes**, with an emphasis on writes being more critical.
- **Durability**: Data should persist even after system failures (e.g., power loss).
- Support for **unstructured data** instead of strictly structured schemas like RDBMS.
- Ability to handle **petabytes of data**, which requires horizontal scaling and partitioning.
- Avoid reliance on a single machine due to data volume.

---

### Limitations of RDBMS in the Context

- RDBMS require predefined schemas and fixed-size rows, enabling easy optimization.
- They store data sequentially on disk, facilitating fast linear scans and indexed searches.
- Updates are efficient because data types and sizes are fixed.
- However, RDBMS are **not optimized for unstructured data** or petabyte-scale storage.
- RDBMS use **Write-Ahead Logs (WAL)** and **B+ trees** for indexing and durability, but heavy write loads can cause expensive reindexing and balancing.

---

### Moving to Key-Value Stores and Unstructured Data

- The database will store data as **key-value pairs**, similar to hashmaps or dictionaries in programming languages.
- Keys are strings of variable lengths; values can be floats, strings, booleans, or other objects — representing schema-less data.
- Variable key lengths and unstructured values complicate storage and updates on disk.
- Overwriting existing data is problematic due to variable size, leading to fragmentation and inefficient random disk access.
- Proposed solution: **Append-only writes** — on update, instead of overwriting, append a new entry and update an in-memory hashmap for offsets.

---

### Basic Architecture: Write-Ahead Log + Hashmap + Append-Only File

- Data is stored in an **append-only file (Write-Ahead Log - WAL)** on disk.
- An **in-memory hashmap** stores keys and their latest offsets in the WAL for O(1) average lookup.
- Writes append new data; updates are treated as new inserts.
- Reads use the hashmap to directly seek to the latest value on disk.
- Durability is ensured by writing to disk; RAM is fast but volatile and limited in size.
- Problems arise:
  - WAL grows indefinitely with duplicate keys.
  - Hashmap size grows with number of unique keys, which can exceed RAM capacity at petabyte scale.
  - System crash loses in-memory hashmap (solved by rebuilding from WAL on reboot).
  - Single-machine limits require partitioning and distributed storage.

---

### Introducing LSM Trees for Efficient Storage and Indexing

- **LSM (Log-Structured Merge) Trees** are hierarchical, multi-level data structures designed for write-heavy workloads.
- Many NoSQL databases (e.g., Cassandra, HBase, BigTable) use LSM trees.
- LSM trees build on the WAL + hashmap foundation but add multiple layers to optimize storage and queries.

---

### Core Components of LSM Tree Design

| Component                           | Description                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Write-Ahead Log (WAL)**           | Append-only file storing all writes sequentially for durability and fast writes.                        |
| **MemTable (in RAM)**               | A hashmap reflecting the latest WAL data, storing unique keys with fast reads and writes.               |
| **SSTables (Sorted String Tables)** | Immutable, sorted files on disk created by flushing MemTable when full, containing unique keys only.    |
| **Sparse Index**                    | Lightweight index storing block ranges within SSTables to limit disk search scope.                      |
| **Bloom Filters**                   | Probabilistic data structures for fast negative membership tests to avoid unnecessary SSTable searches. |

---

### Data Flow and Operations in LSM Tree

- **Writes (Put operations):**
  - Append key-value pairs to WAL.
  - Update MemTable with the latest key and offset.
  - When MemTable reaches a size limit, flush it as a **sorted, unique SSTable** on disk.
  - Create a new WAL file and MemTable to continue operations.
- **Reads (Get operations):**
  - Check MemTable first for the key (fast RAM lookup).
  - If not found, consult Bloom filters of SSTables to eliminate unnecessary searches.
  - Use sparse index to identify the correct block within an SSTable.
  - Perform binary search within the block to find the key.
- **Updates:**
  - Treated as inserts (append new key-value pair).
  - Old versions remain in SSTables until compaction.
- **Deletes:**
  - Implemented as special updates with a **sentinel value** (e.g., null).
  - Old data is logically deleted during compaction.

---

### Compaction: Deduplication and Optimization Process

- Compaction merges multiple SSTables into fewer, larger SSTables while:
  - Removing duplicate keys and old versions.
  - Keeping only the latest value for each key.
- Uses a **merge-sort-like algorithm** for merging sorted SSTables efficiently.
- Recursively merges SSTables in a tree-like hierarchy, reducing the number of files and improving read performance.
- Old SSTables are deleted after compaction.
- Compaction runs in the background, minimizing impact on live reads and writes.

---

### Data Partitioning and Scalability

- SSTables can be stored on different machines, enabling **horizontal scaling and sharding**.
- Replication of SSTables improves fault tolerance and availability.
- MemTable acts as a cache, optimizing most reads.
- The overall architecture supports **petabyte-scale storage** with efficient writes, reads, and updates.

---

### Summary Table: Comparing RDBMS & LSM Tree-Based NoSQL

| Aspect                     | RDBMS                              | LSM Tree-Based NoSQL                                     |
| -------------------------- | ---------------------------------- | -------------------------------------------------------- |
| Data Structure             | Fixed schema, structured tables    | Schema-less key-value pairs                              |
| Write Pattern              | In-place updates, complex reindex  | Append-only writes, batch compaction                     |
| Indexing                   | B+ trees                           | Bloom filters + sparse index + sorted SSTables           |
| Durability                 | Write-ahead logs + B+ tree updates | Write-ahead log + flushed MemTables (SSTables)           |
| Read Performance           | Fast with indexes, fixed row size  | Fast with MemTable cache + bloom filters + binary search |
| Scalability                | Vertical scaling, limited sharding | Horizontal scaling with partitioned SSTables             |
| Handling Large Data        | Single machine or complex sharding | Distributed SSTables, multi-level compaction             |
| Handling Unstructured Data | Poor                               | Excellent                                                |

---

### Key Insights and Conclusions

- **LSM trees address the challenges of fast writes, durability, and unstructured data at large scale** by combining append-only logging, in-memory indexing, and multi-level sorted storage.
- **MemTable acts as a fast in-memory cache, while SSTables provide durable, sorted, immutable storage for efficient reads.**
- **Compaction is crucial for removing duplicates and optimizing storage without blocking writes or reads.**
- **Bloom filters and sparse indexes dramatically reduce unnecessary disk accesses, improving read performance.**
- The design naturally supports **scalability and fault tolerance** through partitioning and replication.
- This approach is widely adopted in modern NoSQL databases like Cassandra, making it a proven pattern for petabyte-scale data systems.

---

### Glossary

| Term                  | Definition                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| Write-Ahead Log (WAL) | Append-only file logging all writes for durability before applying changes.                      |
| MemTable              | In-memory hashmap holding recent writes for fast access and updates.                             |
| SSTable               | Immutable, sorted on-disk file storing flushed MemTable data with unique keys.                   |
| Bloom Filter          | Probabilistic data structure to test set membership with false positives but no false negatives. |
| Sparse Index          | Index storing block ranges within SSTables to narrow down search scope during reads.             |
| Compaction            | Background process merging SSTables, removing duplicates and old data versions.                  |
| Sentinel Value        | Special marker used to indicate deletion of a key in LSM trees.                                  |

---

### Final Notes

This video emphasizes the **evolution from RDBMS to LSM tree-based NoSQL databases** to overcome limitations related to schema rigidity, update inefficiencies, and scalability. It provides a thorough architectural foundation for understanding how modern distributed databases manage petabyte-scale, unstructured data with high throughput and durability.
