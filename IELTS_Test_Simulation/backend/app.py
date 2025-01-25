import os
import logging
import wave
import pyaudio
from vosk import Model, KaldiRecognizer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline


# Path to the Vosk model (Ensure the correct path to your model folder)
VOSK_MODEL_PATH = r"C:\Project\IELTS_Test_Simulation\backend\models\vosk-model-small-en-us-0.15"  # Change if necessary

# Load the Vosk model for speech recognition
try:
    model = Model(VOSK_MODEL_PATH)
    print(f"Successfully loaded Vosk model from {VOSK_MODEL_PATH}")
except Exception as e:
    logging.error(f"Error loading Vosk model: {e}")
    raise

# Initialize the recognizer
recognizer = KaldiRecognizer(model, 16000)

# Open the microphone and start listening
p = pyaudio.PyAudio()
info = p.get_host_api_info_by_index(0)
numdevices = info.get('deviceCount')

for i in range(0, numdevices):
    device = p.get_device_info_by_index(i)
    print(f"Device {i}: {device['name']}, Input channels: {device['maxInputChannels']}")
    
p.terminate()
stream = p.open(format=pyaudio.paInt16, channels=1, rate=16000, input=True, frames_per_buffer=8000)

print("Listening for speech... Speak now.")

# Continuously listen for speech
try:
    while True:
        data = stream.read(4000)
        if len(data) == 0:
            break

        if recognizer.AcceptWaveform(data):
            # Get the recognized text from the speech input
            result = recognizer.Result()
            print(f"Recognized Text: {result}")
            
            # Parse the recognized text from the result (getting the 'text' field)
            recognized_text = result.get("text", "")
            
            if recognized_text:
                # Now use Hugging Face to correct the grammar in the recognized text
                print(f"Original Text: {recognized_text}")
                
                # Load the Hugging Face model for grammar correction
                model_name = "Floyd93/Translation_Grammer_Jan_2024"
                tokenizer = AutoTokenizer.from_pretrained(model_name)
                model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
                
                # Initialize the pipeline
                pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer)
                
                # Pass the recognized text to the Hugging Face model for grammar correction
                output = pipe(recognized_text)
                
                # Print the corrected output
                corrected_text = output[0]['generated_text']
                print(f"Corrected Text: {corrected_text}")

        else:
            print("Still listening...")

except KeyboardInterrupt:
    print("Exiting...")

finally:
    stream.stop_stream()
    stream.close()
    p.terminate()