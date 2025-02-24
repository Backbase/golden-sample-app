# SYSTEM PROMPT
PROMPT_INSTRUCTIONS=$(cat ./tools/migration/prompts/gpt-o3-mini/system.md)
echo "PROMPT_INSTRUCTIONS: $PROMPT_INSTRUCTIONS"

# USER PROMPT
INPUT_DATA=$(cat ./tools/migration/prompts/gpt-o3-mini/user.md | sed 's/"/\\"/g')
echo "INPUT_DATA:" $INPUT_DATA


# CREATE PAYLOAD WITH PROMPT INSTRUCTIONS AND USER INPUT USING JQ
JSON_PAYLOAD=$(jq -n --arg prompt_instructions "$PROMPT_INSTRUCTIONS" --arg input_data "$INPUT_DATA" '{
    messages: [
        {role: "assistant", content: $prompt_instructions},
        {role: "user", content: $input_data}
    ],
    frequency_penalty: 0,
    presence_penalty: 0,
    }')

#echo "JSON_PAYLOAD: $JSON_PAYLOAD"

# CALL GPT-4o1 API
RESPONSE_DATA=$(curl "$GPT_O1_URL" \
    -H "Content-Type: application/json" \
    -H "Api-Key: $GPT_O1_KEY" \
    -d "$JSON_PAYLOAD")

echo "$RESPONSE_DATA"
