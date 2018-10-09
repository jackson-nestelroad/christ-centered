// This file creates the Day component which displays the current date.

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Day.css';                                                                     // CSS

// Create Day component
export class Day extends Component {

    // Get the current date
    getDate = () => {
        // Current date
        const date = new Date();

        // Array of all months
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        // Array of all days
        const days = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];

        // Define each part of the date
        let month = months[date.getMonth()];
        let day = date.getDate();
        let dayOfWeek = days[date.getDay()];
        let year = date.getFullYear();
    
        // Set state to hold the date
        this.setState({ date: `${dayOfWeek}, ${month} ${day}, ${year}` });
    }
    
    // Runs before component renders
    componentWillMount = () => {
        this.getDate();
    }

    // Render the Day component
    render = () => {
        return (
            <div className="Day">
                {this.state.date}
            </div>
        )
    }
}