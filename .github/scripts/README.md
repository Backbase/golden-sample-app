# test_select_adrs

See Azure OpenAI documentation for more details: https://deepeval.com/docs/environment-variables

## Caveats

- I needed to run `deepeval set-azure-openai --model=gpt-5` for deepeval to actually switch over to Azure.
For some reason, setting the `USE_AZURE_OPENAI` didn't do the trick.
- You need to be on VPN to access the Azure OpenAI endpoints.
- Couldn't get gpt-5 to work. gpt-4.mini works
