const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const jsonFilePath = path.join(__dirname, 'PlanetsAndHousesCombi.json');
const horoscopeData = JSON.parse(fs.readFileSync('horoscopeDataForVimeo.json', 'utf8'));
const fetch = require('node-fetch');



let dateObject;
let searchQuery;
let lat;
let lon;
let year;
let month;
let day;
let hour;
let min;
let tzone;
let astrologyApiArray;


// Server statiske filer fra "public_html" mappen
app.use(express.static(path.join(__dirname, 'public_html')));

app.use(express.json());




function processData(planetsArray) {
  // Read and parse the PlanetsAndHousesCombi.json file
  const data = fs.readFileSync(jsonFilePath, 'utf8');
  let vimeoData = JSON.parse(data);

  // Iterate over the planetsArray and find matching entries in the vimeoData
  let matchedData = planetsArray.map(planet => {
    // Try to find a match by both name + sign or sign + house (if available)
    let match = vimeoData.find(item => 
      (item.name === planet.name && item.sign === planet.sign && item.vimeoId !== 'null' && item.vimeoId) ||
      (item.sign === planet.sign && item.house === planet.house && item.vimeoId !== 'null' && item.vimeoId)
    );

    if (match) {
      // Return the matched object
      if (match.name) {
        // Planet with sign match
        return { name: match.name, sign: match.sign, vimeoId: match.vimeoId };
      } else if (match.house) {
        // Sign with house match
        return { sign: match.sign, house: match.house, vimeoId: match.vimeoId };
      }
    }
  }).filter(Boolean); // Filter out undefined values

  // Log the matched data
  console.log(matchedData);

  // Return the matched data
  return matchedData;
}

async function geoMapLookUpCity(searchQuery) {
  if (!searchQuery) return;
  const apiKey = 'd408c5daecbe4ffbbf424387b5420462';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchQuery)}&key=${apiKey}&language=da&limit=1`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.results.length > 0) {
        const { geometry } = data.results[0];
        lat = geometry.lat;
        lon = geometry.lng;
        console.log("lat: " + lat + " lng: " + lon);
       
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function getDate(dateObject) {
  // Clear old date values to prevent caching
  year = null;
  month = null;
  day = null;
  hour = null;
  min = null;

  year = dateObject.getFullYear();
  month = dateObject.getMonth() + 1; // getMonth() returns 0-11, so add 1 to get correct month
  day = dateObject.getDate();
  hour = dateObject.getHours();
  min = dateObject.getMinutes();
}

async function getCorrectTimeZone(lat, lon, dateObject) {
  const timestamp = Math.floor(dateObject.getTime() / 1000);
  const timeZoneApiKey = "AIzaSyDIcE7gBik6UkN5hd6MX1nGUDZC_t9nddA";
  const timeZoneUrl = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${timestamp}&key=${timeZoneApiKey}`;

  try {
    const response = await fetch(timeZoneUrl);
    if (!response.ok) {
      throw new Error('Netværksfejl: ' + response.status);
    }
    const data = await response.json();
    tzone = (data.rawOffset + data.dstOffset) / 3600;
  } catch (error) {
    console.error("Der opstod en fejl:", error);
  }
}

async function getAstroData() {
  const api = 'planets/tropical';
  const userId = '633917';
  const apiKeyastro = '33b87023a95554c658f7f7f1fa51efd66e1c8e53';

  // The required data for the astrology API
  const data = {
    day,
    month,
    year,
    hour,
    min,
    lat,
    lon,
    tzone
  };

  // Authorization header for the astrology API
    const auth = "Basic " + Buffer.from(`${userId}:${apiKeyastro}`).toString('base64');

  const options = {
    method: 'POST',
    headers: {
      'authorization': auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  try {
    // Fetching astrology data from the API
    const response = await fetch(`https://json.astrologyapi.com/v1/${api}`, options);
    if (!response.ok) {
      throw new Error('Netværksfejl: ' + response.status);
    }
    astrologyApiArray = await response.json();
    console.log(astrologyApiArray);
  } catch (error) {
    console.error('Error:', error);
  }
}

app.post('/all-kibirdy-astro-data', async (req, res) => {
    try {
      // Destructure dateObject and searchQuery from the request body
      ({ dateObject, searchQuery } = req.body);
      console.log('Received parameters:', { dateObject, searchQuery});
  
      // Extract individual date components from dateObject
      dateObject = new Date(dateObject);
      getDate(dateObject);

      await geoMapLookUpCity(searchQuery);

      getDate(dateObject);

      await getCorrectTimeZone(lat, lon, dateObject);
  
      // Call getAstroData function
      await getAstroData();
  
      // Find the kibirdyComHoroscope data
      let kibirdyComHoroscope = findKibirdyComHoroscope(astrologyApiArray);
  
      // Process the astrologyApiArray data
      let appVimeoArray = processData(astrologyApiArray);
  
      // Send both kibirdyComHoroscope and appVimeoArray in the response
      res.json({
        kibirdyComHoroscope: kibirdyComHoroscope,
        appVimeoArray: appVimeoArray,
        lon: lon, 
        lat: lat
      });
    } catch (error) {
      console.error('Error in /process-data:', error);
      res.status(500).json({ message: 'Error processing data' });
    }
  });
  



function findKibirdyComHoroscope(astrologyApiArray) {
    // Konverter planetsData objekt til en array af værdier
    const planetsArray = Object.values(astrologyApiArray);
  
    // Filtrer kun planeterne Sun, Moon og Mercury
    const filteredPlanets = planetsArray.filter(planet => ['Mercury', 'Moon', 'Sun'].includes(planet.name));
  
    // Sørg for, at alle tre planeter er til stede
    if (filteredPlanets.length === 3) {
      const sunSign = filteredPlanets.find(planet => planet.name === 'Sun').sign;
      const moonSign = filteredPlanets.find(planet => planet.name === 'Moon').sign;
      const mercurySign = filteredPlanets.find(planet => planet.name === 'Mercury').sign;
  
      // Find det tilsvarende horoskop i den eksterne data
      const matchingHoroscope = horoscopeData.find(item =>
        item.Sun.sign === sunSign && item.Moon.sign === moonSign && item.Mercury.sign === mercurySign
      );
  
      // Returner det fundne horoskop eller null, hvis intet match findes
      if (matchingHoroscope) {
        return {
          message: 'Horoscope found',
          id: matchingHoroscope.id,
          vimeoId: matchingHoroscope.vimeoId
        };
      } else {
        return { message: 'No matching horoscope found' };
      }
    } else {
      return { message: 'Invalid planet data received' };
    }
  }


app.listen(3000, () => {
  console.log('Server running on port 3000');
});


