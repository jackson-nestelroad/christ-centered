// This file creates the Weather component.

// This comment is needed for React to compile code using the Chrome API
/*global chrome*/

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Weather.css';                                                                 // CSS
import './Weather-Font.css';                                                            // Weather Icons font
import https from 'https';                                                              // Creates HTTPS requests
import Config from '../../assets/config.json';                                          // API Keys
import getIcon from './GetIcon.js';

export class Weather extends Component {
    
    // Construct our properties and state
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            error: false
        }
    }

    // Function to get and set the weather from storage or API
    setWeather = () => {
        // If we don't have the option to get location
        if(!navigator.geolocation)
        {
            this.setState({ error: true });
            return;
        }
        // Get our our weather data from Chrome storage API
        chrome.storage.sync.get(['lastCheckedWeather', 'temperature', 'location', 'icon'], data => {
            const date = new Date();
            const now = date.getTime();

            // If the data has been checked within the last 15 minutes, we don't need to retrieve the weather again
            // This time limit may change. I only get 60 API calls per minute, so I have to be a bit careful here
            // if(now - data.lastCheckedWeather < 60 * 60 * 1000){\
            if(now - data.lastCheckedWeather < 15 * 60 * 1000){
                console.log('used storage', data);
                this.setState({
                    temperature: data.temperature,
                    location: data.location,
                    icon: data.icon,
                    loaded: true
                });
            }
            // If it has been at least an hour, we need to update the weather
            else{
                // Send a message to our background script to get the user's location
                chrome.runtime.sendMessage({ command: 'getLocation' }, response => {
                    let coordinates = response.coordinates;

                    // Options for our GET request
                    const options = {
                        hostname: 'api.openweathermap.org',
                        path: `/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${Config.APIKeys['Open Weather Map']}`,
                        method: 'GET'
                    }

                    // Create the request, retrieve our raw data
                    const request = https.request(options, response => {
                        response.setEncoding('utf8');
                        let rawData = '';
                        response.on('data', chunk => { 
                            rawData += chunk; 
                        });

                        // When we are finished getting data
                        response.on('end', () => {
                            // Our raw data is given in JSON format
                            const Weather = JSON.parse(rawData);
                            
                            // If API request failed
                            if(Weather.cod == 400){
                                this.setState({ error: true });
                                return;
                            }

                            // Get all the data we need from the API request
                            let temperature = {
                                C: Weather.main.temp - 273.15
                            }
                            temperature.F = (temperature.C * 9/5) + 32;
                            let location = Weather.name;
                            let description = Weather.weather[0].id;

                            // Get the icon-equivalent of the description given
                            let icon = getIcon.getIcon(description);
                            // If there is no icon for this weather code
                            if(!icon){
                                this.setState({ error: true });
                                return;
                            }

                            console.log(temperature, location, icon);

                            // Get the current time
                            const date = new Date();
                            const now = date.getTime();

                            // Save our data in storage to reuse it
                            chrome.storage.sync.set({
                                temperature: temperature,
                                location: location,
                                icon: icon,
                                lastCheckedWeather: now
                            });

                            // Update our state so the data can be rendered
                            this.setState({
                                temperature: temperature,
                                location: location,
                                icon: icon,
                                loaded: true
                            });
                        });
                    })
                    
                    // If there is an error in our request
                    request.on('error', err => {
                        console.error(err);
                    })
                    
                    // End our request when done
                    request.end();
                })
            }
        })
    }
        

    // Function to run immediately before component mounts
    componentWillMount = () => {
        this.setWeather();
    }

    render = () => {
        // If the weather hasn't loaded yet
        if(!this.state.loaded){
            return(
                <div className="Weather unloaded">
                    <span className="Icon"></span>
                    <div className="Temperature"></div>
                    <div className="Location"></div>
                </div>
            )
        }
        // If the weather has loaded
        else{
            // Decide which temperature to display here - celsius vs fahrenheit
            let unit = 'F';
            let temperature = Math.round(this.state.temperature[unit]);

            // Return our HTML elements
            return (
                <div className="Weather loaded">
                    <span className={"Icon " + this.state.icon}></span>
                    <div className="Temperature">{temperature}°<sup class="unit">{unit}</sup></div>
                    <div className="Location">{this.state.location}</div>
                </div>
            )
        }
    }
}