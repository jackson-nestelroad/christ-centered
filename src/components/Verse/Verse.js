// This file creates the Verse component to display the Verse of the Day.

// This comment is needed for React to compile code using the Chrome API
/*global chrome*/

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Verse.css';                                                                   // CSS
import https from 'https';                                                              // Creates HTTPS requests

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

            const date = new Date();
            const startOfDay = new Date(`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`).getTime();

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
                    hostname: 'www.bible.com',
                    path: '/',
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

                        // Our raw data can be parsed as HTML
                        const parser = new DOMParser();
                        const YouVersionHTML = parser.parseFromString(rawData, 'text/html');
                        
                        // URL for the Verse of the Day
                        let url = YouVersionHTML.getElementsByClassName('votd-verse')[0].children[0].getAttribute('href');
                        url = 'https://www.bible.com' + url;

                        // Get the Verse and Reference from the HTML
                        let verse = YouVersionHTML.getElementsByClassName('votd-verse')[0].children[0].innerHTML;
                        let reference = YouVersionHTML.getElementsByClassName('votd-ref')[0].children[0].innerHTML;
                        reference = reference.substring(0, reference.indexOf('(') - 1);
                    
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
    componentDidMount = () => {
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
                <div className={"Bible" + (this.state.settingText == 'big' ? " big" : "") + (this.state.transition ? " transition" : " no-transition")}>
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