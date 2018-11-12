// This file creates the Time component which displays the current time (HH MM SS).

// This comment is needed for React to compile code using the Chrome API
/*global chrome*/

// Get imports
import React, { Component } from 'react';                                               // React Library
import './Time.css';                                                                    // CSS

// Create Time component
export class Time extends Component {

    // Construct our properties and state
    constructor(props) {
        super(props);
        this.state = {};
    }

    // Get our time preference from settings
    getSettingTime = () => {
        return new Promise(resolve => {
            chrome.storage.sync.get(['settingTime'], data => {
                let setting = data.settingTime ? data.settingTime : 12;
                resolve(setting);
            })
        })
    }

    // Get the initial time
    getTime = async () => {
        const date = new Date();

        // Create hours value
        let hours = date.getHours();
        let setting = await this.getSettingTime();
        
        // If we want to do 12 hour time, we have to edit our hours value a bit
        if(setting == 12){
            hours -= hours > 12 ? 12 : 0;
            hours = hours === 0 ? 12 : hours;
        }

        // Add a leading zero
        hours = hours < 10 ? '0' + hours : hours;

        // Create minutes value
        let minutes = date.getMinutes();
        minutes = minutes < 10 ? '0' + minutes : minutes;

        // Create seconds value
        let seconds = date.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Return time and time setting
        return {
            time: `${hours} ${minutes} ${seconds}`,
            setting: setting
        }
    }

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
    
        // Return string for the date
        return `${dayOfWeek}, ${month} ${day}, ${year}`;
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
        let setting = this.state.setting;

        // Logic to increment the clock
        if(seconds === 59){
            if(minutes === 59){
                if(setting === 12 && hours === 12)
                    hours = 1;
                else if(setting === 24 && hours === 23)
                    hours = 0;
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
    componentWillMount = async () => {
        // Get time and date
        let Time = await this.getTime();
        let date = this.getDate();

        // Set our state to display time and date
        this.setState({ 
            date: date,
            time: Time.time, 
            setting: Time.setting 
        });

        // Update time every second
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
            <div className="Now">
                <div className="Time">
                    {this.state.time}
                </div>
                <div className="Date">
                    {this.state.date}
                </div>
            </div>
        )
    }
}
