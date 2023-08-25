/*app.js*/

const express = require('express');
const axios = require('axios'); // Add this line to import axios

const PORT = parseInt(process.env.PORT || '8090');
const app = express();

app.get('/', (req, res) => {
  // Send a GET request to tyk
  axios.get('http://host.docker.internal:8080/rolldice/')
    .then(response => {
      // You can handle the response from the other server here
      res.send(`Received response from dice server: ${response.data}`);
    })
    .catch(error => {
      // Handle errors if the request to the dice server fails
      res.status(500).send('Error fetching data from dice server');
    });
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
