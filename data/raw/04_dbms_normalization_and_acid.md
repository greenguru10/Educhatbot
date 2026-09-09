# Database Management Systems: Normalization and ACID

## Database Normalization
Database normalization is the process of structuring a relational database in accordance with normal forms to reduce data redundancy and improve data integrity.

### First Normal Form (1NF)
A table is in 1NF if:
1. Every attribute contains only atomic (indivisible) values.
2. Each record is unique and there are no repeating groups or arrays within columns.

### Second Normal Form (2NF)
A table is in 2NF if:
1. It is in 1NF.
2. All non-key attributes are fully functionally dependent on the entire primary key (no partial dependency on composite keys).

### Third Normal Form (3NF)
A table is in 3NF if:
1. It is in 2NF.
2. There are no transitive dependencies (non-key columns do not depend on other non-key columns).

## ACID Properties of Transactions
In database systems, a transaction is a sequence of operations performed as a single logical unit of work. To guarantee database reliability, transactions must adhere to ACID properties:
- **Atomicity**: All changes in a transaction are executed completely, or none are (all-or-nothing).
- **Consistency**: A transaction brings the database from one valid state to another, maintaining all schema constraints and invariants.
- **Isolation**: Concurrent transactions execute independently without interfering with each other.
- **Durability**: Once a transaction commits, its changes survive system crashes and power failures.
