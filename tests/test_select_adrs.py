import markdown
import chatbot

from deepeval import assert_test
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import GEval

def test_correctness():
    raw_input = open('docs/prompts/1.1-select-adrs.md', 'r')
    input = markdown.markdown( raw_input.read() )

    raw_expected_output = open('docs/specs/JIRA-001/task.md', 'r')
    expected_output = markdown.markdown( raw_expected_output.read() )

    actual_output = chatbot.run(input)

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
