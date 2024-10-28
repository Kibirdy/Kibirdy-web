//Global variables are set, and used of different functions to fetch correct data for the astrologyapi.



let vimeoId; 
let lat = null; 
let lon = null;
let latOriginal; 
let lonOriginal;
let dateValue;
let placeValue;

config = {
  enableTime: true,
  time_24hr: true,
  dateFormat: "Y-m-d H:i",
  altInput: true,
  altFormat: "F j, Y, (h:S K)",

}

// Hent video-ID fra URL'en (hvis der er et)
const urlParams = new URLSearchParams(window.location.search);
const videoId = urlParams.get('id');

createShareLinks(urlParams);


// Hvis der er et video-ID i URL'en, vis den video
if (videoId) {
createShareLinks("kibirdy.com/?id="+videoId);
  embedVideo(videoId);
} else {
 
  // Hide the input box
  $("#user-data-input-box").show();

  // Show the confirm box
  $("#user-data-confirm-box").hide();

  // Show the confirm box
  $("#loading-box").hide();

$("#contact-info").hide();
    
}  

// Funktion til at indlejre en video
function embedVideo(vimeoId) {

console.log("hel");

  $("#loading-box").show();
  $("#social-media").show();
  $("#user-data-input-box").hide();
  $("#user-data-confirm-box").hide();
  $("#logo-element").hide();
  $("#contact-info").hide();
  $("#input").hide();

  // Få skærmens bredde og højde
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  // Definer iframe bredde og højde som en procentdel af skærmens dimensioner

  let iframeWidth
  let iframeHeight

 if(window.innerWidth <= 667){
  iframeWidth = Math.floor(screenWidth * 0.92); // 92% af skærmbredden
  iframeHeight = Math.floor(iframeWidth * (9 / 16)); // Højde beregnet baseret på 16:9-forholdet
 }else{
  iframeWidth = Math.floor(screenWidth * 0.82); // 82% af skærmbredden
  iframeHeight = Math.floor(iframeWidth * (9 / 16)); // Højde beregnet baseret på 16:9-forholdet

 }
  

  // Indsæt iframe med dynamisk bredde og højde
  if (vimeoId) {
    document.getElementById('video-element').innerHTML = `<iframe id="myIframe" width="${iframeWidth}" height="${iframeHeight}"frameborder="0" src="https://player.vimeo.com/video/${vimeoId}?autoplay=1&controls=1&title=1&byline=0&portrait=0&badge=0">`;
  
}
}



const flatpickrConfig = {
  enableTime: true,
  dateFormat: "Y-m-d\\TH:i", // Format for værdien, der gemmes i inputfeltet (til `datetime-local`)
  altInput: true, // Opretter et alternativt inputfelt til visning
  altFormat: "d F Y H:i", // Det format, som vises til brugeren, inkl. fuld måned
  time_24hr: true, // Vis tiden i 24-timers format
  disableMobile: true, 
  onReady: function (selectedDates, dateStr, instance) {
    // Tilføj placeholder med det samme
    instance.altInput.setAttribute("placeholder", "Time of birth");

    // Sørg for, at placeholderen forbliver, indtil brugeren vælger en dato
    instance.altInput.addEventListener("input", function () {
      if (instance.altInput.value === "") {
        instance.altInput.setAttribute("placeholder", "Time of birth");
      }
    });
  }
};

// Initialiser Flatpickr med disableMobile: true
const calendar = flatpickr("#date-of-birth-id", flatpickrConfig);

// Når brugeren klikker på input-feltet, opdateres disableMobile til false
document.querySelector("#date-of-birth-id").addEventListener("focus", function () {
  // Tjek om disableMobile er stadig true, så vi kun ændrer det én gang.
  if (calendar.config.disableMobile === true) {
    calendar.config.disableMobile = false; // Opdaterer konfigurationen
    calendar.destroy(); // Destruerer den nuværende Flatpickr-instans
    flatpickr("#date-of-birth-id", flatpickrConfig); // Reinitialiser med opdateret config
  }
});




// 1. step Se her Christian 
document.querySelector("#letsDoIt").addEventListener("click", () => {

  if (validateForm() == "continue") {

    

    callAllKibirdyAstroData(dateValue, placeValue, lat, lon);



    $("#user-data-confirm-box").show();
    $("#user-data-input-box").hide();
    $("#loading-box").hide();
    $("#user-video").hide();

  }

});

