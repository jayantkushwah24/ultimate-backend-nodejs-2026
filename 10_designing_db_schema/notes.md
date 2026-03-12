# Database Schema Design & Data Modeling (RDBMS) — Deep Interview Notes

This document explains:

- How to design database schemas
- How to perform data modeling
- Interview approach for schema design
- Step-by-step schema design examples
- Case studies:
  - Booking platform (like Booking.com)
  - Social platform (like Twitter)

Focus: **Production-grade relational database design**.

---

# 1. What is Database Schema Design?

Database schema design is the process of **structuring data into tables, relationships, constraints, and indexes** so that the system is:

- consistent
- scalable
- performant
- maintainable

A schema defines:

```
Tables
Columns
Primary Keys
Foreign Keys
Relationships
Indexes
Constraints
```

---

# 2. Goals of Good Schema Design

A well-designed schema must achieve:

### Data Integrity

Avoid inconsistent or duplicate data.

### Query Efficiency

Common queries should be fast.

### Scalability

Schema must support growth.

### Maintainability

Changes should not break the system.

---

# 3. Data Modeling Process

The process typically follows **three stages**.

```
Conceptual Model
        ↓
Logical Model
        ↓
Physical Model
```

---

## 3.1 Conceptual Model

High-level representation of entities.

Example for booking system:

```
User
Hotel
Room
Booking
Payment
Review
```

Focus on **entities and relationships**.

---

## 3.2 Logical Model

Define:

- attributes
- relationships
- cardinality

Example:

```
User
- id
- name
- email

Hotel
- id
- name
- city

Room
- id
- hotel_id
- price
```

Relationships defined.

---

## 3.3 Physical Model

Actual SQL tables.

Includes:

- indexes
- constraints
- partitioning
- storage optimizations

---

# 4. Entity Relationship Modeling (ER Model)

Entities represent real-world objects.

Example:

```
User
Hotel
Room
Booking
```

Relationships define interaction.

```
User → Booking
Hotel → Rooms
Room → Booking
```

---

## Cardinality Types

### One-to-One

```
User → Profile
```

### One-to-Many

```
Hotel → Rooms
```

### Many-to-Many

```
Users → Likes → Tweets
```

Implemented via **junction tables**.

---

# 5. Normalization

Normalization removes redundancy.

Common forms:

### 1NF

Atomic columns.

Bad:

```
phone_numbers: [123,456]
```

Good:

```
Phone table
```

---

### 2NF

Remove partial dependency.

---

### 3NF

Remove transitive dependency.

Example:

Bad:

```
user_id
city
country
```

Better:

```
city_id → country
```

---

# 6. Denormalization

Sometimes used for performance.

Example:

Store:

```
tweet_count
followers_count
```

instead of calculating every time.

Trade-off:

```
Consistency vs Performance
```

---

# 7. Indexing Strategy

Indexes improve query speed.

Types:

### B-tree index

Default index.

Used for:

```
WHERE
JOIN
ORDER BY
```

---

### Composite Index

Example:

```
INDEX(user_id, created_at)
```

Useful for timeline queries.

---

### Unique Index

Ensures uniqueness.

Example:

```
email UNIQUE
```

---

# 8. Schema Design Interview Approach

In interviews, follow a structured approach.

### Step 1 — Clarify Requirements

Ask:

- expected scale
- read vs write heavy
- important queries
- consistency requirements

---

### Step 2 — Identify Core Entities

List main objects.

Example:

Booking system:

```
User
Hotel
Room
Booking
Payment
Review
```

---

### Step 3 — Define Relationships

Example:

```
Hotel → Rooms
Room → Bookings
User → Bookings
User → Reviews
```

---

### Step 4 — Design Tables

Define:

- primary keys
- foreign keys
- columns

---

### Step 5 — Add Indexes

Optimize key queries.

---

### Step 6 — Consider Scaling

Discuss:

- sharding
- caching
- read replicas

---

# 9. Case Study: Booking Platform (Booking.com)

## Core Requirements

Users should:

- search hotels
- check availability
- book rooms
- leave reviews

---

## Entities

```
User
Hotel
Room
Booking
Payment
Review
```

---

## Schema Design

### Users

```
users
------
id (PK)
name
email
password_hash
created_at
```

---

### Hotels

```
hotels
------
id (PK)
name
city
address
rating
```

---

### Rooms

```
rooms
------
id (PK)
hotel_id (FK)
room_type
price
capacity
```

Relationship:

```
hotel → many rooms
```

---

### Bookings

```
bookings
-------
id (PK)
user_id
room_id
check_in
check_out
status
created_at
```

Indexes:

```
INDEX(room_id, check_in, check_out)
```

Used for **availability checks**.

---

### Payments

```
payments
--------
id
booking_id
amount
status
payment_method
created_at
```

---

### Reviews

```
reviews
-------
id
user_id
hotel_id
rating
comment
created_at
```

---

## Availability Query

Check overlapping bookings.

Example logic:

```
SELECT *
FROM bookings
WHERE room_id = ?
AND check_in < requested_checkout
AND check_out > requested_checkin
```

---

# 10. Case Study: Twitter Schema

## Core Requirements

Users should:

- post tweets
- follow users
- like tweets
- view timeline

---

## Entities

```
User
Tweet
Follow
Like
Retweet
```

---

## Users Table

```
users
------
id (PK)
username
email
created_at
```

---

## Tweets Table

```
tweets
------
id (PK)
user_id
content
created_at
```

Index:

```
INDEX(user_id, created_at DESC)
```

Used for timeline.

---

## Followers Table

Many-to-many relationship.

```
follows
--------
follower_id
following_id
created_at
```

Composite primary key:

```
PK(follower_id, following_id)
```

---

## Likes Table

```
likes
------
user_id
tweet_id
created_at
```

Composite PK:

```
PK(user_id, tweet_id)
```

---

## Retweets Table

```
retweets
--------
user_id
tweet_id
created_at
```

---

# 11. Timeline Query

Get tweets from followed users.

```
SELECT tweets.*
FROM tweets
JOIN follows
ON tweets.user_id = follows.following_id
WHERE follows.follower_id = ?
ORDER BY tweets.created_at DESC
LIMIT 50
```

Indexes required:

```
tweets(user_id, created_at)
follows(follower_id)
```

---

# 12. Scaling Considerations

Large systems use:

### Read Replicas

Distribute read traffic.

### Sharding

Split data across databases.

Example:

```
tweets_shard_1
tweets_shard_2
tweets_shard_3
```

Based on user_id.

---

### Caching

Use Redis for:

```
timeline cache
user profile
follower list
```

---

# 13. Common Schema Design Mistakes

Bad practices:

- No indexes
- Over-normalization
- Large join chains
- Storing arrays in SQL columns
- Missing foreign keys

---

# 14. Interview Tips

When asked to design DB schema:

Do NOT jump to tables immediately.

Explain:

1. Requirements
2. Entities
3. Relationships
4. Schema
5. Indexing
6. Scaling

Interviewers evaluate **thought process**.

---

# 15. Key Insight

Schema design is about balancing:

```
Consistency
Performance
Scalability
```

Good engineers design schemas around **query patterns**, not just data structure.
