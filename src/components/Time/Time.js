// This file creates the Time component which displays the current time (HH MM SS).

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Time.css';                                                                    // CSS

// Create Time component
export class Time extends Component {

    // Get the initial time
    getTime = () => {
        const date = new Date();

        // Create hours value
        let hours = date.getHours();
        hours -= hours > 12 ? 12 : 0;
        hours = hours === 0 ? 12 : hours;
        hours = hours < 10 ? '0' + hours : hours;

        // Create minutes value
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // Create seconds value
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Update state
        this.setState({ time: `${hours} ${minutes} ${seconds}` });
    }

    // Update the time through logic, not new Date() objects
    updateTime = () => {
        // Split each part of the time string
        let date = this.state.time.split(' ');
        date = date.map(value => parseInt(value, 10));
        
        // Variable definitions
        let hours = date[0];
        let minutes = date[1];
        let seconds = date[2];

        // Logic to increment the clock
        if(seconds === 59){
            if(minutes === 59){
                if(hours === 12)
                    hours = 1;
                else
                    hours += 1;
                minutes = 0;
            }
            else
                minutes += 1;
            seconds = 0;
        }
        else
            seconds += 1;

        // Readd trailing 0's
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Update state
        this.setState({ time: `${hours} ${minutes} ${seconds}` });
    }

    // Runs before component renders
    componentWillMount = () => {
        // Get initial time
        this.getTime();

        // Update the time every second
        this.interval = setInterval(this.updateTime, 1000);
    }

    // Runs before component is removed
    componentWillUnmount = () => {
        // Destroy the interval
        clearInterval(this.interval);
    }

    // Render the Time component
    render = () => {
        return (
            <div className="Time">{this.state.time}{this.props.children}</div>
        )
    }
}
