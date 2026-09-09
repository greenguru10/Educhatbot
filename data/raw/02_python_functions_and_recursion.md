# Python Functions, Recursion, and Call Stacks

## Functions and Scope Rules
Functions encapsulate reusable logic and adhere to the LEGB rule for variable resolution: Local, Enclosing, Global, Built-in. Parameters can be positional, keyword, default (`param=val`), or variable length (`*args`, `**kwargs`).

```python
def calculate_discount(price: float, rate: float = 0.1) -> float:
    """Calculate discounted total price with default 10% rate."""
    return price * (1.0 - rate)
```

## Principles of Recursion
Recursion occurs when a function invokes itself directly or indirectly to solve a smaller instance of a problem:
1. **Base Case**: The stopping criteria that returns an immediate value without further function calls.
2. **Recursive Step**: The reductive logic that transforms the input toward the base case.

```python
def fibonacci(n: int) -> int:
    """Compute n-th Fibonacci number recursively."""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
```

## Call Stack Overhead and Memoization
Each recursive call adds a stack frame containing local variables and return addresses. Python defaults to a recursion limit of 1000 frames to protect against stack overflows. Memoization via `@functools.lru_cache` transforms naive $O(2^n)$ recursive Fibonacci calculations into linear $O(n)$ time by caching subproblem returns.
