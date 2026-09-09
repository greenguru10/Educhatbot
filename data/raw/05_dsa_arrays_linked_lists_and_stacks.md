# Data Structures: Arrays, Linked Lists, Stacks, and Queues

## Dynamic Arrays vs Singly Linked Lists
- **Arrays**: Contiguous memory blocks with $O(1)$ random index access but $O(n)$ worst-case insertion and deletion due to element shifting.
- **Singly Linked Lists**: Non-contiguous nodes where each node stores data and a reference (`next`) to the subsequent node. Insertions and deletions at known pointers take $O(1)$ time, while random lookups require $O(n)$ sequential traversal.

```python
class Node:
    def __init__(self, value: int):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, value: int) -> None:
        new_node = Node(value)
        new_node.next = self.head
        self.head = new_node
```

## Stacks (LIFO) and Queues (FIFO)
- **Stack (Last-In, First-Out)**: Supports `push`, `pop`, and `peek` in $O(1)$ time. Applications include expression evaluation (reverse Polish notation), syntax parsing, and browser back navigation.
- **Queue (First-In, First-Out)**: Supports `enqueue` and `dequeue` in $O(1)$ time. Implemented efficiently with `collections.deque` (double-ended queue) to avoid $O(n)$ list shift overhead. Applications include print spoolers, task scheduling, and Breadth-First Search (BFS).
