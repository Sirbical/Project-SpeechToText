import { useEffect, useState } from 'react';

import SpeechToTextComponent from 'C:Project/IELTS_Test_Simulation/frontend/src/components/SpeechToTextComponent';

const App = () => {
  const [transcription, setTranscription] = useState("");


  useEffect(() => {
    const audioBuffer = "your_audio_data_here"; // Replace with real audio data

    fetch('http://localhost:3003/api/speech-to-text', {
      method: 'POST',  // Ensure you're using POST here
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ audioBuffer }), // Sending audio buffer as JSON
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setTranscription(data.transcription);  // Assuming transcription is returned in the response
    })
    .catch(error => console.error('Error fetching data:', error));
  }, []);
    return (
        <div>
          <h1>Frontend is Running on Port 3005</h1>
          <p>{transcription}</p>  {/* Display the transcription */}
            <SpeechToTextComponent />
        </div>
    );
};

export default App;