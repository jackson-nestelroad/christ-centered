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
            style: {
                opacity: 0.5
            }
        }
    }

    // Function to get background link
    getBackground = async () => {
        try{
            const link = require(`../../assets/backgrounds/${this.props.image}-min.jpg`);
            return await link;
        } catch(err){
            throw new Error("Error loading background.");
        }
    }

    // Function to run before component renders
    componentWillMount = () => {
        // Create new image
        const image = new Image();

        // Run when the image fully loads
        image.onload = () => {
            const background = {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%,rgba(0, 0, 0, 0.75) 50%,rgba(0,0,0,0.1) 100%), 
                                    url(${image.src})`
            }
            this.setState({ loaded: true, style: background });
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
            <div className="Background" style={this.state.style}>
                {this.props.children}
            </div>
        )
    }
}