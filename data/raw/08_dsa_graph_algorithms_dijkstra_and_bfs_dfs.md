# Graph Algorithms: BFS, DFS, Dijkstra, and Minimum Spanning Trees

## Graph Representations
Graphs consist of vertices $V$ and edges $E$.
- **Adjacency Matrix**: A 2D grid $V \times V$ allowing $O(1)$ edge existence checks with $O(V^2)$ space complexity.
- **Adjacency List**: A collection of lists where each vertex stores its neighbors. Space complexity is $O(V + E)$, optimal for sparse real-world graphs.

## Breadth-First Search (BFS) vs Depth-First Search (DFS)
- **Breadth-First Search (BFS)**: Uses a FIFO queue to explore nodes layer by layer. Finds the shortest path in unweighted graphs. Time complexity: $O(V + E)$.
- **Depth-First Search (DFS)**: Uses a LIFO call stack or recursion to explore deeply down a path before backtracking. Applications: cycle detection, topological sorting, connected components. Time complexity: $O(V + E)$.

## Dijkstra’s Single-Source Shortest Path Algorithm
Dijkstra’s algorithm computes the shortest path from a start vertex to all other vertices in a directed or undirected graph with non-negative edge weights.
Using a Min-Heap (priority queue), Dijkstra runs in $O((V + E) \log V)$ time by greedily relaxing the shortest tentative distance at each step.

## Minimum Spanning Trees (MST)
An MST connects all vertices in a weighted undirected graph with $V - 1$ edges minimizing the total edge weight sum without creating cycles.
- **Kruskal's Algorithm**: Greedily adds smallest weight edges using a Disjoint Set Union (Union-Find) data structure ($O(E \log E)$).
- **Prim's Algorithm**: Grows an MST from an arbitrary starting vertex using a priority queue ($O((V + E) \log V)$).
