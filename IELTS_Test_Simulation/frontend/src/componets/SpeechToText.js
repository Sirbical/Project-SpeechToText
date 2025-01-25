import React, { useState } from 'react';
import { transcribeAudio, analyzeResponse } from '../services/api'; // Adjust the path if necessary

const SpeechToTextComponent = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [feedback, setFeedback] = useState('');

    const startRecording = async () => {
        try {
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
                    try {
                        const audioBuffer = reader.result.split(',')[1]; // Base64 encoded audio
                        const transcriptionResponse = await transcribeAudio(audioBuffer);
                        setTranscription(transcriptionResponse.transcription);

                        const feedbackResponse = await analyzeResponse(transcriptionResponse.transcription);
                        setFeedback(feedbackResponse.feedback);
                    } catch (error) {
                        console.error('Error processing audio:', error);
                    }
                };

                reader.readAsDataURL(audioBlob);
            };

            mediaRecorder.start();
            setIsRecording(true);

            setTimeout(() => {
                mediaRecorder.stop();
                setIsRecording(false);
            }, 5000); // Stop after 5 seconds
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to record audio.');
        }
    };

    return (
        <div>
            <h1>IELTS Speech-to-Text and Feedback</h1>
            {isRecording ? (
                <p>Recording... Please wait.</p>
            ) : (
                <button onClick={startRecording}>Start Recording</button>
            )}
            {transcription && (
                <div>
                    <h2>Transcription</h2>
                    <p>{transcription}</p>
                </div>
            )}
            {feedback && (
                <div>
                    <h2>Feedback</h2>
                    <p>{feedback}</p>
                </div>
            )}
        </div>
    );
};

export default SpeechToTextComponent;