# JavaScript & TypeScript: ES6+, Async/Await, and Type Systems

## Modern JavaScript (ES6+) Features
- **Arrow Functions**: Compact lexical `this` binding: `const add = (a, b) => a + b;`
- **Destructuring**: Extract properties from arrays and objects cleanly: `const { name, age } = user;`
- **Spread & Rest Operators (`...`)**: Clone or aggregate elements: `const merged = [...arr1, ...arr2];`
- **Promises & `async/await`**: Clean asynchronous execution over callback hell:

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`https://api.example.com/users/${userId}`);
    if (!response.ok) throw new Error("Network response failed");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
```

## TypeScript: Static Typing and Interfaces
TypeScript adds static type definitions on top of JavaScript, catching errors at compile time before deployment:
- **Primitive Types**: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`.
- **Interfaces & Type Aliases**:

```typescript
interface UserProfile {
  id: string;
  name: string;
  email?: string; // Optional field
  role: 'admin' | 'student' | 'educator'; // Union type
  createdAt: Date;
}

type MathOperation = (a: number, b: number) => number;
const multiply: MathOperation = (x, y) => x * y;
```

- **Generics**: Reusable components across varying types: `function identity<T>(arg: T): T { return arg; }`
