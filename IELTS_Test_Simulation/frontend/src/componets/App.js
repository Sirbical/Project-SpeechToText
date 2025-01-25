import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    // Make an API call to your backend (localhost:3001)
    fetch('http://localhost:3003/api/speech-to-tex')
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Do something with the data
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Frontend is Running on Port 3002</h1>
    </div>
  );
};

export default App;