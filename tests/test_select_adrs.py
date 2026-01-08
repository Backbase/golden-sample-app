import markdown
import requests
import os

from pathlib import Path
from deepeval import assert_test
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import GEval

class AzureOpenAIClient:
    def __init__(
        self,
        api_key: str,
        endpoint: str,
        deployment: str,
        api_version: str = "2025-01-01-preview",
        timeout: int = 60,
    ):
        self.api_key = api_key
        self.endpoint = endpoint.rstrip("/")
        self.deployment = deployment
        self.api_version = api_version
        self.timeout = timeout

    def chat(self, user_input: str, system_prompt: str | None = None) -> str:
        url = (
            f"{self.endpoint}/openai/deployments/"
            f"{self.deployment}/chat/completions"
            f"?api-version={self.api_version}"
        )

        messages = []
        if system_prompt:
            messages.append(
                {"role": "system", "content": system_prompt}
            )

        messages.append(
            {"role": "user", "content": user_input}
        )

        payload = {
            "messages": messages,
            "temperature": 0,       # set to 0 for tests
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "max_tokens": 800,
            "stream": False,
        }

        headers = {
            "Content-Type": "application/json",
            "Api-Key": self.api_key,
        }

        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=self.timeout,
        )

        response.raise_for_status()

        data = response.json()

        return data["choices"][0]["message"]["content"]

def run_markdown_prompt(client, path: str, agent: str) -> str:
    md = Path(path).read_text(encoding="utf-8")
    prompt = markdown.markdown(md)

    return client.chat(
        user_input=prompt,
        system_prompt=agent,
    )

def test_correctness():
    agent_raw = open('docs/agents/product-agent.md', 'r')
    agent = markdown.markdown( agent_raw.read() )

    raw_input = open('docs/prompts/1.1-select-adrs.md', 'r')
    input = markdown.markdown( raw_input.read() )

    raw_expected_output = open('docs/specs/JIRA-001/task.md', 'r')
    expected_output = markdown.markdown( raw_expected_output.read() )

    client = AzureOpenAIClient(
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        endpoint="https://oai.stg.azure.backbase.eu",
        deployment="gpt-4.1-mini",
    )

    actual_output = run_markdown_prompt(
        client,
        "docs/prompts/1.1-select-adrs.md",
        "Ignore all the ⛔ STOP commands" + agent,
    )

    print(actual_output)

    # Assert
    correctness_metric = GEval(
        name="Correctness",
        criteria="Determine if the 'actual output' is correct based on the 'expected output'.",
        evaluation_params=[LLMTestCaseParams.ACTUAL_OUTPUT, LLMTestCaseParams.EXPECTED_OUTPUT],
        threshold=0.5
    )
    test_case = LLMTestCase(
        input=input,
        actual_output=actual_output,
        expected_output=expected_output,
    )
    assert_test(test_case, [correctness_metric])