// Click on logo back to front-page (1.step)
document.querySelector("#header-logo").addEventListener("click", () => {

  $("#user-data-input-box").show();
    $("#user-data-confirm-box").hide();
    $("#contact-info").hide();
    $("#input").hide();
    $("#logo-element").hide();
    $("#loading-box").hide();


  

  const iframe = document.getElementById("myIframe");
  
  if (iframe) {
    iframe.remove();
  }
  const placeInput = document.getElementById('typePlaceOnEarch');
  calender.clear();
  placeInput.value = '';

});

// 2. step
 document.querySelector("#createVideoBtn10").addEventListener("click", () => {

  $("#loading-box").show();
  $("#logo-element").show();
  $("#user-data-input-box").hide();
  $("#user-data-confirm-box").hide();
  $("#social-media").hide();

    startFakeProgressBar(vimeoId)
  
});

// Click on New Video
document.querySelector("#new-video").addEventListener("click", () => {
  $("#user-data-input-box").show();
  $("#user-data-confirm-box").hide();
  $("#loading-box").hide();
  $("#contact-info").hide();
  $("#input").hide();


  const iframe = document.getElementById("myIframe");

  if (iframe) {
    iframe.remove();
  }
  const placeInput = document.getElementById('typePlaceOnEarch');
  calender.clear();
  placeInput.value = '';

  if(window.location.origin =="http://localhost:3000")
  {window.location.href = `http://localhost:3000`
  }else{
    window.location.href = `http://kibirdy.com`
  }


});


// Go Back from contact page to 1. step
document.querySelector("#backBtnContact").addEventListener("click", () => {


  $("#user-data-input-box").show();
  $("#user-data-confirm-box").hide();
  $("#loading-box").hide();
  $("#contact-info").hide();

});

//Go To Contact Page
document.querySelector("#goToContact").addEventListener("click", () => {

  stopVimeoVideo();
  
  $("#contact-info").show();
  $("#video-element ").hide();
  $("#input").hide();
  $("#user-data-input-box").hide();
  $("#user-data-confirm-box").hide();
  $("#loading-box").hide();

});
/*
// Go Back from 2. step to 1. step
document.querySelector("#BackBtnFrom2Step").addEventListener("click", () => {

  $("#user-data-input-box").show();
  $("#user-data-confirm-box").hide();
  $("#loading-box").hide();
  $("#contact-info").hide();
});
*/





document.querySelector("body").addEventListener("click", () => {
  validateForm()
})

document.addEventListener('DOMContentLoaded', function () {
  var inputs = document.querySelectorAll("[id^='type'], [id^='date-of-birth-id']");

  inputs.forEach(function (input) {
    input.addEventListener('keyup', function () {
      validateForm()
    })

  });
});


function validateForm() {
  const dateTimeInput = document.querySelector("#date-of-birth-id");
  const placeInput = document.getElementById("typePlaceOnEarch");

  const dateDiv = document.querySelector("#dateDiv");
  const placeDiv = document.getElementById("placeDiv");

  // Fjern tidligere varsler
  dateDiv.classList.remove("alert-danger", "alert-success");
  placeDiv.classList.remove("alert-danger", "alert-success");

   dateValue = dateTimeInput.value;
   placeValue = placeInput.value;

  // Validering av dato
  const dateValid = dateValue.length > 2;
  if (dateValid) {
    dateDiv.classList.add("alert-success");
  } else {
    dateDiv.classList.add("alert-danger");
  }

  // Validering av sted
  const placeValid = placeValue.length >= 2;
  if (placeValid) {
    placeDiv.classList.add("alert-success");
  } else {
    placeDiv.classList.add("alert-danger");
  }

  // Returner status basert på valideringene
  return dateValid && placeValid ? "continue" : "wait";
}


