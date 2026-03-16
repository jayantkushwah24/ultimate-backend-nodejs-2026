# Advanced API & REST System Design Notes
Complete Guide for Backend Engineers

Goal:
Build strong conceptual and architectural understanding of APIs used in modern backend systems.

Coverage:

1. API Fundamentals
2. HTTP Protocol Deep Dive
3. REST Architecture Principles
4. API Design Best Practices
5. Security & Authentication
6. API Versioning & Lifecycle
7. Performance & Scalability
8. Microservice Communication
9. API Gateway Architecture
10. Fault Tolerance (Retries, Circuit Breakers)
11. Idempotency in Distributed Systems
12. REST vs GraphQL vs gRPC
13. Real-World API Architecture

------------------------------------------------------------

# 1. What is an API

API = Application Programming Interface.

An API is a **contract that allows different software systems to communicate**.

It defines:

• request structure  
• response format  
• allowed operations  
• authentication rules  
• error handling  

Example

Mobile App → Backend API → Database

The API acts as the **controlled interface**.

------------------------------------------------------------

# 2. Why APIs Are Critical

APIs are the foundation of modern distributed systems.

Reasons they exist:

### Decoupling

Frontend and backend evolve independently.

### Reusability

Same API used by:

web  
mobile  
third-party integrations

### Abstraction

Client does not know internal system complexity.

### Security

Clients never interact directly with database.

------------------------------------------------------------

# 3. Types of APIs

### Internal APIs

Used within an organization.

Example

microservice communication.

---

### Partner APIs

Exposed to trusted partners.

Example

payment gateway integration.

---

### Public APIs

Open to external developers.

Example APIs from:

- :contentReference[oaicite:0]{index=0}  
- :contentReference[oaicite:1]{index=1}  
- :contentReference[oaicite:2]{index=2}  

------------------------------------------------------------

# 4. API Architectural Styles

Several architectural approaches exist.

### REST
Most widely used for web APIs.

### RPC
Function-style calls.

### GraphQL
Client defines response structure.

### gRPC
Binary protocol built on HTTP/2.

### SOAP
Older XML-based protocol.

------------------------------------------------------------

# 5. REST (Representational State Transfer)

REST was defined by **:contentReference[oaicite:3]{index=3}** in his doctoral dissertation.

REST is **an architectural style**, not a protocol.

REST APIs use **HTTP methods to manipulate resources**.

------------------------------------------------------------

# 6. Core REST Concept: Resources

A resource represents an entity in the system.

Examples

User  
Order  
Product  
Cart

Resources are identified using URIs.

Example


/users/42
/orders/1001
/products/8


------------------------------------------------------------

# 7. Representations

Resources are transferred as **representations**.

Common formats:

JSON  
XML  
Protocol Buffers

Example

