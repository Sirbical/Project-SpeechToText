import React, { useState } from 'react';

const AudioRecorder = () => {
  const [recorder, setRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    if (typeof MediaRecorder !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const newRecorder = new MediaRecorder(stream);
          newRecorder.ondataavailable = (e) => {
            const audioData = e.data;
            console.log(audioData); // Process the audio data here
          };
          newRecorder.start();
          setRecorder(newRecorder);
          setIsRecording(true);
        })
        .catch((err) => {
          console.error('Error accessing microphone: ', err);
        });
    } else {
      console.log('MediaRecorder is not supported by your browser.');
    }
  };

  const stopRecording = () => {
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
      setIsRecording(false);
    } else {
      console.log('Recorder is either stopped or undefined.');
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop Recording
      </button>
    </div>
  );
};

export default AudioRecorder;