function startFakeProgressBar(vimeoId) {

  progressBarRunning = true;
  // Show the progress container
  document.getElementById('myProgress').style.display = 'block';

  // Set initial values
  let progressBar = document.getElementById('myBar');
  let duration = 3000; // 3 seconds
  let intervalTime = 50; // Time between increments (50ms)
  let width = 0;

  // Calculate how much to increase the progress bar per interval
  let increment = (100 / (duration / intervalTime));

  // Start interval to simulate progress
  let progressInterval = setInterval(() => {

    document.getElementById("goToContact").addEventListener("click", function() {
      document.getElementById('myProgress').style.display = 'none';
      clearInterval(progressInterval);
      
  });

  document.getElementById("new-video").addEventListener("click", function() {
    document.getElementById('myProgress').style.display = 'none';
    clearInterval(progressInterval);
   
  
});

document.getElementById("header-logo").addEventListener("click", function() {
  document.getElementById('myProgress').style.display = 'none';
  clearInterval(progressInterval);

});


    if (width >= 100) {
      progressBarRunning = false;
      clearInterval(progressInterval); // Stop when progress is complete

      // Hide the progress bar after completion
      document.getElementById('myProgress').style.display = 'none';

      // Call embedVideo with the Vimeo ID
      if(window.location.origin =="http://localhost:3000")
      {window.location.href = `http://localhost:3000?id=${vimeoId}`
      }else{
        window.location.href = `http://kibirdy.com?id=${vimeoId}`
      }

    } else {
      width += increment;
      progressBar.style.width = width + '%';
    }
  }, intervalTime);
}

function stopVimeoVideo() {

  var iframe = document.getElementById('myIframe');
  if(iframe){
  var vimeoPlayer = new Vimeo.Player(iframe);

  vimeoPlayer.pause().then(function() {
    // Videoen er sat på pause
  }).catch(function(error) {
    console.error('Error pausing the video:', error);
  });
}
}



function callGoogleMap() {

  // Find HTML-elementet, hvor kortet skal vises
  var mapElement = document.getElementById("map");

  // Opret kortet
  var map = new google.maps.Map(mapElement, {
    zoom: 8,
    zoomControl: false, // Fjern zoom-knapperne
    streetViewControl: false, // Fjern Pegman-kontrollen
    mapTypeControl: false, // Fjern kort- og satellitmulighederne
    fullscreenControl: false, // Fjern fuldskærmkontrollen
    mapTypeControlOptions: {
      mapTypeIds: [] // Fjern bjælken med tastaturgenveje og servicevilkår
    },
    center: {
      lat: lat,
      lng: lon
    }, // Angiv startpositionen
    styles: [{
        "elementType": "geometry",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      }
    ]

  });
  // Angiv positionen, som kortet skal zoome ind på
  var position = {
    lat,
    lon
  };

  map.setZoom(11);
  map.setCenter(position);


google.maps.event.addListener(map, 'idle', function () {
  const center = map.getCenter();
  lat = center.lat();
  lon = center.lng();
  console.log("Nye koordinater: lat: " + lat + ", lon: " + lon);

  // Hvis du vil hente data baseret på de nye koordinater, kan du tilføje en funktion her
  fetchNewData(lat, lon);
});
}

function fetchNewData(lat, lon) {
// Her kan du foretage et API-kald eller opdatere data baseret på de nye lat og lon
console.log('Fetching new data for:', lat, lon);
// Eksempelvis kunne du kalde en funktion som `getAstroData()` her
}

function adjustButtonClass() {
  var button = document.querySelector('.btn-lg');
  if (window.innerHeight <= 667) {
    button.classList.remove('btn-lg');
    button.classList.add('btn-sm');
  } else {
    button.classList.remove('btn-sm');
    button.classList.add('btn-lg');
  }
}

window.addEventListener('resize', adjustButtonClass);
window.addEventListener('load', adjustButtonClass);



function createShareLinks(url) {
  const encodedUrl = encodeURIComponent(url);

  // Facebook Share Link
  const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  // Instagram does not support direct sharing via URL, so we can only share the profile link
  const instagramLink = `https://www.instagram.com/`; // Instagram has no URL sharing option like Facebook

  // TikTok does not have a direct sharing URL. You can link to TikTok's website or your profile.
  const tiktokLink = `https://www.tiktok.com/share?url=${encodedUrl}`; // Use this format to share TikTok links


  // You can now dynamically insert these links into your page
document.getElementById('facebook-share').setAttribute('href', facebookLink);
document.getElementById('instagram-share').setAttribute('href', instagramLink);
document.getElementById('tiktok-share').setAttribute('href', tiktokLink);

}


// Når du viser en card, skal du sikre dig, at containeren også justeres
$(".card").on('show', function() {
  $(this).parent().css('height', 'auto');
});


async function callAllKibirdyAstroData(dateObject, searchQuery) {
  try {
    const response = await fetch('/all-kibirdy-astro-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dateObject, searchQuery })
    });

    if (!response.ok) {
      throw new Error('Network response was not ok' + response.statusText);
    }

    const responseData = await response.json();

    vimeoId = responseData.kibirdyComHoroscope.vimeoId

    lat = responseData.lat
    lon = responseData.lon

    callGoogleMap();

  
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
