/*
    The function described below queries the API Geoapify, passing it
    latitude and longitude coordinates describing the user's location
    and retrieving the name of the user's city.
*/

let apiKey = require(".././api-keys.json")["geoapify"]["apiKey"];

export async function getCity() {
    const positionPromise = new Promise((r) => {
        navigator.geolocation.getCurrentPosition((pos) => {
            r(pos.coords);
        })
    })
    const userCoords = await positionPromise;
    const long = userCoords.longitude;
    const lat = userCoords.latitude;

    const requestURL = `https://api.geoapify.com/v1/geocode/reverse?` +
    `lat=${lat}&lon=${long}&apiKey=${apiKey}`;
    const requestOptions = {
        method: 'GET',
    };
    const geoapifyResponse = await fetch(requestURL, requestOptions);
    const jsonData = await geoapifyResponse.json();
    const cityName = jsonData["features"][0]["properties"]["city"];
    return cityName;
}