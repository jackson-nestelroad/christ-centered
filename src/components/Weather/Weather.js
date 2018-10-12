// This file creates the Weather component.

// This comment is needed for React to compile code using the Chrome API
/*global chrome*/

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Weather.css';                                                                 // CSS
import https from 'https';                                                              // Creates HTTPS requests
import Config from '../../assets/config.json';                                          // API Keys

export class Weather extends Component {
    
    // Construct our properties and state
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            error: false
        }
    }

    // Function to get and set the weather
    setWeather = () => {
        // If we don't have the option to get location
        if(!navigator.geolocation)
            return;
        
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
                    
                    // HANDLE OUR WEATHER HERE
                    console.log(Weather);
                });
            })
            
            // If there is an error in our request
            request.on('error', err => {
                console.error(err);
            })
            
            // End our request when done
            request.end();
        })


        // chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        //     console.log(tabs);
        //     chrome.tabs.sendMessage(tabs[0].id, { command: 'getLocation' }, response => {
        //         console.log(response);
        //     });
        // });
    }
        // chrome.runtime.sendMessage({ command: "getLocation" }, coordinates => {
        //     console.log(coordinates);
        

    componentWillMount = () => {
        this.setWeather();
    }

    render = () => {
        return <div className='Weather'></div>
    }
}