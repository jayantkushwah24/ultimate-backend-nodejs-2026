# Database Foundations for Software Engineers (SDE Level)

A Deep Conceptual Guide to DB, DBMS, and RDBMS

Author: Study Notes
Goal: Build strong conceptual understanding for backend engineers and system designers.

---

# 1. What is Data

Data represents raw facts describing entities or events.

Examples

Number
42

String
"Jayant"

Date
2026-03-12

Boolean
true / false

Binary
image bytes

Data becomes **information** when interpreted in context.

Example

Raw Data

user_id = 21
purchase = 200

Information

User 21 purchased product worth ₹200.

---

# 2. What is a Database

A **Database** is an organized collection of structured data stored electronically for efficient access, manipulation, and persistence.

Core properties

Persistence  
Concurrency support  
Structured organization  
Efficient querying  
Integrity guarantees  
Security

Example databases

Banking systems  
E-commerce platforms  
Social networks  
Inventory systems  
Analytics platforms

---

# 3. File System vs Database System

Before DBMS existed, data was stored in **flat files**.

Example

customer.txt  
orders.txt

Problems:

### Data Redundancy

Same information stored in multiple places.

Example

customer_name appears in:

orders.txt  
customers.txt

Result

Storage waste  
Inconsistency

---

### Data Inconsistency

Multiple copies become different.

Example

customers.txt  
Address = Delhi

orders.txt  
Address = Mumbai

Which one is correct?

---

### Poor Query Capability

To answer a query you must write custom code.

Example question

"Find all customers who ordered more than ₹5000 last month."

File systems require manual parsing.

Databases allow:

SQL query execution.

---

### Poor Concurrency

Multiple users updating the same file causes corruption.

---

### Weak Security

File systems cannot easily enforce row-level or column-level permissions.

---

### Poor Data Integrity

Constraints like:

Age > 0  
Balance ≥ 0

are not enforced automatically.

---

# 4. What is DBMS

A **Database Management System (DBMS)** is software that manages databases and provides an interface for storing, retrieving, and managing data.

Examples

PostgreSQL  
MySQL  
Oracle  
SQL Server  
SQLite

---

# 5. Responsibilities of DBMS

A DBMS provides the following services.

### Data Storage

Organizes data on disk using optimized structures.

### Query Processing

Interprets and executes queries.

### Concurrency Control

Allows multiple users to access data safely.

### Transaction Management

Guarantees atomic operations.

### Data Integrity

Enforces constraints.

### Backup and Recovery

Handles crashes and restores data.

### Security

Authentication and authorization.

---

# 6. DBMS Architecture

Typical DBMS architecture:

Applications
|
SQL Interface
|
Query Processor
|
Storage Manager
|
Disk Storage

---

# 7. Query Processor

Responsible for executing queries.

Components:

Parser  
Optimizer  
Executor

---

### Parser

Checks syntax and converts SQL into internal representation.

Example

SELECT \* FROM users

Becomes:

Query tree.

---

### Optimizer

Determines best execution strategy.

Example options

Full table scan  
Index lookup  
Hash join

Optimizer chooses lowest cost plan.

---

### Executor

Runs the chosen query plan.

---

# 8. Storage Manager

Handles physical data storage.

Components

File Manager  
Buffer Manager  
Index Manager  
Transaction Manager

---

# 9. Database Models

Different ways to structure data.

Hierarchical model  
Network model  
Relational model  
Object-oriented model  
NoSQL models

Most important today:

Relational model.

---

# 10. Relational Model

Proposed by **Edgar F. Codd (1970)**.

Data is stored as **relations (tables)**.

---

# 11. Relational Model Terminology

### Relation

A table.

Example

Students

| id | name | age |

---

### Tuple

A row in table.

Example

(1, Alice, 20)

---

### Attribute

A column.

Example

name

---

### Domain

Allowed set of values.

Example

age → integers 0-120

---

# 12. Keys in Databases

Keys uniquely identify rows.

---

# 13. Super Key

Any attribute set that uniquely identifies rows.

Example

Student table

student_id  
student_id + name

Both uniquely identify rows.

---

# 14. Candidate Key

Minimal super key.

Example

student_id  
email

Either can uniquely identify a student.

---

# 15. Primary Key

Chosen candidate key used for identification.

Properties

Unique  
Not null  
Stable  
Minimal

Example

student_id

---

### Natural vs Surrogate Keys

Natural key

Derived from real world attribute.

Example

email

Problems

May change  
Large index size

---

Surrogate key

Artificial identifier.

Example

user_id BIGINT AUTO_INCREMENT

Preferred in large systems.

---

# 16. Composite Key

Primary key composed of multiple attributes.

Example

Enrollment table

(student_id, course_id)

This pair uniquely identifies enrollment.

---

# 17. Foreign Key

A foreign key references primary key of another table.

Example

Orders table

order_id  
user_id

user_id references Users(id)

Purpose

Maintains relationships.

---

# 18. Referential Integrity

Ensures foreign key references valid record.

Example

Order cannot exist without valid user.

---

# 19. Foreign Key Actions

Common policies

ON DELETE CASCADE  
ON DELETE SET NULL  
ON DELETE RESTRICT  
ON UPDATE CASCADE

