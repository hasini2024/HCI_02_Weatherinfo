const mapContainer = $("#map-container");
let countryP = $(".country");
let idP = $(".temp_c");
let latP = $("#lat");
let lonP = $("#lon");
let nameP = $(".name");
let regionP = $(".region");
let urlP = $(".url");
let humidity = $(".humidity");
let tz_id = $(".tz_id");
let wind_kph = $(".wind_kph");
let img = document.getElementById("weatherIcon");
const apiKey = "4a758dd1aed04dc3950175920231609";

var map = L.map('map').setView([0, 0], 13);

var marker;

getLocation();


function darkMode() {
  var element = document.body;
  element.classList.toggle("dark-mode");
}
//--------------------------------------getCurrentPosition-----------------------------------
let latitude;
let longitude;
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  fetchWeatherData(latitude + "," + longitude);


  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  marker = L.marker([latitude, longitude]).addTo(map);
  marker.setLatLng([latitude, longitude]).update();
  map.setView([latitude, longitude]);

  const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;


    
  $.ajax({
    method: "GET",
    url: geoApiUrl,
    success: (resp) => {
      console.log('====================================');
      console.log(resp);
      console.log('====================================');
    }
  })
  
}





//-------------------------------------------handleSearch----------------------------------------

function handleSearch() {
  const location = document.getElementById("location-input").value;
  fetchWeatherData(location);
}
document.getElementById("search-button").addEventListener("click", handleSearch);

function fetchWeatherData(location) {
  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`,
    success: ({ location, current }) => {
      countryP.text(location.country);
      idP.text(current.temp_c.toLocaleString(undefined,{style:"unit",unit:"celsius"}));
      latP.text(location.lat);
      lonP.text(location.lon);
      nameP.text(location.name);
     let locationName = location.name;
      
      regionP.text(location.region);
      urlP.text(current.condition.text);
      humidity.text(current.humidity);
      tz_id.text(location.tz_id);
      wind_kph.text(current.wind_kph + "kph");
      img.src = current.condition.icon;

      marker.setLatLng([location.lat, location.lon]).update();
      map.setView([location.lat, location.lon]);
    }
  });
}


// -------------------------------------------------updateLocalTime-----------------------------

function updateLocalTime() {
  const localTimeElement = document.getElementById("local-time");
  const now = new Date();
  const localTimeString = now.toLocaleTimeString();

  localTimeElement.textContent = `${localTimeString}`;
}

updateLocalTime();

setInterval(updateLocalTime, 1000);

//---------------------------------------------------searchForecast-------------------------------------
function searchForecast() {
  const startDateInput = document.getElementById('startDate').value;
  const endDateInput = document.getElementById('endDate').value;

  // Input validation
  if (!startDateInput || !endDateInput) {
    alert('Please select both start and end dates.');
    return;
  }

  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert('Invalid date(s) provided.');
    return;
  }

  if (startDate > endDate) {
    alert('Start date cannot be after the end date.');
    return;
  }

  // Calculate number of days
  const timeDiff = endDate - startDate;
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  // Generate weather data for the date range
  generateWeatherForecast(startDate, daysDiff + 1);
}

function generateWeatherForecast(startDate, numDays) {
  const forecastTableBody = document.getElementById('forecastTableBody');
  forecastTableBody.innerHTML = ''; // Clear existing data

  const weatherTypes = [
    {  description: 'Cloudy' },
    {  description: 'Thunderstorm' },
    {  description: 'Partly Cloudy' },
    {  description: 'Windy Night' },
    {  description: 'Stormy' }
  ];

  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);

    // Select a random weather type
    const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];

    // Add row to table
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${currentDate.toISOString().split('T')[0]}</td>
      <td>${weather.description}</td>
    `;
    forecastTableBody.appendChild(row);
  }
}

// ------------------------------------getWeatherTimeLine---------------------------------

function getWeatherTimeLine(startDate, endDate) {

  console.log(startDate,endDate);

  const imgIds = ["img1", "img2", "img3", "img4", "img5", "img6", "img7"];
  const titleClasses = [".title1", ".title2", ".title3", ".title4", ".title5", ".title6", ".title7"];
  const dateIds = ["date1", "date2", "date3", "date4", "date5", "date6", "date7"];
  $.ajax({
    method: "GET",
    url: `https://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${"Panadura"}&dt=${startDate}&end_dt=${endDate}`,
    success: (resp) => {
      for (let i = 0; i < 7; i++) {
        const forecastDay = resp['forecast']['forecastday'][i]['day'];

        const img = document.getElementById(imgIds[i]);
        const title = document.querySelector(titleClasses[i]);
        const date = document.getElementById(dateIds[i]);

        img.src = forecastDay['condition']['icon'];
        title.innerHTML = forecastDay['condition']['text'];
        date.innerHTML = resp['forecast']['forecastday'][i]['date'];
      }
    }
  });
}



news();

// You should only use the Developer plan if your project is in development.

// If your project is being used in production, please upgrade to a paid plan.

function news(){
  let imgN1 = document.getElementById('imgN1');
  let imgN2 = document.getElementById('imgN2');
  let imgN3 = document.getElementById('imgN3');
  
  let title1 = document.getElementById('title1');
  let title2 = document.getElementById('title2');
  let title3 = document.getElementById('title3');
  
  let a1 = document.getElementById('a1');
  let a2 = document.getElementById('a2');
  let a3 = document.getElementById('a3');
  
  let p1 = document.getElementById('p1');
  let p2 = document.getElementById('p2');
  let p3 = document.getElementById('p3');
  
  let ptime1=document.getElementById('ptime1');
  let ptime2=document.getElementById('ptime2');
  let ptime3=document.getElementById('ptime3');
  
  $.ajax({
    method : "GET",
    url : `https://newsapi.org/v2/everything?q=Apple&from=2023-10-01&sortBy=popularity&apiKey=8c3c23f0ce854f9b9e4a8e73ddca6c06`,
    success : (data) =>{
      console.log(data);
      imgN1.src=data['articles'][0]['urlToImage'];
      imgN2.src=data['articles'][1]['urlToImage'];
      imgN3.src=data['articles'][2]['urlToImage'];
  
      title1.innerHTML=data['articles'][0]['title'];
      title2.innerHTML=data['articles'][1]['title'];
      title3.innerHTML=data['articles'][2]['title'];
  
      a1.href = data['articles'][0]['url'];
      a2.href = data['articles'][1]['url'];
      a3.href = data['articles'][2]['url'];
  
      p1.innerHTML = data['articles'][0]['description'];
      p2.innerHTML = data['articles'][1]['description'];
      p3.innerHTML = data['articles'][2]['description'];
  
      ptime1.innerHTML=data['articles'][0]['publishedAt'];
      ptime2.innerHTML=data['articles'][1]['publishedAt'];
      ptime3.innerHTML=data['articles'][2]['publishedAt'];
    }
  
  });
}