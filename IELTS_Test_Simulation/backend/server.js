const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const openai = require('openai');
const { Model, Recognizer } = require('vosk');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3003;

openai.apiKey = "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";  // Set OpenAI API Key

// Initialize Vosk model for transcription
const model = new Model(path.join(__dirname, 'vosk-model'));
const recognizer = new Recognizer({ model: model, sampleRate: 16000 });

app.use(cors());
app.use(express.json());

// Speech-to-text endpoint
app.post('/api/speech-to-text', (req, res) => {
    const { audioBuffer } = req.body;
    
    // Assuming audioBuffer is a base64 encoded string
    const buffer = Buffer.from(audioBuffer, 'base64');
    recognizer.acceptWaveform(buffer);
    const result = recognizer.finalResult();
    
    if (result.text) {
        res.json({ transcription: result.text });
    } else {
        res.status(500).json({ error: 'Transcription failed' });
    }
});

// Analyze transcription for fluency, grammar, etc.
app.post('/api/analyze-response', async (req, res) => {
    const { audioBuffer } = req.body;

    try {
        const transcription = "This is a simulated transcription result."
        const prompt = `Analyze the following transcript and provide feedback on fluency, grammar, lexical resource, and pronunciation: \n\n${text}`;
        res.json({ transcription });

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a language expert." },
                { role: "user", content: prompt },
            ]
        });

        const analysis = response.choices[0].message.content;
        res.json({ feedback: analysis });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});