// targeting all the elements being used
const zipCode = document.querySelector("#zip");
const feelings = document.querySelector("#feeling");
const generateBtn = document.querySelector("#generate");
const dateUI = document.querySelector("#date");
const tempUI = document.querySelector("#temp");
const contentUI = document.querySelector("#content");

// setting up a new date
let d = new Date();

// API base url and api key
const baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
const apiKey = "1c2e351c21575a4f8b902e05412724be";

// takes zipcode value and brings out weather data and display it in UI
generateBtn.addEventListener("click", async (e) => {
    // prevents the default mode
    e.preventDefault();

    // gets the zipcode value from html
    const zipCodeValue = zipCode.value;

    // calls the function passing the API url and key, zip code value
    await getWeatherData(baseURL, zipCodeValue, apiKey);

    fetch("weather").then((data) => createUi(data));
});

// Calls the api to get data, call our post server to store all the values
const getWeatherData = async (baseURL, zipCodeValue, key) => {
    // joining the parameter to form a url to call
    const apiUrl = `${baseURL + zipCodeValue},us&appid=${key}`;

    // calls the openweather api
    const res = await fetch(apiUrl);
    const feelingValue = feelings.value;

    try {
        const data = await res.json();

        // Changing temperature from kelvin to celcius by calling function
        const feelsLike = changeTemp(data.main.feels_like);
        const minTemp = changeTemp(data.main.temp_min);
        const maxTemp = changeTemp(data.main.temp_max);
        const temp = changeTemp(data.main.temp);

        const weatherData = {
            feelsLike: feelsLike,
            minTemp: minTemp,
            maxTemp: maxTemp,
            temp: temp,
            description: data.weather[0].description,
            name: data.name,
            feeling: feelingValue,
        };

        // calling our server to store all the data
        fetch("weather", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(weatherData),
        });
    } catch (error) {
        console.log("error", error);
    }
};

// helper function to change temp from kelvin to celcius
const changeTemp = (temp) => {
    return (temp - 273.15).toFixed(2);
};

// helper function to create UI and append it
const createUi = async (data) => {
    date = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

    try {
        const allData = await data.json();

        const feeling = !allData.feeling ? "meh" : allData.feeling;

        dateUI.innerHTML = `<b>Date:<b> ${date}`;
        tempUI.innerHTML = `<b>Temp:</b> ${allData.temp}c`;

        const content = `
                <div><b>City:</b> ${allData.name}</div>
                <div><b>Description:</b> ${allData.description}</div>
                <div><b>Min Temp:</b> ${allData.minTemp}c</div>
                <div><b>Max Temp:</b> ${allData.maxTemp}c</div>
                <div><b>Feels Like:</b> ${allData.feelsLike}c</div>
                <div>You are feeling ${feeling}.</div>
        `;

        contentUI.innerHTML = content;
    } catch (e) {
        console.log(e);
    }
};
