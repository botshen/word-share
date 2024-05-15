chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'share') { 
    try {
      const targetUrl = chrome.runtime.getURL("tabs/App.html")
      chrome.tabs.create({ url: targetUrl })
    } catch (error) {
      console.error(error)
    } 
  }
});
