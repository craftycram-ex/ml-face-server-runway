const { default: axios } = require("axios");

let ownerCount = 0;
let peopleCount = 0;

const host = 'http://localhost';
const portFaces = 8001;
const portIdentify = 8000;

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
  } else if (ownerCount > 0 && peopleCount > 1) {
    console.log('Besuch! Hoffentlich alle negativ.');
  } else if (ownerCount > 0 && peopleCount > 0) {
    console.log('Howdy Howy.');
  } else {
    console.log('Keiner Zuhause!');
  }
}, 1000);