```json
{
  "id": 42,
  "name": "Jayant",
  "email": "jayant@example.com"
}
8. REST Architectural Constraints

REST systems follow six constraints.

1 Client-Server

Client and server responsibilities are separated.

Client

UI

Server

Business logic and data.

2 Stateless

Each request must contain all required information.

Server does not store session state.

Example

Authorization: Bearer <JWT>

Benefits

scalability
load balancing

3 Cacheable

Responses should define whether they can be cached.

Example

Cache-Control: max-age=3600

Benefits

reduced server load
faster responses

4 Uniform Interface

The interaction between client and server must be standardized.

Principles

Resource identification
Self-descriptive messages
Representation manipulation
Hypermedia controls

5 Layered System

Architecture can contain layers.

Example

Client
↓
CDN
↓
API Gateway
↓
Service
↓
Database

Client does not know internal layers.

6 Code on Demand (Optional)

Server can send executable code.

Rarely used outside web browsers.

9. HTTP Protocol Fundamentals

REST APIs rely heavily on HTTP.

Important elements

methods
headers
status codes
URIs

10. HTTP Methods

GET
POST
PUT
PATCH
DELETE

GET

Retrieve resource.

Properties

safe
idempotent

Example

GET /users/42
POST

Create resource.

POST /orders

Not idempotent.

PUT

Replace entire resource.

PUT /users/42

Idempotent.

PATCH

Partially update resource.

PATCH /users/42
DELETE

Remove resource.

DELETE /users/42
11. HTTP Status Codes

Important categories.

2xx success
3xx redirect
4xx client error
5xx server error

Examples

200 OK
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
500 Internal Server Error

12. URI Design Rules

Use nouns not verbs.

Bad

/getUsers
/createUser

Good

/users
/users/42
13. Filtering, Pagination, Sorting

Example filtering

GET /orders?status=shipped

Pagination

GET /users?page=1&limit=50

Cursor pagination

GET /users?cursor=abc123

Sorting

GET /products?sort=price
14. API Versioning

APIs evolve over time.

Versioning strategies.

URI versioning
/v1/users
/v2/users
Header versioning
Accept: application/vnd.api.v1+json
15. Authentication

Authentication verifies identity.

Common methods

API Keys
JWT Tokens
OAuth2

Example header

Authorization: Bearer <token>
16. Authorization

Authorization determines permissions.

Example

user can read order
user cannot delete order

17. API Security

Important protections.

HTTPS
input validation
rate limiting
authentication tokens
logging

18. API Gateway Architecture

Large systems introduce API Gateways.

Responsibilities

authentication
rate limiting
request routing
logging
protocol translation

Typical architecture

Client
↓
API Gateway
↓
Microservices

Examples used in production

Amazon uses gateway architecture extensively.

Netflix built custom edge gateways.

19. Microservice Communication Patterns

Services communicate through APIs.

Two main models.

Synchronous Communication

Service calls another service directly.

Example

HTTP REST
gRPC

Problem

Service dependency chain.

Asynchronous Communication

Uses message queues.

Examples

Kafka
RabbitMQ

Benefits

decoupling
better fault tolerance

20. API Scalability

APIs must handle large traffic.

Techniques

load balancing
horizontal scaling
caching
rate limiting

Example architecture

Client
↓
CDN
↓
Load Balancer
↓
API Gateway
↓
Microservices

21. Idempotency Keys

Critical in payment APIs.

Used by companies like Stripe.

Problem

Network retries may duplicate requests.

Solution

Client sends unique idempotency key.

Example

Idempotency-Key: 7a8c9d

Server stores key and ensures request processed once.

22. Retries and Circuit Breakers

Distributed systems fail frequently.

APIs must handle failures.

Retry logic

Client retries failed request.

But must avoid infinite retry storms.

Circuit Breaker Pattern

If service repeatedly fails:

Stop calling service temporarily.

Libraries

Hystrix
Resilience4j

23. Rate Limiting

Prevent abuse and overload.

Strategies

Token bucket
Leaky bucket

Headers

X-RateLimit-Limit
X-RateLimit-Remaining
24. API Observability

Production APIs must be monitored.

Metrics

latency
error rate
throughput

Tools

Prometheus
Grafana
Datadog

25. REST vs GraphQL

REST

multiple endpoints
fixed responses

GraphQL

single endpoint
client chooses fields

Tradeoff

REST simpler
GraphQL flexible

26. REST vs gRPC

REST

text-based JSON
human readable

gRPC

binary protocol
faster
strong schema

27. API Lifecycle Management

Stages

Design
Implementation
Testing
Deployment
Versioning
Deprecation

APIs are long-term contracts.

Breaking changes must be avoided.

28. Real-World API Architecture

Example large-scale architecture used by companies like:

Amazon

Netflix

Stripe

Typical flow

Client
↓
CDN
↓
API Gateway
↓
Auth Service
↓
Microservices
↓
Databases

29. Common API Anti-Patterns

Verb based URLs
No versioning
Large payloads
No pagination
Ignoring HTTP status codes

30. Skills Expected from Senior Backend Engineers

Understanding of

HTTP protocol internals
REST constraints
API versioning strategies
security models
scalable API architecture
fault tolerance patterns
distributed system behavior

Final Insight

APIs are long-term contracts between systems.

Poorly designed APIs cause:

technical debt
breaking integrations
scalability problems

Good API design prioritizes

consistency
simplicity
stability
scalability