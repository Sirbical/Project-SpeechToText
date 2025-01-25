import openai
import sys

# Your OpenAI API key
openai.api_key = 'your_openai_api_key_here'

# Get the user input from Node.js
user_input = sys.argv[1]  # This assumes you're passing the input from Node.js

completion = openai.ChatCompletion.create(
    model="gpt-4",  # Use GPT-4 or GPT-3.5
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": user_input}
    ]
)

# Print the response message which will be captured by Node.js
print(completion.choices[0].message['content'])