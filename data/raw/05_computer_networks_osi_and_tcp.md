# Computer Networks: The OSI Model and TCP vs UDP

## The 7-Layer OSI Reference Model
The Open Systems Interconnection (OSI) model characterizes and standardizes the communication functions of a telecommunication or computing system without regard to its underlying internal structure.
The seven layers from bottom to top are:
1. **Physical Layer (Layer 1)**: Transmits raw unstructured bitstreams over a physical transmission medium (cables, radio waves).
2. **Data Link Layer (Layer 2)**: Handles node-to-node data transfer, framing, MAC addressing, and error detection (Ethernet, Wi-Fi).
3. **Network Layer (Layer 3)**: Routes packets across logical networks using IP addressing (IPv4, IPv6, ICMP).
4. **Transport Layer (Layer 4)**: Provides end-to-end communication, flow control, reliability, and port multiplexing (TCP, UDP).
5. **Session Layer (Layer 5)**: Manages communication sessions and connection dialogues between applications.
6. **Presentation Layer (Layer 6)**: Data formatting, serialization, encryption, and compression (TLS/SSL, JSON, JPEG).
7. **Application Layer (Layer 7)**: Closest to end users; network services for applications (HTTP, HTTPS, DNS, SMTP, SSH).

## TCP vs UDP Comparison
- **TCP (Transmission Control Protocol)**:
  - Connection-oriented protocol requiring a 3-way handshake (`SYN`, `SYN-ACK`, `ACK`).
  - Guarantees in-order delivery and reliability through acknowledgments and packet retransmission.
  - Used for web browsing (HTTP/HTTPS), file transfer (FTP), and email (SMTP).
- **UDP (User Datagram Protocol)**:
  - Connectionless, lightweight datagram protocol with minimal header overhead (8 bytes vs 20+ bytes).
  - Does not guarantee packet ordering or retransmission, minimizing latency.
  - Used for real-time video streaming, VoIP, online gaming, and DNS lookups.
