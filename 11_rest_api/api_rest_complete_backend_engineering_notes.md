# API & REST API Engineering — Complete Notes
Backend Engineering Reference

Goal:
Provide a deep conceptual and practical understanding of API design and REST architecture suitable for backend system design.

Contents

1. API Fundamentals
2. HTTP Basics for APIs
3. REST Architecture
4. REST Constraints
5. REST API Design Rules
6. HTTP Methods & Semantics
7. Status Codes
8. URI Design
9. Filtering, Pagination, Sorting
10. Authentication & Authorization
11. API Security
12. API Versioning
13. Error Handling
14. API Gateway Architecture
15. Microservice Communication
16. API Scalability
17. Idempotency
18. Retries & Circuit Breakers
19. Rate Limiting
20. Observability
21. REST vs GraphQL vs gRPC
22. API Design Patterns in Large Systems

------------------------------------------------------------

# 1. API Fundamentals

API stands for Application Programming Interface.

An API is a **contract that defines how two software systems communicate**.

It specifies:

request format  
response format  
authentication rules  
error handling  
supported operations

Example architecture:

Client → API → Backend Service → Database

The API acts as the **boundary between clients and internal systems**.

------------------------------------------------------------

# 2. Why APIs Exist

APIs provide key advantages.

Decoupling  
Frontend and backend evolve independently.

Reusability  
Multiple clients use same backend logic.

Abstraction  
Clients interact with high-level operations.

Security  
Direct database access is prevented.

------------------------------------------------------------

# 3. Types of APIs

Internal APIs  
Used between services within an organization.

Partner APIs  
Exposed to trusted partners.

Public APIs  
Available to external developers.

Examples include platforms from organizations such as **:contentReference[oaicite:0]{index=0}**, **:contentReference[oaicite:1]{index=1}**, and **:contentReference[oaicite:2]{index=2}**.

------------------------------------------------------------

# 4. API Architectural Styles

REST  
Most common web API style.

RPC  
Remote procedure calls.

GraphQL  
Client specifies required data fields.

gRPC  
High-performance binary RPC over HTTP/2.

SOAP  
XML-based legacy protocol.

------------------------------------------------------------

# 5. REST Architecture

REST stands for Representational State Transfer.

It was introduced by **:contentReference[oaicite:3]{index=3}**.

REST is an architectural style where clients interact with **resources** using HTTP methods.

------------------------------------------------------------

# 6. REST Core Concept: Resources

A resource represents an entity in a system.

Examples

User  
Order  
Product  
Cart

Resources are identified by URIs.

Example

/users/42  
/orders/1001  
/products/5

------------------------------------------------------------

# 7. Resource Representation

Resources are transferred in representations.

Most common format: JSON.

Example

```json
{
  "id": 42,
  "name": "Jayant",
  "email": "jayant@example.com"
}
8. REST Architectural Constraints

REST systems follow six constraints.

Client–Server
Stateless
Cacheable
Uniform Interface
Layered System
Code on Demand (optional)

9. REST API Design Rules
Use nouns not verbs in URLs

Bad

/getUsers
/createUser

Good

/users
/users/42

HTTP methods express the action.

HTTP method + URL should clearly describe intent

Examples

GET /users
POST /users
PATCH /users/42
DELETE /users/42

Use JSON for request and response bodies

Headers should include:

Content-Type: application/json
Accept: application/json

Use plural resource names

/users
/products
/orders

Maintain consistent URL structure

/resources
/resources/{id}
/resources/{id}/subresources

Example

/users
/users/42
/users/42/orders

Use query parameters for filtering

GET /orders?status=shipped

Use pagination for large datasets

GET /users?page=2&limit=50

Better approach

GET /users?cursor=abc123

Support sorting

GET /products?sort=price
GET /products?sort=-created_at

Support field filtering

GET /users?fields=id,name

Always use HTTPS

All production APIs must run over HTTPS.

Use consistent error responses

Example

{
  "error": "INVALID_EMAIL",
  "message": "Email format invalid"
}
10. HTTP Methods

GET
Retrieve resource.

POST
Create resource.

PUT
Replace entire resource.

PATCH
Update partial resource.

DELETE
Remove resource.

11. Idempotency

An operation is idempotent if repeated requests produce the same result.

Idempotent methods

GET
PUT
DELETE

Non-idempotent

POST

12. HTTP Status Codes

2xx success

200 OK
201 Created
204 No Content

4xx client errors

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found

5xx server errors

500 Internal Server Error
503 Service Unavailable

13. Authentication

Authentication verifies identity.

Common methods

API Keys
JWT tokens
OAuth2

Example header

Authorization: Bearer <token>

14. Authorization

Authorization determines permissions.

Example

User can view orders but cannot delete them.

15. API Security

Security best practices include:

HTTPS
Input validation
Rate limiting
Authentication tokens
Audit logging

16. API Versioning

APIs evolve over time.

Versioning strategies:

URI versioning

/v1/users
/v2/users

Header versioning

Accept: application/vnd.api.v1+json

17. Error Handling

APIs should provide structured error responses.

Example

{
  "error": "USER_NOT_FOUND",
  "message": "User does not exist"
}
18. API Gateway Architecture

Large systems introduce an API gateway.

Responsibilities

Authentication
Routing
Rate limiting
Logging
Protocol translation

Architecture

Client
↓
API Gateway
↓
Microservices

Many distributed architectures used by companies such as Amazon and Netflix follow this model.

19. Microservice Communication

Services communicate through APIs.

Two patterns exist.

Synchronous communication

REST
gRPC

Asynchronous communication

Kafka
RabbitMQ

Asynchronous messaging improves fault tolerance.

20. API Scalability

High traffic APIs require scalable architecture.

Techniques

Load balancing
Horizontal scaling
Caching
Rate limiting

Typical architecture

Client
↓
CDN
↓
Load Balancer
↓
API Gateway
↓
Services

21. Idempotency Keys

Important for financial operations.

Used widely in payment APIs such as those provided by Stripe.

Example header

Idempotency-Key: a1b2c3

Server ensures duplicate requests do not create duplicate operations.

22. Retries and Circuit Breakers

Distributed systems experience failures.

Retry logic allows requests to be retried.

Circuit breaker pattern temporarily stops requests to failing services to prevent cascading failures.

23. Rate Limiting

APIs must protect themselves from excessive traffic.

Example headers

X-RateLimit-Limit
X-RateLimit-Remaining

24. Observability

Production APIs must be monitored.

Metrics

Latency
Error rate
Throughput

Common monitoring tools include Prometheus and Grafana.

25. REST vs GraphQL

REST

Multiple endpoints
Fixed response structures

GraphQL

Single endpoint
Flexible queries

Tradeoff

REST simpler
GraphQL more flexible

26. REST vs gRPC

REST

Text-based JSON
Easy to debug

gRPC

Binary protocol
Higher performance
Strong schema

Often used for internal service communication.

27. API Design Patterns Used in Large Systems

Backend engineers designing large systems must understand common API design patterns.

Backend-for-Frontend (BFF)

Different APIs for web and mobile clients.

API Gateway Pattern

Centralized entry point for services.

Aggregator Pattern

Combines responses from multiple services.

Proxy Pattern

API acts as intermediary between client and internal services.

Strangler Pattern

Gradual migration from monolith to microservices.

Final Insight

APIs are long-term contracts between systems.

Changing them later is extremely expensive.

Therefore good API design prioritizes:

Consistency
Clarity
Stability
Backward compatibility
Scalability