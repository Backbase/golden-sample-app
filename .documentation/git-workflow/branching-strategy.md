<!-- .documentation/git-workflow/branching-strategy.md -->

### Branching Strategy

This project uses a feature branch workflow with a main branch for production-ready code.

###### Main Branches

**main**
- Production-ready code
- Deployable at any time
- Protected - requires code review
- Tagged with semantic versions

**develop** (if applicable)
- Integration branch for features
- May be less stable than main
- Features merge here before main

###### Feature Branches

Create feature branches from `main`:

```bash
# Create and switch to feature branch
git checkout -b feat/WF-2280-add-new-feature

# Or with main as base
git checkout main
git pull origin main
git checkout -b feat/WF-2280-add-new-feature

# Push to remote
git push origin feat/WF-2280-add-new-feature
```

###### Branch Naming Convention

Follow this naming pattern:

```
feat/JIRA-XXXX-description
fix/JIRA-XXXX-description
chore/JIRA-XXXX-description
docs/JIRA-XXXX-description
refactor/JIRA-XXXX-description
test/JIRA-XXXX-description
```

Examples:
- `feat/WF-2280-update-documentation-after-refactoring`
- `fix/WF-2281-authentication-token-refresh`
- `docs/WF-2282-add-typescript-guidelines`
- `refactor/WF-2283-simplify-journey-logic`

###### Branch Lifecycle

1. **Create**: Branch off from `main`
2. **Develop**: Make commits regularly
3. **Test**: Run tests locally
4. **Push**: Push branch to remote
5. **Review**: Create Pull Request
6. **Merge**: After approval, merge to main
7. **Clean up**: Delete merged branch

```bash
# Create and develop
git checkout -b feat/WF-2280-description
git add .
git commit -m "feat: add new feature"
git push origin feat/WF-2280-description

# After PR is merged
git checkout main
git pull origin main
git branch -D feat/WF-2280-description
git push origin --delete feat/WF-2280-description
```

###### Keeping Branch Updated

Before creating PR, sync with main:

```bash
# Fetch latest from remote
git fetch origin

# Rebase on main (preferred)
git rebase origin/main

# Or merge main (if team prefers)
git merge origin/main

# Push updates
git push origin feat/WF-2280-description -f  # -f if rebased
```

###### Branch Protection Rules

The `main` branch should be protected with:
- ✅ Require pull request reviews before merging
- ✅ Require status checks to pass (CI/CD)
- ✅ Require branches to be up to date before merging
- ✅ Dismiss stale pull request approvals
- ✅ Require code reviews from CODEOWNERS

###### Handling Merge Conflicts

If your branch has conflicts with main:

```bash
# Option 1: Rebase (cleaner history)
git fetch origin
git rebase origin/main

# Resolve conflicts in your editor, then:
git add .
git rebase --continue

# Or abort if you change your mind
git rebase --abort

# Option 2: Merge (keeps history)
git fetch origin
git merge origin/main

# Resolve conflicts, then:
git add .
git commit -m "Merge main into feature branch"

# Push the merge commit
git push origin feat/WF-2280-description
```

###### Working with Multiple Feature Branches

If working on multiple features:

```bash
# List all branches
git branch -a

# Switch between branches
git checkout feat/WF-2280-feature1
git checkout feat/WF-2281-feature2

# Stash uncommitted changes to switch branches
git stash
git checkout feat/WF-2281-feature2
git stash pop  # Get changes back

# Or commit them
git add .
git commit -m "WIP: work in progress"
```

###### Syncing Fork (if applicable)

If working with a fork:

```bash
# Add upstream remote
git remote add upstream https://github.com/Backbase/golden-sample-app.git

# Fetch upstream changes
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# Push to your fork
git push origin feat/WF-2280-description
```

