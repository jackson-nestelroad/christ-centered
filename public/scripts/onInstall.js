// This script intializes some settings when the app is intially installed.

chrome.runtime.onInstalled.addListener(details => {
    if(details.reason == 'install'){
        chrome.storage.sync.set({ settingTime: 12, settingTemperature: 'F', settingText: 'small' });
    }
    // chrome.storage.sync.get(['settingTime', 'settingTemperature'], data => {
    //     if(!data.settingTime && !data.settingTemperature){
    //         chrome.storage.sync.set({ settingTime: 12, settingTemperature: 'F' });
    //     }
    // })
    chrome.tabs.create({ url: "chrome://newtab" });
});