# API & REST API Engineering Notes

Deep Technical Guide for Backend Engineers

Goal: Build strong conceptual understanding of APIs and REST design so that systems can be designed at a senior backend engineer level.

---

# 1. What is an API

API = Application Programming Interface.

An API is a **contract that allows two software systems to communicate**.

It defines:

• How requests are sent  
• What responses look like  
• What operations are allowed  
• Authentication requirements  
• Error formats

Without APIs, systems cannot integrate reliably.

Example:

Mobile app → Backend server  
Frontend → Microservice  
Service → Database gateway

---

# 2. Why APIs Exist

APIs solve several engineering problems.

### 1 Decoupling Systems

Systems can evolve independently.

Example

Mobile team and backend team can work separately.

---

### 2 Reusability

Same API used by:

• mobile app  
• web app  
• partner services

---

### 3 Abstraction

Client does not know internal logic.

Example

Client calls:

POST /orders

Server handles:

• inventory  
• payment  
• shipping

---

### 4 Security

Clients cannot access internal databases directly.

---

# 3. Types of APIs

### 1 Internal APIs

Used inside organization.

Example

Microservice communication.

---

### 2 Partner APIs

Shared with trusted partners.

Example

Payment provider APIs.

---

### 3 Public APIs

Available to external developers.

Example

Stripe API  
GitHub API

---

# 4. API Architectural Styles

Several architectural patterns exist.

### REST

Most common for web APIs.

### RPC

Remote procedure calls.

### GraphQL

Flexible query language.

### gRPC

High performance binary RPC.

### SOAP

Legacy XML protocol.

---

# 5. REST

REST = Representational State Transfer.

Proposed by **Roy Fielding (2000)**.

REST is an **architectural style**, not a protocol.

REST uses HTTP to manipulate **resources**.

---

# 6. Core REST Concept: Resource

A resource represents an object or entity.

Examples

User  
Order  
Product  
Cart

Each resource is identified by a **URI**.

Example

/users/42
/orders/1001
/products/10

---

# 7. Representation

Resource data returned in representation format.

Common formats

JSON  
XML  
Protocol Buffers

Example JSON response

