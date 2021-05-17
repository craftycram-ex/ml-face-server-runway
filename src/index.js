const axios = require('axios');

// declare variables to store runway output
let ownerCount = 0;
let peopleCount = 0;

// define runway webserver ports & ip
const host = 'http://localhost';
const portFaces = 8001;
const portIdentify = 8000;

// start a local websocket server
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 81 });
let wssClients = [];

// handle websocket connections
// add & remove clients in store
wss.on('connection', (ws) => {
  ws.send('howdy client');
  wssClients.push(ws);
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });
  ws.on('close', () => {
    console.log('closed. removing client');
    wssClients.filter((e) => e === wss);
  });
  ws.on('error', () => {
    console.log('errored. removing client');
    wssClients.filter((e) => e === wss);
  });
});

// repetitively get data from runway each second
setInterval(() => {
  // get if owner is in camera
  axios.get(`${host}:${portIdentify}/data`).then((res) => {
    ownerCount = res.data.results.length;
  });
  // get amount of total persons in camera
  axios.get(`${host}:${portFaces}/data`).then((res) => {
    peopleCount = res.data.results.length;
  });
  // check for all owner / stranger combinations
  if (ownerCount === 0 && peopleCount > 0) {
    console.log('Alarm! Unbekannte Person');
    setLED(3);
  } else if (ownerCount > 0 && peopleCount > 1) {
    console.log('Besuch! Hoffentlich alle negativ.');
    setLED(2);
  } else if (ownerCount > 0 && peopleCount > 0) {
    console.log('Howdy Howy.');
    setLED(1);
  } else {
    console.log('Keiner Zuhause!');
    setLED(0);
  }
}, 1000);

// send led state to all clients
function setLED(state) {
  wssClients.forEach((c) => {
    c.send(state);
  });
}