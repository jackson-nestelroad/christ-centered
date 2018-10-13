// This program converts Open Weather API's weather code to an icon-equivalent

// Define our exports object
let exports = module.exports = {};

// Weather code to icon conversion 
const icons = {
    200: "storm-showers",
    201: "thunderstorm",
    202: "thunderstorm",
    210: "lightning",
    211: "lightning",
    212: "lightning",
    221: "lightning",
    230: "storm-showers",
    231: "storm-showers",
    232: "thunderstorm",
    300: "showers",
    301: "showers",
    302: "rain",
    310: "showers",
    311: "showers",
    312: "rain",
    313: "showers",
    314: "rain",
    315: "showers",
    500: "showers",
    501: "rain",
    502: "rain",
    503: "rain",
    504: "rain",
    511: "snow",
    520: "showers",
    521: "showers",
    522: "rain",
    531: "showers",
    600: "snow",
    601: "snow",
    602: "snow",
    611: "sleet",
    612: "sleet",
    615: "rain-mix",
    616: "rain-mix",
    620: "snow",
    621: "snow",
    622: "snow",
    701: "fog",
    711: "smoke",
    721: "day-haze",
    731: "dust",
    741: "fog",
    751: "sandstorm",
    761: "dust",
    762: "volcano",
    771: "rain-wind",
    781: "tornado",
    800: "clear",
    801: "partly-cloudy",
    802: "cloudy",
    803: "cloudy",
    804: "cloudy"
}

// Weather codes that do not depend on the time of day
const neutral = [
    711,
    721,
    731,
    751,
    761,
    762,
    781
]

// Function to convert a weather code into its icon-equivalent
exports.getIcon = id => {
    const date = new Date();
    const time = date.getHours();
    let timeOfDay = 'day';
    // 8:00 PM to 6:00 AM is our night time
    if(time >= 20 || time < 6){
        timeOfDay = 'night-alt';
    }

    // Get the icon-equivalent
    let icon = icons[id];
    let string = 'weather-icon-wi-';

    // If we did not find any icon-equivalent
    if(!icon)
        return false;

    // If this code is neutral
    if(neutral.includes(id)){
        string += icons[id];
    }

    // If this code depends on the time of day
    else{
        string += `${timeOfDay}-${icons[id]}`;
    }

    // Return the string for the weather icon
    return string;
}