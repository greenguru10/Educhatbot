# Data Structures and Algorithms: Binary Search and Trees

## Introduction to Binary Search
Binary search is an efficient divide-and-conquer search algorithm that finds the position of a target value within a sorted array.
Binary search compares the target value to the middle element of the array:
- If the target matches the middle element, its index is returned.
- If the target is less than the middle element, the search continues in the left half.
- If the target is greater than the middle element, the search continues in the right half.

## Time and Space Complexity of Binary Search
- **Best Case Time Complexity**: $O(1)$ when the middle element is the target.
- **Average and Worst Case Time Complexity**: $O(\log n)$ because the search space is halved at each step.
- **Space Complexity**: $O(1)$ for iterative implementations and $O(\log n)$ for recursive implementations due to stack space.

## Binary Search Tree (BST) Properties
A Binary Search Tree is a hierarchical node-based binary tree data structure with the following invariant properties:
1. The left subtree of a node contains only nodes with keys less than the node's key.
2. The right subtree of a node contains only nodes with keys greater than the node's key.
3. Both the left and right subtrees must also be binary search trees.

Inorder traversal of a valid BST visits nodes in strictly ascending sorted order.