```json
{
  "id": 42,
  "name": "Jayant",
  "email": "jayant@example.com"
}
8. REST Constraints

REST systems follow six constraints.

1 Client Server

Client and server are independent.

Client handles UI.
Server handles data.

Benefits

Independent evolution.

2 Stateless

Each request must contain all required information.

Server does not store session state.

Example

Bad

login -> store session
request -> server remembers

Better

Use token in every request.

Example

Authorization: Bearer <token>

Benefits

Scalability
Easy load balancing.

3 Cacheable

Responses should indicate whether they can be cached.

HTTP caching improves performance.

Example

Cache-Control: max-age=3600
4 Uniform Interface

Standardized interface between components.

Four main rules:

Resource identification
Manipulation through representations
Self descriptive messages
Hypermedia controls

5 Layered System

System may have multiple layers.

Example

Client → API Gateway → Service → Database

Client does not know internal structure.

6 Code on Demand (Optional)

Server may send executable code.

Example

JavaScript sent to browser.

Rarely used in APIs.

9. HTTP Protocol in APIs

REST APIs rely heavily on HTTP.

Important components:

Methods
Headers
Status codes
URI structure

10. HTTP Methods

HTTP methods represent operations on resources.

GET

Retrieve resource.

Properties

Safe
Idempotent

Example

GET /users/42
POST

Create new resource.

Example

POST /orders

Body contains data.

Not idempotent.

PUT

Replace entire resource.

Example

PUT /users/42

Idempotent.

PATCH

Partially update resource.

Example

PATCH /users/42

Body

{ "name": "John" }
DELETE

Remove resource.

Example

DELETE /users/42

Idempotent.

11. Idempotency

An operation is idempotent if multiple identical requests produce same result.

Example

DELETE /users/42

Deleting multiple times still results in resource being deleted.

Important for reliability.

12. HTTP Status Codes

Responses include status codes.

2xx Success

200 OK
201 Created
204 No Content

3xx Redirection

301 Moved Permanently
304 Not Modified

4xx Client Errors

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity

5xx Server Errors

500 Internal Server Error
502 Bad Gateway
503 Service Unavailable

13. URI Design

Good REST APIs follow clear URI design.

Rules:

Use nouns not verbs.

Bad

/getUsers
/createUser

Good

/users
/users/42
14. Resource Hierarchies

Relationships expressed through paths.

Example

/users/42/orders

Meaning

Orders belonging to user.

15. Filtering

Use query parameters.

Example

GET /orders?status=shipped
16. Pagination

Large datasets should be paginated.

Example

GET /users?page=2&limit=50

Alternative

Cursor pagination.

Example

GET /users?cursor=abc123

Cursor pagination scales better.

17. Sorting

Example

GET /products?sort=price
GET /products?sort=-created_at
18. Field Selection

Clients may request specific fields.

Example

GET /users?fields=id,name

Reduces payload size.

19. API Versioning

APIs evolve over time.

Strategies:

URI Versioning
/v1/users
/v2/users
Header Versioning
Accept: application/vnd.api.v1+json
Query Versioning
/users?version=1

URI versioning is most common.

20. Error Handling

Standardized error responses improve usability.

Example

{
  "error": "INVALID_EMAIL",
  "message": "Email format invalid"
}

Include:

error code
message
details

21. Rate Limiting

APIs must protect resources.

Example

1000 requests per minute.

Headers

X-RateLimit-Limit
X-RateLimit-Remaining
22. Authentication

APIs must verify identity.

Common methods:

API Keys
JWT tokens
OAuth2

API Key

Simple key in header.

x-api-key: abc123
JWT

JSON Web Tokens.

Stateless authentication.

Contains:

user id
permissions
expiration

OAuth2

Used for delegated access.

Example

Login with Google.

23. Authorization

Authorization determines permissions.

Example

User may

read orders
but not delete orders.

24. API Security

Important protections.

HTTPS only
Input validation
Rate limiting
Authentication tokens
Audit logging

25. API Gateway

Large systems use API gateways.

Responsibilities:

Authentication
Rate limiting
Routing
Logging

Example tools

Kong
AWS API Gateway
NGINX

26. Caching Strategies

API performance depends on caching.

Types

Client cache
CDN cache
Server cache

Headers

Cache-Control
ETag
Last-Modified
27. HATEOAS

Hypermedia as the Engine of Application State.

Response includes links to next actions.

Example

{
  "id": 10,
  "links": {
    "self": "/orders/10",
    "cancel": "/orders/10/cancel"
  }
}

Rarely used fully in modern APIs.

28. API Documentation

Good APIs require documentation.

Tools

OpenAPI (Swagger)
Postman collections
Redoc

29. API Observability

Production APIs must be monitored.

Metrics

Latency
Error rate
Request volume

Tools

Prometheus
Grafana
Datadog

30. API Performance Best Practices

Use pagination
Compress responses (gzip)
Use caching
Avoid large payloads
Use connection pooling

31. Common REST Anti Patterns

Using verbs in URLs
Ignoring HTTP status codes
Returning inconsistent error formats
No versioning
Overfetching data

32. Example REST API Design

User Service

Create user

POST /users

Get user

GET /users/42

Update user

PATCH /users/42

Delete user

DELETE /users/42

List users

GET /users?page=1&limit=20
33. Real Production Considerations

Senior engineers must handle:

Backward compatibility
API deprecation
Schema evolution
Traffic spikes
Rate limiting
Distributed tracing

34. Skills Expected from Senior Backend Engineers

Deep understanding of:

HTTP semantics
REST constraints
API versioning strategies
Security models
Performance optimization
API lifecycle management

35. Final Takeaway

Good API design is critical because APIs become long-term contracts between systems.

Once public APIs are deployed, changing them becomes extremely difficult.

Therefore design must prioritize:

Consistency
Stability
Clarity
Scalability


---
```
