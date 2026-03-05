HTTP/1.1 vs HTTP/2 vs HTTP/3 — Short Technical Notes

1. HTTP/1.1 (1997)
   Core Characteristics

Text-based protocol.

One request–response per TCP connection (initially).

Later added persistent connections (keep-alive).

Key Features

Persistent TCP connections

Chunked transfer encoding

Request pipelining (rarely used due to issues)

Major Problems

Head-of-Line Blocking (HOL)
If multiple requests are pipelined and one response is slow, the rest wait.

Multiple TCP Connections
Browsers open ~6 connections per domain to parallelize requests.

Example:

Browser → Server
Connection 1 → CSS
Connection 2 → JS
Connection 3 → Image
Connection 4 → Font
Connection 5 → API
Connection 6 → Video
Performance Limitations

TCP handshake per connection

Redundant headers

Inefficient multiplexing

Typical Optimization Techniques

Used by engineers to mitigate limitations:

Domain sharding

Image sprites

CSS/JS bundling

Minification

2. HTTP/2 (2015)

HTTP/2 was designed to fix HTTP/1.1 performance bottlenecks while keeping the same semantics.

Key Architectural Changes

1. Binary Protocol

HTTP/2 converts HTTP messages into binary frames.

Example frame types:

HEADERS
DATA
SETTINGS
WINDOW_UPDATE
RST_STREAM

Binary framing makes parsing faster and more structured.

2. Multiplexing

Multiple requests share one TCP connection.

TCP Connection
├─ Stream 1 → HTML
├─ Stream 3 → CSS
├─ Stream 5 → JS
├─ Stream 7 → Image

Requests and responses can interleave.

Result:

Fewer connections

Lower latency

3. Header Compression (HPACK)

HTTP headers are large and repetitive.

Example:

User-Agent
Cookie
Accept-Encoding
Authorization

HTTP/2 uses HPACK compression to reduce bandwidth.

4. Stream Prioritization

Client can assign priority.

Example:

HTML → High priority
CSS → High priority
Images → Low priority

Server sends critical resources first.

5. Server Push

Server can push resources proactively.

Example:

Client requests:

GET /index.html

Server pushes:

index.html
style.css
app.js

Problem: Often misused → modern browsers reduced support.

Limitation of HTTP/2

Despite improvements, HTTP/2 still uses TCP.

So TCP Head-of-Line Blocking still exists.

Example:

Packet loss → entire TCP stream stalls

Even if other streams are fine.

3. HTTP/3 (2022)

HTTP/3 replaces TCP with QUIC, a protocol built on UDP.

Major shift in transport layer.

QUIC Protocol

QUIC = Quick UDP Internet Connections

Runs over UDP instead of TCP.

Advantages:

Faster connection setup

Reduced latency

Stream-level independence

Key Features

1. No TCP Head-of-Line Blocking

In HTTP/3:

Stream 1 → blocked
Stream 2 → continues
Stream 3 → continues

Packet loss only affects the specific stream.

2. Faster Handshake

HTTP/1.1 / HTTP/2:

TCP Handshake
TLS Handshake
HTTP Request

HTTP/3:

QUIC Handshake + TLS combined

Even 0-RTT resumption is possible.

Meaning:

Client can send request immediately.

3. Built-in Encryption

QUIC integrates TLS 1.3.

Encryption is mandatory in HTTP/3.

4. Connection Migration

If network changes:

Example:

WiFi → Mobile Data

HTTP/1.1 or HTTP/2:

Connection breaks

HTTP/3:

Connection continues

Because QUIC identifies connection by Connection ID, not IP.

Comparison Table
Feature HTTP/1.1 HTTP/2 HTTP/3
Protocol Type Text Binary Binary
Transport TCP TCP UDP (QUIC)
Multiplexing No Yes Yes
Header Compression No HPACK QPACK
Head-of-Line Blocking Yes Yes (TCP level) No
Server Push No Yes Yes
Encryption Optional Optional Mandatory
Connection Setup Slow Faster Fastest
Simple Visualization
HTTP/1.1
Browser
│
├── TCP Conn 1 → Request → Response
├── TCP Conn 2 → Request → Response
├── TCP Conn 3 → Request → Response
└── TCP Conn 4 → Request → Response
HTTP/2
Single TCP Connection
│
┌────┼────┐
Stream1 Stream2 Stream3 Stream4

But TCP packet loss blocks everything.

HTTP/3
Single QUIC Connection
│
┌────┼────┐
Stream1 Stream2 Stream3 Stream4

Packet loss affects only one stream
Real-World Adoption

Most major services now support HTTP/2 and HTTP/3:

Google

Cloudflare

Facebook

Netflix

YouTube

AWS CloudFront

Browsers supporting HTTP/3:

Chrome

Firefox

Edge

Safari

Quick Interview Summary

HTTP/1.1

Text protocol

Multiple TCP connections

Head-of-line blocking

HTTP/2

Binary protocol

Multiplexing

Header compression

Still suffers TCP HOL blocking

HTTP/3

Uses QUIC over UDP

Eliminates TCP HOL blocking

Faster handshake

Built-in TLS

One-Line Interview Answer

HTTP/1.1 uses multiple TCP connections with head-of-line blocking.
HTTP/2 introduces multiplexing over a single TCP connection but still suffers from TCP-level blocking.
HTTP/3 replaces TCP with QUIC over UDP, eliminating head-of-line blocking and significantly reducing latency.
