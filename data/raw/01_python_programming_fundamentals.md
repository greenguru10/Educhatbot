# Python Programming Fundamentals

## Overview of Python
Python is an interpreted, high-level, dynamically-typed programming language created by Guido van Rossum. It emphasizes code readability with its notable use of significant indentation and clean syntax.

## Variables and Dynamic Data Types
In Python, variables do not require explicit declaration to reserve memory space. The declaration happens automatically when you assign a value to a variable.
Python supports built-in fundamental data types:
- Integers (`int`): Whole numbers without fractions, e.g. `x = 42`.
- Floating-Point (`float`): Real numbers with decimals, e.g. `pi = 3.14159`.
- Strings (`str`): Ordered sequences of characters, enclosed in single or double quotes, e.g. `name = "Ada"`.
- Booleans (`bool`): Truth values representing `True` or `False`.

## Control Flow: Conditionals and Loops
Python provides standard control flow constructs:
1. `if`, `elif`, `else` statements for branching logic based on boolean expressions.
2. `for` loops for iterating over iterable collections such as lists, tuples, and ranges.
3. `while` loops for executing a block of statements repeatedly as long as a condition evaluates to `True`.

```python
# Iterating with for loop
for i in range(5):
    print(f"Index: {i}")
```

## Lists, Tuples, and Dictionaries
Python offers powerful built-in collection structures:
- **Lists**: Ordered, mutable collections defined with square brackets `[1, 2, 3]`.
- **Tuples**: Ordered, immutable sequences defined with parentheses `(1, 2, 3)`.
- **Dictionaries**: Unordered or insertion-ordered collections of key-value pairs defined with curly braces `{"key": "value"}` providing O(1) average lookup time.
