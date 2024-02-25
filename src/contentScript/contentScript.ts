chrome.runtime.sendMessage('I am loading content script', (response) => {
    console.log('I am content script')

})
// const checkUrlChange = () => {
//   const currentUrl = window.location.href;

//   if (currentUrl.includes('https://www.google.com/search')) {
//     const urlSearchParams = new URLSearchParams(window.location.search);
//     const searchQuery = urlSearchParams.get('q');

//     if (searchQuery) {
//       console.log('User searched for:', decodeURIComponent(searchQuery));
      
//     }
//   }
// };

chrome.runtime.sendMessage({ action: 'contentScriptLoaded' });
