// This file creates the App container that houses each component.

 // Get imports
import React, { Component } from 'react';                                               // React Library
import data from '../assets/backgrounds/data.json';                                     // Background image data

import { Background } from '../components/Background/Background';                       // Background component
import { Time } from '../components/Time/Time';                                         // Time component
import { Day } from '../components/Day/Day';                                            // Day component
import { Verse } from '../components/Verse/Verse';                                      // Verse component

// Create App component
export default class App extends Component {
    
    // Get random background image
    // We use this to draw the image and cite it in the Source component
    componentWillMount = () => {
        this.setState({ image: data[Math.floor(Math.random() * data.length)].id})
    }

    // Render function, the whole app
    render = () => {
        return (
            <Background image={this.state.image}>
                <Time />
                <Day />
                <Verse />
            </Background>
        )
    }
}