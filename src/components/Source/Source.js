// This file creates the Source component to cite the background image.

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Source.css';                                                                  // CSS

// Create Source component
export class Source extends Component {

    // Render the Source component
    render = () => {
        return (
            <div className="Source">
                <a href={this.props.source}>
                    {this.props.photographer}
                </a>
            </div>
        )
    }
}