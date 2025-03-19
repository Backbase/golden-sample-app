# Aider Issue to PR Workflow

This GitHub Actions workflow automates the process of converting GitHub issues into pull requests using the Aider AI assistant.

## Workflow Trigger

The workflow is designed to be called from other workflows, making it reusable.

## Inputs

- **base-branch**: (Required) Target branch for the PR
- **chat-timeout**: (Optional) Timeout for AI chat in minutes (default: 10)
- **issue-number**: (Required) Issue number to convert
- **model**: (Optional) AI model to use (default: "gpt-4-1106-preview")

## Secrets

Supports various AI service API keys:

- OpenAI
- Anthropic
- Gemini
- Groq
- Cohere
- Deepseek
- OpenRouter

## Job Steps

1. **Checkout**
   - Checks out the repository code

2. **Create Branch**
   - Creates a new feature branch named `feature/aider-<issue-title>`
   - Handles existing branches
   - Uses kebab-case for branch names
   - Based on the specified base branch

3. **Get Issue**
   - Fetches the issue details using GitHub API
   - Retrieves issue title and body
   - Sanitizes special characters

4. **Create Prompt**
   - Formats the issue into an AI prompt

5. **Apply Changes**
   - Uses Aider AI to analyze and apply code changes
   - Runs with specified timeout
   - Uses configured AI model
   - Applies changes to the new branch

6. **Create PR**
   - Links to original issue
   - Adds 'automated-pr' label
   - Handles duplicate PRs
   - Uses prefix '[Aider]' in PR title

7. **Upload Chat History**
   - Saves the AI chat history as an artifact

## Example Usage

```yaml
jobs:
  convert-issue:
    uses: ./.github/workflows/aider-issue-to-pr.yml
    with:
      base-branch: main
      issue-number: 123
    secrets:
      openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```