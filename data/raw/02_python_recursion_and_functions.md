# Python Functions and Recursion

## Defining and Calling Functions
A function is a reusable block of code that executes only when called. In Python, functions are defined using the `def` keyword, followed by the function name, parentheses for parameters, and a colon.
Functions can take arguments and return values using the `return` statement. If no return statement is executed, the function returns `None`.

```python
def calculate_area(length: float, width: float) -> float:
    """Calculate the area of a rectangle."""
    return length * width
```

## Introduction to Recursion
Recursion is a programming technique in which a function calls itself directly or indirectly to solve a smaller instance of the same problem. 
Every valid recursive function must have two fundamental components:
1. **Base Case**: A terminating condition that returns a value without making further recursive calls, preventing infinite loops and stack overflow.
2. **Recursive Case**: The logic that reduces the problem size and invokes the function again toward the base case.

## Example: Factorial and Fibonacci
Factorial of a non-negative integer $n$ ($n!$) is the product of all positive integers less than or equal to $n$.
Base case: $0! = 1$.
Recursive case: $n! = n \times (n-1)!$.

```python
def factorial(n: int) -> int:
    # Base Case
    if n <= 1:
        return 1
    # Recursive Case
    return n * factorial(n - 1)
```

## Recursion vs Iteration
While recursion offers concise, mathematically elegant solutions for tree traversal, divide-and-conquer algorithms, and combinatorial problems, it incurs call stack overhead ($O(n)$ stack frames). Iteration uses explicit loops and constant memory overhead ($O(1)$ extra space) when call stacks are a constraint.
