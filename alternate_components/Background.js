// This file is an alternate version of Background.js.

// This file creates the Background component that houses the other components.

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Background.css';                                                              // CSS

// Create Background component
export class Background extends Component {

    // Construct our properties and state
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            error: false,
            background: {
                backgroundImage: 'none'
            },
            overlay: {
                opacity: 1
            }
        }
    }

    // Function to get background link
    getBackground = async () => {
        try{
            const link = require(`../../assets/backgrounds/${this.props.image}.jpeg`);
            return await link;
        } catch(err){
            throw new Error("Error loading background.");
        }
        
        // Alternative code for reference 
        // Would need to update path
        // return chrome.runtime.getURL(`/images/${this.props.image}.jpeg`)
    }

    // Function to run before component renders
    componentDidMount = () => {
        // Create new image
        const image = new Image();

        // Run when the image fully loads
        image.onload = () => {
            const background = {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.1) 100%), 
                                    url(${image.src})`
            }
            this.setState({ 
                loaded: true, 
                background: background,
                overlay: {
                    opacity: 0
                }
            });
        }

        // Run if the image fails to load
        image.onerror = () => {
            this.setState({ error: true })
        }
        
        // Get the random image and load it into our image object
        this.getBackground()
            .then(link => image.src = link)
            .catch(err => this.setState({ error: true }));
    }

    // Render the Background component
    render = () => {
        return (
            <div className="Background" style={this.state.background}>
                <div className="Overlay" style={this.state.overlay}></div>
                {this.props.children}
            </div>
        )
    }
}