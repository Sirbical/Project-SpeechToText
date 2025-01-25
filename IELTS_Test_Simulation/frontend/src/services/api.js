export const transcribeAudio = async (audioBuffer) => {
    const response = await fetch('http://localhost:3003/api/speech-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBuffer }),
    });
    if (!response.ok) throw new Error('Failed to transcribe audio');
    return response.json();
};

export const analyzeResponse = async (text) => {
    const response = await fetch('http://localhost:3003/api/analyze-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error('Failed to analyze response');
    return response.json();
};