#!/bin/bash

# Set constants
WORKDIR="/tmp/repo"
AIDER_CONFIG="${WORKDIR}/.aider.model.settings.yml"

# Get env vars
BRANCH_NAME=$(echo $FEATURE_REF | sed 's/refs\/heads\///g')

# Workaround for writing files inside the container
cp -r "${GITHUB_WORKSPACE}" "${WORKDIR}"
# Switch to the repo directory
cd "${WORKDIR}"

# Fix repo ownership issues
git config --global --add safe.directory "${WORKDIR}"

# Set git config (For some reason setting this in the Dockerfile doesn't work!)
git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config --global user.name "github-actions[bot]"

# Create Aider configuration file
cat <<EOL > "$AIDER_CONFIG"
- name: $MODEL
  edit_format: diff
  weak_model_name: $MODEL
  use_repo_map: true
  examples_as_sys_msg: true
  use_temperature: false
  extra_params:
    extra_headers:
      anthropic-beta: prompt-caching-2024-07-31,pdfs-2024-09-25,output-128k-2025-02-19
  max_tokens: 64000
  thinking:
    type: enabled
    budget_tokens: 32000
EOL

# Checkout feature branch
git fetch
git checkout $BRANCH_NAME

# Run aider command
eval "aider $AIDER_ARGS"

# Push changes
git push -u origin $BRANCH_NAME
