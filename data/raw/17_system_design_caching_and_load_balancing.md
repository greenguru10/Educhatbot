# System Design: Caching, Load Balancing, Microservices, and Message Queues

## The High-Level Distributed Architecture
Modern high-scale web applications decouple monolithic codebases into distributed microservices to achieve high availability, fault tolerance, and independent team deployments.

```text
User Client -> CDN -> Load Balancer (Nginx/HAProxy) -> API Gateway -> Microservices -> In-Memory Cache (Redis) -> Primary Database (PostgreSQL) + Read Replicas
                                                                    -> Message Queue (Kafka/RabbitMQ) -> Background Workers
```

## 1. Load Balancing Strategies
Load balancers distribute incoming network traffic across multiple upstream application servers:
- **Round Robin**: Distributes requests sequentially.
- **Least Connections**: Forwards requests to the server with fewest active connections.
- **IP Hash / Consistent Hashing**: Routes requests deterministically based on client IP, useful for session stickiness or distributed cache rings.

## 2. Caching Strategies (Redis / Memcached)
- **Cache-Aside (Lazy Loading)**: Application queries cache first; on cache miss, reads from DB, writes to cache, and returns.
- **Write-Through**: Writes data to cache and DB simultaneously.
- **Write-Behind (Write-Back)**: Writes data to cache immediately; asynchronously flushes to DB in batches.
- **Eviction Policies**: LRU (Least Recently Used), LFU (Least Frequently Used), TTL (Time-To-Live expiration).

## 3. Asynchronous Messaging (Kafka & RabbitMQ)
Message queues decouple producer and consumer services, absorbing traffic spikes (rate leveling) and ensuring reliable background job processing.
