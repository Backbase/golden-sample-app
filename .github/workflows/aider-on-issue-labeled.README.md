# Aider Issue Label Trigger Workflow

This workflow automatically generates pull requests when issues are labeled with 'aider', using the Aider AI assistant.

## Trigger

The workflow triggers on issue labeling events:
- Only activates when an issue receives the `aider` label

## Workflow Details

The workflow calls the reusable `aider-issue-to-pr.yml` workflow with the following configuration:

### Inputs
- `issue-number`: The number of the labeled issue
- `base-branch`: Uses the repository's default branch

### Secrets
- Uses OpenAI API key from repository secrets

## Example Usage

1. Create a new issue in your repository
2. Add the label `aider` to the issue
3. The workflow will automatically:
   - Create a new branch
   - Apply AI-suggested changes
   - Create a pull request

## Implementation

```yaml
name: Auto-generate PR from Issues using Aider
on:
  issues:
    types: [labeled]

jobs:
  generate:
    uses: ./.github/workflows/aider-issue-to-pr.yml
    if: github.event.label.name == 'aider'
    with:
      issue-number: ${{ github.event.issue.number }}
      base-branch: ${{ github.event.repository.default_branch }}
    secrets: 
      openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

This workflow acts as a trigger for the main Aider workflow, automating the process of converting labeled issues into pull requests.