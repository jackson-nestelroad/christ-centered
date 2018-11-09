// This script searches for a Bible verse on the YouVersion website.

// Input constants
const verseInput = document.getElementById('Verse-Setting');
let enter = true;
let lastValue;

document.onkeydown = event => {
    var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;
    // Enter key pressed
    if(keyCode == 13 && enter && verseInput.value != lastValue){
        enter = false;
        updateBorder(verseInput, 'loading');
        updateText(verseInput, 'loading')
        lastValue = verseInput.value;
        getVerse(lastValue)
            // Verse returns
            .then(verse => {
                updateBorder(verseInput, 'good');
                updateText(verseInput, 'good');
                // No verse, force a read of the Verse of the Day
                if(!verse)
                    chrome.storage.sync.set({ settingCustom: false, lastCheckedVerse: 0 });
                // Save the custom verse
                else
                    chrome.storage.sync.set({ settingCustom: lastValue, reference: verse[0], verse: verse[1], url: verse[2], lastCheckedVerse: 0 });
                enter = true;
            })
            // No results found
            .catch(() => {
                updateBorder(verseInput, 'bad');
                updateText(verseInput, 'bad');
                enter = true;
            })
    }
}

// Function to send HTTP request to YouVersion search.
getVerse = input => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        http.onload = () => {
            // Document is ready to be parsed as HTML
            const parser = new DOMParser();
            const YouVersionHTML = parser.parseFromString(http.responseText, 'text/html');
            let results = YouVersionHTML.getElementsByClassName('search-result')[0];

            // No results
            // Early return to stop execution of the rest of the function
            if(!results){
                reject();
                return;
            }

            // Return result
            let verse = results.children[0].innerText.trim().split('\n\n\n');

            verse[0] = verse[0].substring(0, verse[0].indexOf('(') - 1);

            // Parse URL
            verse.push('https://www.bible.com' + results.children[0].children[0].children[0].getAttribute('href'));

            resolve(verse);
        }
        // No input, revert back to Verse of the Day
        if(verseInput.value == '')
            resolve(0);
        
        // Send our HTTP request
        http.open("GET", `https://www.bible.com/search/bible?q=${input}&category=bible&version_id=116`, true);
        http.send();
    })
}

// Function to update border of input dependoing on result
updateBorder = (input, result) => {
    if(result == 'good')
        input.style['border'] = 'solid 1px #12BC12';
    else if(result == 'loading')
        input.style['border'] = 'solid 1px #00A8D8';
    else
        input.style['border'] = 'solid 1px #FF6868';
}

// Function to update text below verse input depending on result
updateText = (input, result) => {
    let text = input.parentElement.lastElementChild;
    if(result == 'good')
        text.innerHTML = 'Saved!';
    else if(result == 'loading')
        text.innerHTML = 'Searching...';
    else
        text.innerHTML = 'No verse found!'
}

// Update settings to reflect what is saved
window.addEventListener('load', () => {
    chrome.storage.sync.get(['settingCustom'], data => {
        if(data.settingCustom){
            lastValue = data.settingCustom;
            verseInput.value = data.settingCustom;
        }
    })
})