# Database Indexing, B-Trees, and Query Optimization

## Indexing Fundamentals
A database index is an auxiliary data structure that improves the speed of data retrieval operations on a table at the cost of additional storage and slower write operations (`INSERT`, `UPDATE`, `DELETE`).

## B-Tree and B+ Tree Data Structures
Relational databases (PostgreSQL, MySQL, Oracle) use B+ Trees for primary and secondary clustered/non-clustered indexes:
- **High Fan-out**: Nodes contain multiple keys and child pointers, minimizing disk I/O operations.
- **Balanced Depth**: Every leaf node resides at identical tree depth, guaranteeing $O(\log n)$ search, insert, and delete.
- **Linked Leaf Nodes**: All records reside exclusively in leaf nodes linked horizontally as a doubly linked list, enabling rapid range scans (`BETWEEN`, `>`, `<`).

## Clustered vs Non-Clustered Indexes
- **Clustered Index**: Determines the physical storage order of rows in the table (one per table, usually Primary Key).
- **Non-Clustered Index**: Creates a separate lookup structure containing the index key and a row pointer (TID / Primary Key) pointing to the actual data row.

## Query Optimization and EXPLAIN ANALYZE
The SQL Query Optimizer parses the relational algebra tree, evaluates cost estimates based on catalog table statistics, and selects the most efficient execution plan:
- **Sequential Scan (Seq Scan)**: Scans every table page when filtering across unindexed columns or large percentage of rows.
- **Index Scan / Bitmap Index Scan**: Traverses B+ Tree to retrieve target tuples efficiently.
