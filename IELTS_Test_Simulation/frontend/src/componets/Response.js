async function startRecording() {
    // Start recording audio
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    let audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const reader = new FileReader();
        
        reader.onloadend = async () => {
            const audioBuffer = reader.result.split(',')[1];  // Base64 encoded audio

            // Send audio to backend for transcription
            const transcriptionResponse = await fetch('http://localhost:3003/api/speech-to-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBuffer }),
            });
            
            const transcriptionData = await transcriptionResponse.json();
            const transcriptionText = transcriptionData.transcription;

            // Send transcription to backend for analysis
            const feedbackResponse = await fetch('http://localhost:3003/api/analyze-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: transcriptionText }),
            });

            const feedbackData = await feedbackResponse.json();
            console.log('Feedback:', feedbackData.feedback);
        };

        reader.readAsDataURL(audioBlob);  // Convert audio to Base64
    };

    mediaRecorder.start();

    // Stop recording after 5 seconds (for testing)
    setTimeout(() => mediaRecorder.stop(), 5000);
}

startRecording();  // Trigger recording when needed