const cityInput=document.querySelector("#cityInput");
const searchBtn=document.querySelector("#searchBtn");
const cityName=document.querySelector("#cityName");
const temperature=document.querySelector("#temperature");
const condition=document.querySelector("#condition");
const humidity=document.querySelector("#humidity");
const weatherIcon=document.querySelector("#weatherIcon");
const wind=document.querySelector("#wind");
const feelslike=document.querySelector("#feelslike");
const maxTemp=document.querySelector("#maxTemp");
const minTemp=document.querySelector("#minTemp");
const forecast=document.querySelector("#forecasts");


function getWeatherCondition(code) {
    if (code === 0) {
        return "Clear Sky";
    }
    if (code >= 1 && code <= 3) {
        return "Cloudy";
    }
    if (code >= 51 && code <= 67) {
        return "Rain";
    }
    if (code >= 71 && code <= 77) {
        return "Snow";
    }
    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }
    if (code >= 95 && code <= 99) {
        return "Thunderstorm";
    }
    return "Unknown";
}


function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code >= 1 && code <= 3) {
        return "🌤️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 95 && code <= 99) {
        return "⛈️";
    }

    return "🌤️";
}


function getDayName(dateString){
    const date=new Date(dateString);
    return date.toLocaleDateString("en-US",{weekday:"short"});
}


function formatDate(dateString){
    const date=new Date(dateString);
    return date.toLocaleDateString("en-US",{day:"2-digit",
    month:"short"});
}






cityInput.addEventListener("keydown",function(event){
    if(event.key=="Enter"){
        searchBtn.click();
    }
})

searchBtn.addEventListener("click",function(){
    const city=cityInput.value.trim();
    if(city===""){
        alert("Please enter a city name");
        return;
    }
    searchBtn.disabled=true;
    searchBtn.textContent="Searching..."
    condition.textContent="Loading...";
    forecast.innerHTML="";
    temperature.textContent="";
    humidity.textContent="";
    wind.textContent="";
    feelslike.textContent="";
    maxTemp.textContent="";
    minTemp.textContent="";
    weatherIcon.textContent="";
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    .then(response => { if(!response.ok){ throw new Error("Geocoding request failed");} return response.json();})
    .then(data => {
         if(!data.results||data.results.length===0){
            alert("City not found");
            return;
         }
         cityName.textContent=data.results[0].name;
         cityInput.value = "";
        const latitude=data.results[0].latitude;
        const longitude=data.results[0].longitude;
     return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code`)
    .then(response =>{ if(!response.ok){ throw new Error("Weather request failed");} return response.json();})
    .then(weatherdata => {
        temperature.textContent=weatherdata.current.temperature_2m+"°C";
        humidity.textContent="Humidity:"+weatherdata.current.relative_humidity_2m+"%";
        wind.textContent="Wind:"+weatherdata.current.wind_speed_10m+" km/h"
        feelslike.textContent="Feels like: "+weatherdata.current.apparent_temperature+"°C";
        maxTemp.textContent="Max: "+weatherdata.daily.temperature_2m_max[0];
        minTemp.textContent="Min: "+weatherdata.daily.temperature_2m_min[0];
        condition.textContent=getWeatherCondition(weatherdata.current.weather_code);
        weatherIcon.textContent=getWeatherIcon(weatherdata.current.weather_code);
        for(let i=0;i<7;i++){
            const card=document.createElement("div");
            card.classList.add("forecast-card");
            const dayElement=document.createElement("div");
            dayElement.textContent=getDayName(weatherdata.daily.time[i]);
            dayElement.classList.add("forecast-day");
            card.appendChild(dayElement);
            const dateElement=document.createElement("p");
            dateElement.textContent=formatDate(weatherdata.daily.time[i]);
            dateElement.classList.add("forecast-date");
            card.appendChild(dateElement);
            const maxTempElement=document.createElement("p");
            maxTempElement.textContent="Max:"+weatherdata.daily.temperature_2m_max[i]+"°C";
            maxTempElement.classList.add("forecast-max");
            const minTempElement=document.createElement("p");
            minTempElement.textContent="Min:"+weatherdata.daily.temperature_2m_min[i]+"°C";
            minTempElement.classList.add("forecast-min");
            const icon=document.createElement("div");
            icon.classList.add("forecast-icon");
            icon.textContent=getWeatherIcon(weatherdata.daily.weather_code[i]);
            card.appendChild(icon);
            card.appendChild(maxTempElement);
            card.appendChild(minTempElement);
            forecast.appendChild(card);
           
        }

    });    
    })
    .catch(error=>{
        alert("Unable to get weather data Please try again.");
    })
    .finally(()=>{
        searchBtn.disabled=false;
        searchBtn.textContent="Search";
    });
});
