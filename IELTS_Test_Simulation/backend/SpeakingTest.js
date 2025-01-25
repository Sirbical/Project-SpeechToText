import React, { useState } from 'react';
import { transcribeAudio, analyzeResponse } from '../services/api'; // Ensure these functions are properly implemented

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
                        const audioBuffer = reader.result.split(',')[1]; // Convert audio to base64

                        // Step 1: Send audio to backend for transcription
                        const transcriptionResponse = await transcribeAudio(audioBuffer);
                        setTranscription(transcriptionResponse.transcription);

                        // Step 2: Send transcription to backend for feedback
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

            // Stop recording after 5 seconds (you can adjust or make it user-controlled)
            setTimeout(() => {
                mediaRecorder.stop();
                setIsRecording(false);
            }, 5000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Please allow microphone access to record audio.');
        }
    };

    return (
        <div>
            <h1>IELTS Speech-to-Text and Feedback</h1>
            {isRecording ? (
                <p>Recording... Please wait</p>
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