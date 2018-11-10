// This file is NOT used. It is for future use when the YouVersion API develops further.

// This file creates the Verse component to display the Verse of the Day.

// This comment is needed for React to compile code using the Chrome API
/*global chrome*/

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Verse.css';                                                                   // CSS
import https from 'https';                                                              // Creates HTTPS requests
import Secrets from '../../assets/secrets/token.json';                                  // YouVersion API Key

// Create Verse component
export class Verse extends Component {

    // Construct our properties and state
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            transition: false,
            verse: '',
            reference: '',
            url: '',
            settingText: false
        }
    }

    // Function to get the vere of the day from storage or bible.com
    getVerse = () => {
        // Get all of our verse data from Chrome storage API
        chrome.storage.sync.get(['lastCheckedVerse', 'verse', 'reference', 'url', 'settingCustom', 'settingText'], data => {

            // If we have a custom verse saved
            if(data.settingCustom){
                this.setState({ 
                    verse: data.verse, 
                    reference: data.reference, 
                    url: data.url, 
                    loaded: true,
                    settingText: data.settingText 
                });
                return;
            }

            const startOfDay = this.getStartOfDay();

            // If it is the same day, we don't need to retrieve the Verse of the Day again
            if(data.lastCheckedVerse == startOfDay){
                this.setState({ 
                    verse: data.verse, 
                    reference: data.reference, 
                    url: data.url, 
                    loaded: true, 
                    settingText: data.settingText 
                });
            }
            // If it is a different day, we need to update the Verse of the Day
            else if(data.lastCheckedVerse != startOfDay || !data.verse || !data.reference || !data.url){
                // Options for our GET request
                const options = {
                    hostname: 'developers.youversionapi.com',
                    path: `/1.0/verse_of_the_day/${this.getDayOfYear()}?version_id=1`,
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'x-youversion-developer-token': Secrets.API.YouVersion
                    }
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

                        const YouVersionJSON = JSON.parse(rawData);

                        let url = YouVersionJSON.verse.url;
                        let verse = YouVersionJSON.verse.text;
                        let reference = YouVersionJSON.verse.human_reference;
                    
                        // Store all of these items in Chrome storage (it is faster to retrieve them this way)
                        chrome.storage.sync.set({ 
                            verse: verse, 
                            reference: reference, 
                            url: url, 
                            lastCheckedVerse: startOfDay 
                        });

                        // Set our state
                        this.setState({ 
                            verse: verse, 
                            reference: reference, 
                            url: url, 
                            loaded: true,
                            settingText: data.settingText
                        });
                    });
                })
                
                // If there is an error in our request
                request.on('error', err => {
                    console.error(err);
                })
                
                // End our request when done
                request.end();
            }
        })
    }

    // Functon to get the beginning of the day in milliseconds
    getStartOfDay = () => {
        let date = new Date();
        return new Date(`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`).getTime();
    }

    // Function to get the current day of the year
    getDayOfYear = () => {
        // Beginning of today
        let today = new Date();
        today = new Date(`${today.getMonth() + 1}/${today.getDate() + 1}/${today.getFullYear()}`);

        // Beginning of the year
        let then = new Date(`1/1/${today.getFullYear()}`);

        // Difference between the two in days
        let difference = (today - then) / 1000 / 60 / 60 / 24;
        return difference;
    }

    // Function to get the font size for our Verse of the Day depending on its size
    getFontSize = () => {
        // One size fits all
        if(this.state.settingText == 'small'){
            // Add transition after a delay so the text doesn't grow on load
            if(!this.state.transition){
                setTimeout(() => {
                    this.setState({ transition: true });
                }, 500);
            }

            return { 
                fontSize: '20pt',
                textShadow: `0px 2.5px 1px rgba(0,0,0,0.5)`
            };
        }
        // Scale font depending on length of verse
        else{
            const length = this.state.verse.length;
            let size = 52;
            let shadow = 4;
            for(let k = 85; k <= 190; k += 35)
            {
                if(length > k)
                {
                    size -= 8;
                    shadow -= 0.5;
                }
            }
            let styleValue = size.toString() + 'pt';

            // Add transition after a delay so the text doesn't grow on load
            if(!this.state.transition){
                setTimeout(() => {
                    this.setState({ transition: true });
                }, 500);
            }

            // Return the style object for rendering
            return { 
                fontSize: styleValue,
                lineHeight: styleValue,
                textShadow: `0px ${Math.round(shadow)}px 1px rgba(0,0,0,0.5)`
            };
        }
    }

    // Function to run before component renders
    componentWillMount = () => {
        this.getVerse();
    }

    // Render the Verse component
    render = () => {
        // If the verse hasn't loaded yet
        if(!this.state.loaded){
            return (
                <div className="Bible unloaded">
                    <div className="Verse"></div>
                    <div className="Reference"></div>
                </div>
            )
        }
        // The verse has loaded
        else{
            document.title = this.state.reference;
            return (
                <div className={"Bible" + (this.state.settingText == 'big' ? " big" : "")}>
                    <div className={"Verse " + (this.state.transition ? "transition" : "no-transition")} style={this.getFontSize()}>
                        {this.state.verse}
                    </div>
                    <div className="Reference">
                        <a href={this.state.url}>{this.state.reference}</a>
                    </div>
                </div>
            )
        }
    }
}