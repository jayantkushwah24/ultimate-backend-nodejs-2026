# What Happens When You Type a URL in a Browser?

## Full Deep Dive — From Keyboard to Pixels

## With Detailed TCP/IP Model Breakdown

This document explains, step-by-step, what actually happens inside:

- Browser
- OS
- Network stack
- Internet
- Server
- Back to browser rendering

No fluff. Pure systems understanding.

---

# 0️⃣ High-Level Flow

User types URL
↓
Browser parses URL
↓
DNS resolution
↓
TCP connection (3-way handshake)
↓
TLS handshake (if HTTPS)
↓
HTTP request sent
↓
Server processes request
↓
HTTP response returned
↓
Browser parses & renders

---

# 1️⃣ URL Parsing

Example:

https://www.example.com:443/path?query=1

Browser extracts:

| Component       | Meaning      |
| --------------- | ------------ |
| https           | Protocol     |
| www.example.com | Host         |
| 443             | Port         |
| /path           | Resource     |
| ?query=1        | Query string |

If port not specified:

- HTTP → 80
- HTTPS → 443

---

# 2️⃣ Browser Cache Check

Before network:

- Service worker cache
- Memory cache
- Disk cache
- HTTP cache (ETag, Last-Modified)

If valid → return immediately.

If not → proceed to DNS.

---

# 3️⃣ DNS Resolution

Goal:
Convert domain name → IP address

---

## DNS Lookup Steps

1. Browser cache
2. OS cache
3. Router cache
4. ISP DNS
5. Root server
6. TLD server (.com)
7. Authoritative DNS server

Example:

www.example.com
→ 142.250.183.14

DNS uses:

- UDP (port 53)
- TCP (for large responses)

---

# 4️⃣ TCP/IP Model (Deep Understanding)

There are two models:

- OSI (7 layers)
- TCP/IP (4 layers)

We focus on TCP/IP.

---

# TCP/IP Model Layers

Application Layer
Transport Layer
Internet Layer
Network Access Layer

---

# 4.1️⃣ Application Layer

Protocols:

- HTTP / HTTPS
- DNS
- SMTP
- FTP

Browser constructs:

GET /path HTTP/1.1
Host: example.com
User-Agent: Chrome

This is pure text.

---

# 4.2️⃣ Transport Layer

Responsible for:

- End-to-end communication
- Port numbers
- Reliability
- Flow control
- Congestion control

Protocols:

- TCP
- UDP

For HTTPS:
→ TCP

---

## TCP 3-Way Handshake

Client → SYN →
Server → SYN-ACK →
Client → ACK →
Connection Established

Why?

To:

- Synchronize sequence numbers
- Establish reliable channel

---

## TCP Guarantees

- Ordered delivery
- No data loss
- Retransmission
- Congestion control (Cubic, Reno)
- Flow control (Window size)

---

## TCP Header Contains

- Source port
- Destination port
- Sequence number
- ACK number
- Flags (SYN, ACK, FIN, RST)
- Window size

---

# 4.3️⃣ TLS Handshake (HTTPS Only)

After TCP connection:

TLS negotiation:

1. ClientHello
2. ServerHello
3. Certificate exchange
4. Key exchange
5. Session keys derived

Now communication encrypted.

---

# 4.4️⃣ Internet Layer

Protocol:

- IP (IPv4 / IPv6)

Responsibilities:

- Logical addressing
- Routing

IP packet contains:

- Source IP
- Destination IP
- TTL
- Protocol (TCP=6, UDP=17)

Routers forward based on:
Routing tables + BGP

---

# 4.5️⃣ Network Access Layer

Physical transmission.

Includes:

- Ethernet
- WiFi
- MAC addressing
- ARP

---

## ARP (Address Resolution Protocol)

Goal:
Find MAC address from IP.

Who has 192.168.1.1?
Router replies with MAC address.

Now frame is sent to correct device.

---

# 5️⃣ Packet Journey

Your request is:

HTTP request
→ Wrapped in TCP segment
→ Wrapped in IP packet
→ Wrapped in Ethernet frame

Encapsulation:

[Ethernet][IP][TCP][HTTP Data]

Each router:

- Removes Ethernet
- Reads IP
- Forwards
- Re-wraps in new Ethernet

---

# 6️⃣ Server Side

At server:

1. NIC receives frame
2. Kernel network stack processes
3. TCP reassembles packets
4. TLS decrypts
5. Data passed to application

If using:

- Nginx → event-driven
- Apache → thread/process based
- Node.js → event loop + libuv

Server processes request:

- DB query
- Business logic
- Caching
- File read

Then sends response.

---

# 7️⃣ HTTP Response

Example:

HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1024

Response travels back same way.

---

# 8️⃣ Browser Rendering Pipeline

Now browser:

1. Parses HTML → DOM
2. Parses CSS → CSSOM
3. Combines → Render Tree
4. Layout (reflow)
5. Paint
6. Compositing (GPU)

JavaScript:

- Can block parsing
- Can modify DOM

---

# 9️⃣ Performance Optimizations

Modern browsers use:

- HTTP/2 (multiplexing)
- HTTP/3 (QUIC over UDP)
- Connection pooling
- DNS prefetch
- TCP fast open
- CDN edge servers

---

# 🔟 TCP vs UDP

| Feature  | TCP        | UDP       |
| -------- | ---------- | --------- |
| Reliable | Yes        | No        |
| Ordered  | Yes        | No        |
| Fast     | Slower     | Faster    |
| Used by  | HTTP/HTTPS | DNS, QUIC |

---

# 1️⃣1️⃣ What Makes It Slow?

- DNS lookup delay
- TCP handshake latency
- TLS negotiation
- Packet loss
- High RTT
- Server processing time
- Large JS bundles

---

# 1️⃣2️⃣ Advanced Concepts (Interview Level)

## Congestion Control

Prevents network collapse.

## Flow Control

Prevents receiver overload.

## Slow Start

TCP gradually increases transmission rate.

## Time To Live (TTL)

Prevents infinite routing loops.

## MTU

Maximum Transmission Unit.

## Fragmentation

If packet > MTU → split.

---

# 1️⃣3️⃣ HTTP Versions

HTTP/1.1

- One request per TCP connection (mostly)
- Head-of-line blocking

HTTP/2

- Multiplexing
- Single connection
- Binary framing

HTTP/3

- Built on QUIC (UDP)
- Faster handshake
- Better for lossy networks

---

# 1️⃣4️⃣ Complete Flow Summary

URL Typed
↓
Cache?
↓
DNS
↓
TCP Handshake
↓
TLS Handshake
↓
HTTP Request
↓
Server Processing
↓
HTTP Response
↓
Browser Rendering
↓
User Sees Page

---

# 1️⃣5️⃣ SDE-3 Interview Questions

### Q1: Why is TCP handshake needed?

To synchronize sequence numbers and establish reliable bi-directional channel.

### Q2: What happens if SYN is lost?

Client retransmits after timeout.

### Q3: Why is HTTP/3 faster?

Uses QUIC over UDP, reduces handshake latency, avoids head-of-line blocking.

### Q4: What happens if packet is larger than MTU?

IP fragmentation occurs or packet dropped if DF flag set.

### Q5: Where does TLS sit?

Above TCP, below HTTP.

---

# Final Understanding

When you type a URL:

You're triggering:

- DNS system
- Transport protocol
- Cryptography layer
- Routing system
- Server runtime
- Rendering engine

This is distributed systems + networking + OS + browser engine working together.

If you understand this fully,
you understand real backend fundamentals.
