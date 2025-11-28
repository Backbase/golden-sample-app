<!-- .documentation/git-workflow/code-review.md -->

### Code Review Process

Guidelines for reviewing and approving code changes.

###### Pull Request Workflow

**1. Create Pull Request**

```bash
# Push feature branch
git push origin feat/WF-2280-description

# Create PR on GitHub/GitLab with:
# - Clear title (same as commit subject)
# - Description of changes
# - Link to related issues/JIRA
# - Screenshot if UI changes
```

**2. PR Template**

Include this information:

```markdown
## Description
Brief description of the changes

## Related Issues
Closes #123
Related to WF-2280

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to verify the changes:
1. Run `npm start`
2. Navigate to /transactions
3. ...

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console errors
- [ ] Accessibility checked
- [ ] Performance impact assessed
```

**3. Code Review**

Reviewer should check:
- ✅ Code follows guidelines (see Best Practices)
- ✅ Tests are adequate
- ✅ No console errors or warnings
- ✅ Performance is acceptable
- ✅ Documentation is clear
- ✅ No breaking changes (or documented)
- ✅ Follows commit standards

**4. Approval and Merge**

```bash
# After approval, merge PR
git checkout main
git pull origin main
git merge origin/feat/WF-2280-description
git push origin main

# Or squash (cleaner history)
git merge --squash origin/feat/WF-2280-description
git commit -m "feat(transactions): add new feature"
git push origin main

# Delete branch
git branch -D feat/WF-2280-description
git push origin --delete feat/WF-2280-description
```

###### Review Checklist for Reviewers

**Code Quality**
- [ ] Code is clear and well-structured
- [ ] Variable names are descriptive
- [ ] Functions are small and focused
- [ ] Complex logic is commented
- [ ] No code duplication

**Best Practices**
- [ ] Uses correct patterns (standalone components, signals, etc.)
- [ ] OnPush change detection used
- [ ] Services provided correctly
- [ ] No memory leaks (unsubscribed from observables)
- [ ] Types are properly defined (no `any`)

**Testing**
- [ ] Unit tests added for new code
- [ ] Tests are meaningful (not just coverage)
- [ ] Edge cases are tested
- [ ] Tests pass locally

**Performance**
- [ ] No unnecessary re-renders
- [ ] Appropriate use of memoization (computed)
- [ ] No O(n²) algorithms
- [ ] Images are optimized

**Accessibility**
- [ ] ARIA labels where appropriate
- [ ] Keyboard navigation works
- [ ] Color contrast is adequate
- [ ] Focus indicators visible

**Documentation**
- [ ] README updated if relevant
- [ ] Inline comments explain complex logic
- [ ] Public APIs are documented
- [ ] Breaking changes documented

**Security**
- [ ] No hardcoded secrets
- [ ] Input is validated
- [ ] CSRF protection if needed
- [ ] XSS prevention (Angular template escaping)

###### Review Comments Best Practices

**Be Constructive**

❌ **Bad**: "This is wrong"
✅ **Good**: "This approach might have performance issues. Consider using memoization instead."

**Ask Questions**

❌ **Bad**: "Add unit tests"
✅ **Good**: "Can you add a unit test for the error case? I want to ensure we handle invalid input correctly."

**Suggest Code**

```suggestion
// Original
const name = user.firstName + ' ' + user.lastName;

// Suggestion
const name = `${user.firstName} ${user.lastName}`;
```

**Approve with Comments**

- Approve if changes are good with minor fixes
- Request changes if there are serious issues
- Comment if you have suggestions but approve

###### Addressing Review Comments

1. **Read carefully** - Understand the concern
2. **Ask for clarification** - If comment is unclear
3. **Make changes** - Or explain why not needed
4. **Reply to comments** - Explain your changes
5. **Re-request review** - After making updates

```
✅ Example reply:
"Good point! I've refactored the loop to use a more efficient algorithm.
See commit 5e3a1c for changes."

✅ Example disagreement:
"I see your point, but I think the current approach is clearer for this
use case. The performance impact is negligible (<1ms). However, I'm open
to reconsider if you have concerns."
```

###### Common Review Issues

**Issue: Too many changes in one PR**

Solution: Split into smaller PRs
- Easier to review
- Easier to revert if needed
- Easier to understand history

**Issue: PR sitting without review**

Solution:
- Ping reviewers in Slack/Teams
- Keep PR small so easier to review
- Be patient (24-48 hours typical)

**Issue: Disagreement with reviewer**

Solution:
- Discuss in PR comment
- Or schedule a quick call
- Team lead can make final decision if needed

**Issue: PR needs large refactor after review**

Solution:
- Discuss if refactor is necessary
- Or create follow-up PR after merge
- Keep current PR focused on original change

###### After Merge

1. **Verify deployment** - Check that changes are live
2. **Monitor** - Watch for errors in logs/monitoring
3. **Clean up** - Delete local and remote branch
4. **Update tracking** - Mark JIRA ticket as done
5. **Celebrate** - Great work!

```bash
# Clean up local
git branch -D feat/WF-2280-description

# Verify remote is cleaned
git branch -r | grep WF-2280  # Should be empty
```

###### Advanced Review Techniques

**Review in order**:
1. Understand the context (PR description, related issues)
2. Check architecture/design
3. Check implementation details
4. Check tests
5. Check documentation

**Look for anti-patterns**:
- ❌ Circular dependencies
- ❌ Tight coupling
- ❌ Memory leaks
- ❌ Race conditions
- ❌ Magic numbers (hardcoded values)

**Check the diff strategically**:
- Focus on additions and changes
- Understand why code was deleted
- Look at context (few lines before/after)
- Consider performance impact

