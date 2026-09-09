# Git Version Control: Branching, Merging, Rebase, and Workflows

## Core Git Architecture: Three States and Object Model
Git is a distributed version control system that stores snapshots of project states using cryptographic SHA-1 hashes:
1. **Working Directory**: Untracked or modified files on disk.
2. **Staging Area (Index)**: Files prepared for commit via `git add`.
3. **Repository (.git directory)**: Committed history containing commits, trees, and blobs.

## Essential Commands Cheatsheet

```bash
# Initialize and status
git init
git status
git diff

# Staging and committing
git add .
git commit -m "feat: implement hybrid search ranker"

# Branching and switching
git branch feature-rag-pipeline
git checkout -b feature-rag-pipeline
git switch -c feature-rag-pipeline

# Merging vs Rebasing
git merge main       # Creates a merge commit preserving exact history
git rebase main      # Re-applies commits on top of main for a linear history

# Undo and resets
git checkout -- <file>     # Discard uncommitted changes
git reset HEAD~1 --soft    # Undo last commit but keep changes staged
git stash / git stash pop  # Temporarily shelve uncommitted work
```
