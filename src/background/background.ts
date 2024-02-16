chrome.runtime.onInstalled.addListener(() => {
    console.log('I just installed my chrome extension');
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveBookmark') {
    console.log('Received message to save bookmark:', message.bookmark);
    sendResponse({ success: true });
  } else if (message.action === 'handleSearch') {
    console.log('Received message to handle search:', message.searchInput);
    sendResponse({ success: true });
  }
  return true;
});