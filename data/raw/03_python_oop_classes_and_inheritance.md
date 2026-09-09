# Object-Oriented Programming (OOP) in Python

## Classes and Encapsulation
Object-Oriented Programming models real-world systems as interacting objects possessing state (attributes) and behavior (methods).
The `__init__` method initializes newly created instance objects. Private attributes use leading double underscores (e.g. `__balance`) to trigger name mangling.

```python
class BankAccount:
    def __init__(self, account_holder: str, initial_balance: float = 0.0):
        self.holder = account_holder
        self.__balance = initial_balance

    def deposit(self, amount: float) -> None:
        if amount > 0:
            self.__balance += amount

    def get_balance(self) -> float:
        return self.__balance
```

## Inheritance, Polymorphism, and Abstract Base Classes
- **Inheritance**: Subclasses inherit attributes and methods from base classes using `class Child(Parent):` and invoke superclass methods via `super()`.
- **Polymorphism**: Different classes can implement methods with identical names, enabling uniform client interactions.
- **Abstract Base Classes (ABCs)**: The `abc` module enforces method implementation in derived classes via `@abstractmethod`.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        import math
        return math.pi * (self.radius ** 2)
```
