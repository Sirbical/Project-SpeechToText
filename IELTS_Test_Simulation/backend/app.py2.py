import sys
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline

# Make sure to check if the argument was passed from PowerShell
if len(sys.argv) < 2:
    print("No input text provided!")
    sys.exit()

# Get the input text passed from PowerShell
input_text = sys.argv[1]

# Model name
model_name = "Floyd93/Translation_Grammer_Jan_2024"

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# Initialize the pipeline for text-to-text generation
pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer)

# Use the model to generate the corrected output
output = pipe(input_text)

# Print the generated output to be captured by PowerShell
print(f"Corrected text: {output[0]['generated_text']}")