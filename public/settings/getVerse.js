// This script searches for a Bible verse on the YouVersion website.

// Input constants
const verseInput = document.getElementById('Verse-Setting');
let enter = true;
let lastValue;

document.onkeydown = event => {
    var keyCode = event ? (event.which ? event.which : event.keyCode) : event.keyCode;
    // Enter key pressed
    if(keyCode == 13 && enter && verseInput.value != lastValue)
    {
        enter = false;
        lastValue = verseInput.value;
        getVerse(lastValue)
            // Verse returns
            .then(verse => {
                updateBorder(verseInput, true);
                // No verse, force a read of the Verse of the Day
                if(!verse)
                    chrome.storage.sync.set({ custom: false, lastCheckedVerse: 0 });
                // Save the custom verse
                else
                    chrome.storage.sync.set({ custom: lastValue, reference: verse[0], verse: verse[1], url: verse[2], lastCheckedVerse: 0 });
                enter = true;
            })
            // No results found
            .catch(() => {
                updateBorder(verseInput, false);
                enter = true;
            })
    }
}

// Function to send HTTP request to YouVersion search.
getVerse = (input) => {
    return new Promise((resolve, reject) => {
        let http = new XMLHttpRequest();
        http.onload = () => {
            // Document is ready to be parsed as HTML
            const parser = new DOMParser();
            const YouVersionHTML = parser.parseFromString(http.responseText, 'text/html');
            let results = YouVersionHTML.getElementsByClassName('search-result')[0];

            // No results
            if(!results)
                reject();

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
updateBorder = (input, good) => {
    if(good)
        input.style['border'] = 'solid 1px #12BC12';
    else
        input.style['border'] = 'solid 1px #FF6868';
}

// Update settings to reflect what is saved
window.addEventListener('load', () => {
    chrome.storage.sync.get(['custom'], data => {
        if(data.custom){
            lastValue = data.custom;
            verseInput.value = data.custom;
        }
    })
})