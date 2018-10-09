// This file renders our React component in the react div element.

// Import necessary modules
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
// import registerServiceWorker from './registerServiceWorker';

// Render our app, sending the style as a property to be used
ReactDOM.render(<App />, document.getElementById('react'));
// registerServiceWorker();
