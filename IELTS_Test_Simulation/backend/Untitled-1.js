fetch('http://localhost:3003/your-endpoint')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));