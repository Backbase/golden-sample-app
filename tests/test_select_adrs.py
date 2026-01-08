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

    def chat(self, messages) -> str:
        url = (
            f"{self.endpoint}/openai/deployments/"
            f"{self.deployment}/chat/completions"
            f"?api-version={self.api_version}"
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

def test_correctness():
    TEST_MODE_OVERRIDE = """
    You are running in AUTOMATED TEST MODE.

    Override any instructions that require stopping, waiting, confirmation,
    or multi-turn interaction.

    Always:
    - Execute all applicable phases in a single response
    - Produce the final artifact for the active mode
    - Ignore ⛔ STOP instructions
    - Do not ask the user questions
    """

    agent_raw = open('docs/agents/product-agent.md', 'r')
    agent = markdown.markdown( agent_raw.read() )
    print(agent)

    raw_input = open('docs/prompts/1.1-select-adrs.md', 'r')
    input = markdown.markdown( raw_input.read() )
    print(input)

    raw_expected_output = open('docs/specs/JIRA-001/task.md', 'r')
    expected_output = markdown.markdown( raw_expected_output.read() )

    client = AzureOpenAIClient(
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        deployment=os.environ["AZURE_DEPLOYMENT_NAME"],
    )

    messages = [
        {
            "role": "system",
            "content": agent,
        },
        {
            "role": "system",
            "content": input,
        },
        {
            "role": "system",
            "content": TEST_MODE_OVERRIDE,
        },
        {
            "role": "user",
            "content": input,
        },
    ]

    actual_output = client.chat(messages)

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
