/*app.js*/

const express = require('express');
const http = require('http');

const PORT = parseInt(process.env.PORT || '8091');
const app = express();

const options = {
  hostname: 'localhost:8081', // Replace with the URL you want to send a GET request to
  port: 8081, // Use 443 for HTTPS
  path: '/delay/3', // Replace with the path to the resource you want to retrieve
  method: 'GET', // HTTP method
};




function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.get('/check-availability', (req, res) => {
  const req = http.request(options, (res) => {
    let data = '';
  
    // A chunk of data has been received.
    res.on('data', (chunk) => {
      data += chunk;
    });
  
    // The whole response has been received.
    res.on('end', () => {
      console.log(data);
    });
  });
  
  res.send(getRandomNumber(1, 6).toString());
});

app.get('/reserve-slot', (req, res) => {
  res.send(getRandomNumber(1, 6).toString());
});

app.get('/confirm-reservation', (req, res) => {
  res.send(getRandomNumber(1, 6).toString());
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
