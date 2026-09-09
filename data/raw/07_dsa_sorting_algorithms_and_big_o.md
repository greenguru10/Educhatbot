# Sorting Algorithms, Divide-and-Conquer, and Asymptotic Big-O Analysis

## Asymptotic Notation Definitions
- **Big-O ($O$)**: Mathematical upper bound representing worst-case asymptotic growth rate.
- **Big-Omega ($\Omega$)**: Mathematical lower bound representing best-case performance.
- **Big-Theta ($\Theta$)**: Asymptotically tight bound where $f(n)$ is bounded above and below by $c_1 g(n) \le f(n) \le c_2 g(n)$.

## Core Sorting Algorithms Comparison

| Algorithm | Best Time | Average Time | Worst Time | Space Complexity | Stability | Method |
|---|---|---|---|---|---|---|
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | Stable | Divide and Conquer |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Unstable | Partitioning around pivot |
| **Heap Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | Unstable | Max-heap tree structure |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Stable | Incremental insertion |

## Merge Sort Implementation Principle
Merge sort splits the input list recursively into halves until single-element sub-arrays remain, then merges adjacent sorted lists using a linear two-pointer pass.

```python
def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i])
            i += 1
        else:
            res.append(right[j])
            j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res
```
