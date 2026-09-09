# Binary Search Trees (BST) and Self-Balancing AVL Trees

## Binary Search Tree Invariants
A Binary Search Tree satisfies the property that for every node $u$:
- All nodes in $u$'s left subtree have keys strictly less than $key(u)$.
- All nodes in $u$'s right subtree have keys strictly greater than $key(u)$.

### BST Operations and Time Complexity
- **Search, Insert, Delete**: Average case $O(\log n)$ when balanced; worst case $O(n)$ if degenerate (e.g. inserted in sorted order forming a linear linked chain).
- **Tree Traversals**:
  - **Inorder (Left, Root, Right)**: Visits keys in strictly sorted ascending order.
  - **Preorder (Root, Left, Right)**: Used for tree cloning and serialization.
  - **Postorder (Left, Right, Root)**: Used for bottom-up cleanup and size calculation.

## AVL Trees and Self-Balancing Rotations
An AVL Tree is a self-balancing binary search tree where the height difference (balance factor $BF = height(left) - height(right)$) of any node's subtrees is strictly $\{-1, 0, +1\}$.
When an insertion or deletion causes $|BF| > 1$, self-balancing tree rotations restore invariant properties in $O(1)$ time:
1. **Left-Left (LL) Heavy**: Solved with a single **Right Rotation**.
2. **Right-Right (RR) Heavy**: Solved with a single **Left Rotation**.
3. **Left-Right (LR) Heavy**: Solved with a **Left Rotation on Left Child** followed by a **Right Rotation on Node**.
4. **Right-Left (RL) Heavy**: Solved with a **Right Rotation on Right Child** followed by a **Left Rotation on Node**.

Guarantee: Search, Insertion, and Deletion are strictly bounded to $O(\log n)$ worst-case time complexity.
