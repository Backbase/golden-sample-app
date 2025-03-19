# Aider GitHub Action

This GitHub Action allows you to run [Aider](https://github.com/paul-gauthier/aider), an AI-powered coding assistant, in your GitHub Actions workflows. It enables AI-assisted code changes and automated pull request creation.

## Usage

```yaml
- name: Apply AI changes with Aider
  uses: ./.github/actions/aider
  with:
    branch: "feature/my-branch"
    model: "gpt-4-1106-preview"
    aider_args: "--yes --message 'Add error handling'"
    openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `openai_api_key` | OpenAI API Key | No | "" |
| `anthropic_api_key` | Anthropic API Key | No | "" |
| `gemini_api_key` | Google Gemini API Key | No | "" |
| `groq_api_key` | Groq API Key | No | "" |
| `cohere_api_key` | Cohere API Key | No | "" |
| `deepseek_api_key` | Deepseek API Key | No | "" |
| `openrouter_api_key` | OpenRouter API Key | No | "" |
| `model` | AI model to use | No | "gpt-4-1106-preview" |
| `branch` | Git branch to apply changes to | No | "main" |
| `aider_args` | Arguments to pass to Aider CLI | Yes | N/A |

## Files

- **action.yml** - Action definition and input configuration
- **Dockerfile** - Container setup for running Aider
- **entrypoint.sh** - Script that executes when container runs 
- **requirements.txt** - Python dependencies

## Example Workflow

```yaml
name: AI Code Updates
on:
  issues:
    types: [labeled]

jobs:
  update-code:
    runs-on: ubuntu-latest
    if: github.event.label.name == 'ai-update'
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Aider
        uses: ./.github/actions/aider
        with:
          branch: ${{ github.head_ref }}
          model: "gpt-4-1106-preview"
          aider_args: "--yes --message 'Apply requested changes'"
          openai_api_key: ${{ secrets.OPENAI_API_KEY }}
```

## Implementation Details

### Container Setup

The action runs in a Python 3.12 slim container with:

- Git for version control
- Aider chat package installed via pip
- Custom entrypoint script for workflow execution

### Execution Flow

1. Container starts with the repository mounted
2. Work directory is copied to /tmp/repo
3. Git is configured with GitHub Actions bot credentials
4. Specified branch is checked out
5. Aider runs with provided arguments
6. Changes are committed and pushed to the branch

## Environment Variables

The action automatically handles:

- API keys for various AI providers
- Git configuration
- Branch management
- Working directory setup
