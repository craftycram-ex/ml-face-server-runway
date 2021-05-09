const { default: axios } = require("axios");
const ws = require('ws');

let ownerCount = 0;
let peopleCount = 0;

const host = 'http://localhost';
const portFaces = 8001;
const portIdentify = 8000;

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 81 });

let wssClients = [];

wss.on('connection', function connection(ws) {
  wssClients.push(ws);
  ws.on('message', function incoming(message) {
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
  ws.send('something');
});

setInterval(() => {
  axios.get(`${host}:${portIdentify}/data`).then((res) => {
    /// console.log(res.data.results.length);
    ownerCount = res.data.results.length;
    if (res.data.results.length > 0) {
      // console.log('Besitzer erkannt!');
    }
  });
  axios.get(`${host}:${portFaces}/data`).then((res) => {
    // console.log(res.data);
    peopleCount = res.data.results.length;
  });
  if (ownerCount === 0 && peopleCount > 0) {
    console.log('Alarm! Unbekannte Person');
    setLED(3);
  } else if (ownerCount > 0 && peopleCount > 1) {
    setLED(2);
    console.log('Besuch! Hoffentlich alle negativ.');
  } else if (ownerCount > 0 && peopleCount > 0) {
    setLED(1);
    console.log('Howdy Howy.');
  } else {
    setLED(0);
    console.log('Keiner Zuhause!');
  }
}, 1000);

function setLED(state) {
  wssClients.forEach((c) => {
    c.send(state);
  });
}