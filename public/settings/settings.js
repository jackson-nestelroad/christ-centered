// This script manages the extension's settings popup.

// Input constants
const timeInput = document.getElementById('Time-Input');
const timeSetting = document.getElementById('Time-Setting');

const tempInput = document.getElementById('Temp-Input');
const tempSetting = document.getElementById('Temp-Setting');

// Dynamic styling for time switch
timeInput.addEventListener('change', () => {
    if(timeInput.checked){
        timeSetting.children[1].className = 'Option Left';
        timeSetting.children[2].className = 'Option Right selected';
    }
    else{
        timeSetting.children[1].className = 'Option Left selected';
        timeSetting.children[2].className = 'Option Right';
    }
})

// Dynamic styling for temperature swith
tempInput.addEventListener('change', () => {
    if(tempInput.checked){
        tempSetting.children[1].className = 'Option Left';
        tempSetting.children[2].className = 'Option Right selected';
    }
    else{
        tempSetting.children[1].className = 'Option Left selected';
        tempSetting.children[2].className = 'Option Right';
    }
})

// Open <a href> links in a new tab
window.addEventListener('click', element => {
    if(element.target.href){
        chrome.tabs.create({ url: element.target.href });
    }
})
