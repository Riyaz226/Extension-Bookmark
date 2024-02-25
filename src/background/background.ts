chrome.runtime.onInstalled.addListener(() => {
  console.log('I just installed my chrome extension');
})

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeBookmark') {
    const { bookmarkData } = request;
    console.log('Received Bookmark Data:', bookmarkData);
    sendResponse({ message: 'Bookmark data received successfully' });
  }
});

let bookmarks = {};

chrome.storage.local.get('bookmarks', function (result) {
  bookmarks = result.bookmarks || {};
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeBookmark') {
    const { uniqueName, url } = request.bookmarkData;
    if (bookmarks[uniqueName]) {
      bookmarks[uniqueName].url = url;
    } else {
      bookmarks[uniqueName] = { url };
    }

    chrome.storage.local.set({ bookmarks }, () => {
      sendResponse({ message: 'Bookmark data updated successfully' });
    });

    return true;
  } else if (request.action === 'getBookmarks') {
    sendResponse({ bookmarks });
  } else if (request.action === 'shortcutDeleted') {
    const { shortcut } = request;

    delete bookmarks[shortcut];

    chrome.storage.local.set({ bookmarks }, () => {
      console.log(`Bookmark ${shortcut} deleted`);
      sendResponse({ message: `Bookmark ${shortcut} deleted successfully` });
    });

    return true;
  }
});

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  const suggestions = [];

  for (const uniqueName in bookmarks) {
    if (uniqueName.includes(text)) {
      suggestions.push({
        content: uniqueName,
        description: bookmarks[uniqueName].url
      });
    }
  }

  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const trimmedText = text.trim().toLowerCase();

  if (trimmedText in bookmarks) {
    chrome.tabs.update({ url: bookmarks[trimmedText].url });
  } else {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
    chrome.tabs.update({ url: searchUrl });
  }
});
