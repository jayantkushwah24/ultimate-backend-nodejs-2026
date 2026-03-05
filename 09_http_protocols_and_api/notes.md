# HTTP Protocol & API Design Deep Dive

## REST, GraphQL, gRPC, OData, SOAP

This document explains:

- HTTP protocol internals
- HTTP request/response structure
- HTTP methods and semantics
- Status codes
- Headers and caching
- Statelessness
- API design principles
- Major API paradigms used in industry:
  - REST
  - GraphQL
  - gRPC
  - SOAP
  - OData

---

# 1. What is HTTP?

HTTP (Hypertext Transfer Protocol) is an **application-layer protocol** used for communication between clients and servers on the web.

It follows a **request-response model**.

Client → HTTP Request → Server
Server → HTTP Response → Client

HTTP runs on top of **TCP**.

Typical ports:

HTTP → 80
HTTPS → 443

HTTPS = HTTP + TLS encryption.

---

# 2. HTTP Architecture

HTTP is designed with the following principles:

### 1. Stateless

Each request is independent.

Server does not remember previous requests.

State management handled using:

- Cookies
- Sessions
- JWT tokens

---

### 2. Client-Server Model

Browser / Mobile App
↓
HTTP API
↓
Server

Separation allows independent scaling.

---

### 3. Layered System

HTTP can go through:

Client
↓
CDN
↓
Reverse Proxy
↓
Load Balancer
↓
Application Server

---

# 3. HTTP Request Structure

An HTTP request consists of:

Request Line
Headers
Empty Line
Body (optional)

Example:

POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer token

{
"name": "Alice"
}

---

## Request Components

### 1. Request Line

METHOD PATH VERSION

Example:

GET /users/123 HTTP/1.1

---

### 2. Headers

Metadata about request.

Examples:

Authorization
Content-Type
Accept
User-Agent
Cache-Control

---

### 3. Body

Contains data sent to server.

Common formats:

- JSON
- XML
- Form-data
- Binary

---

# 4. HTTP Response Structure

Status Line
Headers
Empty Line
Body

Example:

HTTP/1.1 200 OK
Content-Type: application/json

{
"id": 123,
"name": "Alice"
}

---

# 5. HTTP Methods (Verbs)

Methods define the action.

| Method  | Purpose             |
| ------- | ------------------- |
| GET     | Retrieve data       |
| POST    | Create resource     |
| PUT     | Replace resource    |
| PATCH   | Partial update      |
| DELETE  | Remove resource     |
| HEAD    | Metadata only       |
| OPTIONS | Server capabilities |

---

## Method Semantics

### Safe Methods

Do not modify server state.

GET
HEAD
OPTIONS

### Idempotent Methods

Multiple identical requests produce same result.

PUT
DELETE
GET

---

# 6. HTTP Status Codes

### 1xx Informational

100 Continue

### 2xx Success

200 OK
201 Created
204 No Content

### 3xx Redirection

301 Moved Permanently
302 Found
304 Not Modified

### 4xx Client Error

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict

### 5xx Server Error

500 Internal Server Error
502 Bad Gateway
503 Service Unavailable

---

# 7. Important HTTP Headers

## Request Headers

Authorization
Content-Type
Accept
User-Agent

---

## Response Headers

Content-Type
Cache-Control
Set-Cookie
ETag

---

# 8. HTTP Caching

Caching improves performance.

Cache-Control
ETag
Last-Modified

Flow:

Client → Request
Server → Response + ETag

Next request:
Client → If-None-Match
Server → 304 Not Modified

---

# 9. API (Application Programming Interface)

An API allows applications to communicate.

In web systems:

Frontend → HTTP API → Backend

API defines:

- Endpoints
- Data format
- Authentication
- Error handling

---

# 10. REST API

REST = Representational State Transfer.

Architectural style for web APIs.

---

## REST Principles

1. Stateless
2. Resource-based
3. Standard HTTP methods
4. Uniform interface

---

## Resource Example

/users
/users/123
/users/123/orders

---

## REST Example

GET /users
POST /users
GET /users/123
PATCH /users/123
DELETE /users/123

---

## Advantages

- Simple
- Widely supported
- Cache-friendly
- Human-readable

---

## Limitations

- Over-fetching
- Under-fetching
- Multiple requests needed

---

# 11. GraphQL

GraphQL is a **query language for APIs**.

Developed by Facebook.

---

## Key Idea

Client specifies exactly what data it needs.

Example:

query {
user(id: 1) {
name
email
}
}

Response:

{
"data": {
"user": {
"name": "Alice",
"email": "alice@mail.com
"
}
}
}

---

## Benefits

- No over-fetching
- Single endpoint
- Flexible queries

---

## Limitations

- Complex caching
- Query complexity attacks
- Requires schema management

---

# 12. gRPC

gRPC is a **high-performance RPC framework** developed by Google.

Uses:

HTTP/2
Protocol Buffers

---

## How gRPC Works

Client calls remote function.

service UserService {
rpc GetUser(UserRequest) returns (UserResponse);
}

---

## Advantages

- Binary protocol (fast)
- Strong typing
- Streaming support

---

## Limitations

- Harder debugging
- Browser support limited
- Requires code generation

---

# 13. SOAP

SOAP = Simple Object Access Protocol.

Older enterprise protocol.

Uses:

XML
WS-\* standards

Example request:

soap:Envelope

soap:Body

<GetUser>
<id>123</id>
</GetUser>
</soap:Body>
</soap:Envelope>

---

## Advantages

- Strong security standards
- Strict contract (WSDL)

---

## Limitations

- Heavy XML
- Complex
- Slower than REST

---

# 14. OData

OData = Open Data Protocol.

Standardized REST-like protocol.

Supports querying directly via URL.

Example:

/users?$filter=age gt 25

Supports:

$filter
$select
$expand
$orderBy

Used heavily in enterprise systems.

---

# 15. Comparison of API Styles

| Feature          | REST   | GraphQL | gRPC      | SOAP | OData    |
| ---------------- | ------ | ------- | --------- | ---- | -------- |
| Transport        | HTTP   | HTTP    | HTTP/2    | HTTP | HTTP     |
| Data Format      | JSON   | JSON    | Protobuf  | XML  | JSON/XML |
| Flexibility      | Medium | High    | Medium    | Low  | Medium   |
| Performance      | Good   | Good    | Very High | Low  | Good     |
| Browser Friendly | Yes    | Yes     | Limited   | Yes  | Yes      |
| Complexity       | Low    | Medium  | High      | High | Medium   |

---

# 16. When to Use Each

### REST

General-purpose APIs.

### GraphQL

Complex frontend data needs.

### gRPC

Microservices internal communication.

### SOAP

Legacy enterprise systems.

### OData

Enterprise data querying.

---

# 17. Industry API Architecture

Typical stack:

Client
↓
API Gateway
↓
Authentication
↓
Controller
↓
Service Layer
↓
Database

---

# 18. API Security

Common mechanisms:

API Keys
OAuth2
JWT
Mutual TLS
Rate Limiting

---

# 19. API Versioning

Strategies:

URL versioning
/v1/users
/v2/users

Header versioning:

Accept: application/vnd.api.v2

---

# 20. Best Practices for API Design

- Use nouns not verbs
- Proper status codes
- Pagination for large data
- Rate limiting
- Idempotent operations
- Clear error responses

---

# Final Insight

HTTP is the foundation of the web.

Modern systems use APIs built on HTTP to connect:

Browsers
Mobile apps
Microservices
Third-party integrations

Choosing the right API style depends on:

- performance
- flexibility
- ecosystem
- complexity
