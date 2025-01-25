const { Model, KaldiRecognizer } = require("vosk");
const fs = require("fs");

const model = new Model("path/to/vosk-model"); // Add path to Vosk model

const recognize = (audioBuffer) => {
    return new Promise((resolve, reject) => {
        const rec = new KaldiRecognizer(model, 16000);

        rec.acceptWaveform(audioBuffer);
        const result = rec.finalResult();
        resolve(result.text);
    });
};

module.exports = { recognize };