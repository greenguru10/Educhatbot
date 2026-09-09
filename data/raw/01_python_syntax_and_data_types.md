# Python Syntax, Variables, and Built-in Data Structures

## Language Overview and Design Philosophy
Python is a high-level, dynamically-typed programming language emphasizing code readability with its clean syntax and significant whitespace. Python uses an automated garbage collector with reference counting and cyclic generational collection to manage memory efficiently.

## Variables and Memory Model
In Python, variables are references to objects in memory rather than direct memory slots:
- **Integers (`int`)**: Arbitrary-precision whole numbers.
- **Floats (`float`)**: 64-bit double-precision IEEE 754 floating-point numbers.
- **Booleans (`bool`)**: Subclass of integer representing `True` (1) or `False` (0).
- **Strings (`str`)**: Immutable sequences of Unicode characters with support for formatted string literals (f-strings).

```python
# Variables and f-strings example
course_name = "Data Structures"
student_count = 120
is_active = True
print(f"Course: {course_name}, Enrolled: {student_count}, Active: {is_active}")
```

## Fundamental Data Structures
1. **Lists (`list`)**: Ordered, mutable arrays providing $O(1)$ amortized append and $O(1)$ index access.
2. **Tuples (`tuple`)**: Ordered, immutable sequences providing safety and hashability for dictionary keys.
3. **Dictionaries (`dict`)**: Key-value mappings implemented as compact hash tables with average $O(1)$ lookup and insertion.
4. **Sets (`set`)**: Unordered collections of unique hashable elements providing $O(1)$ membership testing (`in`).

```python
# Dictionary and Set operations
student_grades = {"Alice": 95, "Bob": 88, "Charlie": 92}
unique_subjects = {"Python", "DSA", "DBMS", "Python"}
print(f"Unique Count: {len(unique_subjects)}")  # Output: 3
```
