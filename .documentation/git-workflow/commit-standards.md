<!-- .documentation/git-workflow/commit-standards.md -->

### Commit Standards

Well-structured commits make history readable and facilitate automated tooling.

###### Commit Message Format

Follow conventional commits format:

```
type(scope): subject

body

footer
```

**Type**: One of
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (not affecting logic)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Build, dependencies, tooling
- `ci` - CI/CD configuration

**Scope**: Component or area affected (optional but recommended)
- `app` - Main app
- `transactions` - Transactions journey
- `transfer` - Transfer journey
- `auth` - Authentication
- `ui` - UI components

**Subject**: Short description (50 chars or less)
- Imperative mood ("add" not "added")
- No period at end
- Lowercase first letter

###### Examples

```
# ✅ Good examples

feat(transactions): add transaction filtering
fix(auth): refresh token on 401 response
docs(contributing): add commit standards
refactor(transfer): simplify form logic
perf(transactions): memoize filtered list
test(auth): add guard tests
chore(deps): update Angular to v20

# ❌ Bad examples

Added new feature                          # No type
feat: fix transaction page                 # Wrong type
feat(WF-2280): Update Documentation...    # JIRA issue not in subject
fixed stuff                                # Vague and lowercase type
```

###### Commit Body

For complex changes, include a body explaining why:

```
feat(transactions): add export to PDF

Implement PDF export functionality for transaction lists.
This allows users to download their transactions for offline access.

The implementation:
- Uses jsPDF for PDF generation
- Formats data into a table layout
- Includes headers with date range

Closes WF-2280
```

###### Commit Footer

Reference related issues and PRs:

```
Closes #123
Fixes WF-2280
Related to WF-2281
Co-authored-by: Jane Doe <jane@example.com>
```

###### Pre-commit Hooks

Use Husky to enforce standards:

```bash
# Will run before each commit
npm run pre-commit

# This runs:
# - Linting
# - Tests
# - Type checking
```

If hooks fail, fix issues before committing:

```bash
# Fix linting automatically
npm run lint -- --fix

# Then commit again
git add .
git commit -m "feat: your message"
```

###### Staging and Committing

Commit related changes together:

```bash
# ✅ Good - related changes in one commit
git add src/lib/transactions.service.ts
git add src/lib/transactions.component.ts
git commit -m "feat(transactions): add filtering"

# ✅ Also good - stage files with git add -p
git add -p
# Choose which hunks to stage

# ❌ Avoid - mixing unrelated changes
# Don't add auth changes and transaction changes in same commit
```

###### Amending Commits

Fix the last commit (if not pushed yet):

```bash
# Make changes
git add .

# Amend previous commit (keeps same message)
git commit --amend --no-edit

# Or edit the message
git commit --amend

# If already pushed, force push (use carefully!)
git push origin feat/WF-2280-description --force-with-lease
```

###### Interactive Rebase

Clean up commits before pushing:

```bash
# Start interactive rebase of last 3 commits
git rebase -i HEAD~3

# Choose actions:
# pick - use commit
# reword - use but edit message
# squash - combine with previous
# fixup - combine and discard message
```

Example:

```
pick b4d5e12 feat: add feature
fixup a3c1f78 fix: typo in feature
pick 9e2k3l1 feat: add related feature
```

Result: Two commits instead of three, with the typo fix squashed into the main feature.

###### Checking Commit History

```bash
# View recent commits
git log --oneline -10

# View commits for a file
git log --oneline -- src/lib/transactions.service.ts

# View what changed in each commit
git log -p -5

# View graphical history
git log --graph --oneline --decorate
```

###### Push Strategy

Push regularly to avoid large changesets:

```bash
# After each logical feature
git push origin feat/WF-2280-description

# Or multiple times a day
git add .
git commit -m "feat: checkpoint 1"
git push origin feat/WF-2280-description

# Continue work
git add .
git commit -m "feat: checkpoint 2"
git push origin feat/WF-2280-description
```

###### Reverting Commits

If you need to undo a commit:

```bash
# View commit hash
git log --oneline

# Revert (creates new commit)
git revert <commit-hash>

# Or reset (removes commit locally)
git reset --soft <commit-hash>  # Keep changes
git reset --hard <commit-hash>  # Discard changes

# If already pushed, revert instead of reset
git revert <commit-hash>
git push origin feat/WF-2280-description
```

###### Common Commit Scenarios

**Multiple small fixes that should be one commit**:
```bash
# Make fixes
git add fix1.ts
git commit -m "WIP: fix 1"
git add fix2.ts
git commit -m "WIP: fix 2"

# Squash them
git rebase -i HEAD~2
# Change second 'pick' to 'squash'

# Rename
git commit --amend -m "fix(auth): multiple authentication issues"
```

**Oops, committed to wrong branch**:
```bash
# Check out correct branch
git checkout feat/WF-2280-description

# Cherry-pick the commit
git cherry-pick <commit-hash>

# Go back to wrong branch and undo
git checkout wrong-branch
git reset --hard HEAD~1
```

**Committing part of a file**:
```bash
# Interactive staging
git add -p

# Choose which hunks to stage
# Stage hunks you want, skip others

# Commit staged hunks
git commit -m "feat: add feature (partial)"

# Later, commit remaining hunks
git add -p
git commit -m "feat: add feature (part 2)"
```

