# Operating Systems: Processes, Threads, Concurrency, and Memory

## Processes vs Threads
- **Process**: An executing program with its own independent virtual address space (code, data, heap, stack, file descriptors). Processes are isolated by the OS kernel for safety.
- **Thread**: A lightweight unit of execution within a process sharing the same address space, heap, and open files, but possessing its own program counter, registers, and private stack.

## Concurrency, Race Conditions, and Synchronization
When multiple threads read and write shared data concurrently without synchronization, **race conditions** occur, leading to non-deterministic corrupt states.

### Synchronization Primitives
1. **Mutex (Mutual Exclusion Lock)**: Only one thread can acquire the lock at a time (`lock()` / `unlock()`), protecting critical sections.
2. **Semaphore**: A counter signaling resource availability. A binary semaphore acts like a mutex; a counting semaphore limits access to $N$ resources.
3. **Deadlock**: A state where two or more threads are permanently blocked waiting for resources held by each other. Occurs when four Coffman conditions hold:
   - Mutual Exclusion
   - Hold and Wait
   - No Preemption
   - Circular Wait

## Virtual Memory and Paging
Virtual memory decouples the programmer's logical address space from physical RAM:
- **Paging**: Memory is divided into fixed-size blocks called pages (typically 4 KB).
- **Page Fault**: Occurs when a referenced page is not present in physical RAM, prompting the OS to fetch it from disk swap space via algorithms like LRU (Least Recently Used).
- **TLB (Translation Lookaside Buffer)**: High-speed hardware cache storing recent virtual-to-physical address mappings.
