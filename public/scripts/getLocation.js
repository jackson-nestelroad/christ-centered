// This script gets the user's coordinates.

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.command == 'getLocation'){
        navigator.geolocation.getCurrentPosition(position => {
            let coordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }
            sendResponse({ coordinates: coordinates });
        }, error => {
            console.error('Failed to get location', error);
        })
        // We need to return true here to tell the callback that this is asynchronous
        return true;
    }
});