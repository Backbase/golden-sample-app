
# Claude

- Keys management and console: https://console.anthropic.com/dashboard 
- Prompt helper tools: https://console.anthropic.com/workbench/e8373d5b-0731-4693-a912-f3e51016796d
- Create your key here: https://console.anthropic.com/settings/keys
- Store your key in 1password (secure note), don't share it, don't commit it.


# CLINE

> Cline doesn’t let you directly edit its underlying system prompt (which is defined in its source file, e.g. in src/core/prompts/system.ts). Instead, you can “extend” or “customize” it by adding your own instructions. To do this, you can use one of two methods:

 - Custom Instructions (global): Open the Cline extension settings in VS Code and paste your additional instructions into the “Custom Instructions” field. These instructions are always “on” and will be merged into the system prompt.

 - .clinerules File (project-specific): Create a file named .clinerules in the root of your project and add your project-specific guidelines there. Cline automatically appends these rules to its system prompt when working in that project.

- Guidelines on system prompt & usage: https://docs.cline.bot/improving-your-prompting-skills/prompting


# GPT o1-mini

- Get keys here: https://oai.stg.azure.backbase.eu/openai-model-overview
- define environment variables for your env
- use gpt-migrate.sh for running
- Store your key in 1password (secure note), don't share it, don't commit it.
- CLINE does not yet support o1 / o3 models, see https://github.com/cline/cline/issues/1634 