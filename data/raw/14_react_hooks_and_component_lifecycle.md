# React 18 & 19: Functional Components, Hooks, and Lifecycle

## Modern Functional Components vs Class Components
In modern React, functional components are the standard. Functional components are plain JavaScript functions that accept `props` and return JSX. State and side effects are managed through the **React Hooks** API rather than class methods.

## Essential React Hooks Reference

| Hook | Purpose | Common Use Cases |
| :--- | :--- | :--- |
| `useState(initial)` | Manages local component state | Form inputs, toggle flags, counters |
| `useEffect(fn, [deps])` | Handles side effects & subscriptions | API data fetching, event listeners, timer intervals |
| `useContext(Context)` | Consumes shared context values | Theme toggles, auth state, localization without prop drilling |
| `useRef(initial)` | Persists mutable references / DOM nodes | Focus control, previous state, timer handles without re-renders |
| `useMemo(fn, [deps])` | Memoizes computationally heavy return values | Filtering/sorting large lists, complex mathematical calculations |
| `useCallback(fn, [deps])` | Memoizes function references | Passing callbacks to memoized child components (`React.memo`) |
| `useReducer(reducer, init)` | Dispatches actions for complex state transitions | Multi-step forms, shopping carts, centralized state machines |

## Component Lifecycle with `useEffect`
In functional components, `useEffect` consolidates the three lifecycle phases:
1. **Mounting**: Runs once after initial render when dependency array is empty `[]`:
```jsx
useEffect(() => {
  console.log("Component mounted");
}, []);
```
2. **Updating**: Runs when specified dependencies change `[dep1, dep2]`:
```jsx
useEffect(() => {
  console.log(`Query changed to ${query}`);
}, [query]);
```
3. **Unmounting & Cleanup**: Returned cleanup function fires before unmounting or re-running effect:
```jsx
useEffect(() => {
  const handler = () => console.log("Window resized");
  window.addEventListener("resize", handler);
  return () => window.removeEventListener("resize", handler);
}, []);
```

## Rules of Hooks
1. **Top-Level Calls Only**: Never call hooks inside conditional statements (`if`), loops (`for`), or nested functions.
2. **React Functions Only**: Call hooks only from React functional components or custom hooks (functions starting with `use...`).
