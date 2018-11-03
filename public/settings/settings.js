// This script manages the extension's settings popup.

// Input constants
const timeInput = document.getElementById('Time-Input');
const timeSetting = document.getElementById('Time-Setting');

const tempInput = document.getElementById('Temp-Input');
const tempSetting = document.getElementById('Temp-Setting');

const textInput = document.getElementById('Text-Input');
const textSetting = document.getElementById('Text-Setting');

// Function to update a setting in the page
// updateSetting(<input>, children[][, { settingName: value }])
updateSetting = (input, options, setting) => {
    // If the input HTML element passed is checked
    if(input.checked){
        options[1].className = 'Option Left';
        options[2].className = 'Option Right selected';
    }
    // If the input HTML element is not checked
    else{
        options[1].className = 'Option Left selected';
        options[2].className = 'Option Right';
    }

    // If we are passed a settings object
    if(typeof(setting) === "object"){
        chrome.storage.sync.set(setting);
    }
}

// Dynamic styling for time switch
timeInput.addEventListener('change', () => {
    let time = timeInput.checked ? 24 : 12;
    updateSetting(timeInput, timeSetting.children, { settingTime: time });
})

// Dynamic styling for temperature swith
tempInput.addEventListener('change', () => {
    let temp = tempInput.checked ? 'C' : 'F';
    updateSetting(tempInput, tempSetting.children, { settingTemperature: temp });
})

// Dynamic styling for text switch
textInput.addEventListener('change', () => {
    let text = textInput.checked ? 'big' : 'small';
    updateSetting(textInput, textSetting.children, { settingText: text });
})

// Open <a href> links in a new tab
window.addEventListener('click', element => {
    if(element.target.href){
        chrome.tabs.create({ url: element.target.href });
    }
})

// Update settings to reflect what is saved
window.addEventListener('load', () => {
    chrome.storage.sync.get(['settingTime', 'settingTemperature', 'settingText'], data => {
        if(data.settingTime == 24){
            timeInput.checked = true;
            updateSetting(timeInput, timeSetting.children);
        }
        if(data.settingTemperature == 'C'){
            tempInput.checked = true;
            updateSetting(tempInput, tempSetting.children);
        }
        if(data.settingText == 'big'){
            textInput.checked = true;
            updateSetting(textInput, textSetting.children);
        }
    })
})