Example

If user deleted:

ON DELETE CASCADE

All orders deleted.

---

# 20. Integrity Constraints

Constraints maintain database correctness.

Types

Entity integrity  
Referential integrity  
Domain integrity  
User defined constraints

---

# 21. Functional Dependency

A fundamental concept for normalization.

Definition

Attribute B is functionally dependent on A if:

A → B

Meaning

Knowing A uniquely determines B.

Example

student_id → student_name

---

# 22. Normalization

Normalization reduces redundancy and anomalies.

---

# 23. First Normal Form (1NF)

Rules

Attributes must be atomic  
No repeating groups

Bad

phones = 123,456

Good

Separate rows.

---

# 24. Second Normal Form (2NF)

Requirements

Table must be in 1NF  
No partial dependency on composite key

Example

OrderItem

(order_id, product_id)

If product_name depends only on product_id

It should move to Product table.

---

# 25. Third Normal Form (3NF)

Removes transitive dependency.

Example

student_id → dept_id  
dept_id → dept_name

dept_name should not be stored in student table.

Create separate department table.

---

# 26. Boyce-Codd Normal Form (BCNF)

Stronger version of 3NF.

Rule

For every dependency

A → B

A must be super key.

---

# 27. Denormalization

Intentional redundancy for performance.

Example

Storing total order value.

Pros

Faster queries.

Cons

Data consistency issues.

---

# 28. Indexing

Indexes accelerate data retrieval.

Without index

Full table scan.

With index

Logarithmic search.

---

# 29. B+ Tree Index

Most relational databases use **B+ Trees**.

Properties

Balanced tree  
Sorted keys  
Efficient range queries

Time complexity

Search O(log n)

---

# 30. Hash Index

Uses hash function.

Best for

Equality queries.

Example

WHERE id = 10

Bad for

Range queries.

---

# 31. Composite Index

Index on multiple columns.

Example

INDEX(user_id, created_at)

Supports

WHERE user_id = 5  
WHERE user_id = 5 AND created_at > ...

But not

WHERE created_at > ...

This is called **left prefix rule**.

---

# 32. Query Optimization

DB chooses best execution plan.

Possible operations

Sequential scan  
Index scan  
Hash join  
Merge join  
Nested loop join

Optimizer uses:

Statistics  
Cost estimation.

---

# 33. Transactions

A **transaction** is a logical unit of work.

Example

Bank transfer

Debit A  
Credit B

Both must succeed together.

---

# 34. ACID Properties

Atomicity  
Consistency  
Isolation  
Durability

---

### Atomicity

All operations succeed or none.

---

### Consistency

Database always remains valid.

---

### Isolation

Concurrent transactions do not interfere.

---

### Durability

Committed changes persist after crash.

---

# 35. Concurrency Problems

Dirty reads  
Lost updates  
Non-repeatable reads  
Phantom reads

---

# 36. Isolation Levels

Read Uncommitted  
Read Committed  
Repeatable Read  
Serializable

Higher isolation = lower concurrency.

---

# 37. Locks

Databases use locks for concurrency control.

Types

Shared lock (read)  
Exclusive lock (write)

---

# 38. Deadlocks

Two transactions waiting for each other.

Example

T1 locks row A  
T2 locks row B  
T1 waits for B  
T2 waits for A

Database detects and aborts one transaction.

---

# 39. Multi Version Concurrency Control (MVCC)

Instead of locking rows for reads, DB keeps **multiple versions**.

Readers access snapshot of database.

Benefits

High concurrency  
Non-blocking reads

Used by

PostgreSQL  
MySQL InnoDB

---

# 40. Write Ahead Logging (WAL)

Rule

Log must be written before data page changes.

Purpose

Crash recovery.

---

# 41. Buffer Pool

Memory cache for disk pages.

Why important

Disk access is slow.

Buffer pool keeps frequently used pages in RAM.

---

# 42. Storage Structure

Databases store data in **pages**.

Typical page sizes

4KB  
8KB  
16KB

Page contains

Rows  
Metadata  
Pointers

---

# 43. Replication

Copy data across multiple servers.

Types

Master-Slave  
Multi-Master

Purpose

High availability  
Read scaling.

---

# 44. Sharding

Split database horizontally.

Example

UserID

1-1M → shard1  
1M-2M → shard2

Benefits

Scales writes.

Challenges

Cross shard joins  
Rebalancing.

---

# 45. CAP Theorem

Distributed systems can guarantee only two:

Consistency  
Availability  
Partition tolerance

---

# 46. RDBMS vs NoSQL

RDBMS

Strict schema  
ACID transactions

NoSQL

Flexible schema  
Horizontal scalability

---

# 47. Real Production Issues

Slow queries  
Missing indexes  
Deadlocks  
Replication lag  
Lock contention

---

# 48. What Senior Engineers Must Know

Query plans  
Index design  
Transaction isolation  
Schema evolution  
Sharding strategies  
Replication tradeoffs

---

# 49. Recommended Next Topics

SQL query optimization  
Database internals  
B+Tree implementation  
LSM trees  
Distributed databases  
NewSQL systems

---

END OF NOTES
