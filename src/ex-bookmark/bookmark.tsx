import React, { useState, useEffect } from 'react';
import './bookmark.css';

const App = () => {
  const [shortcutName, setShortcutName] = useState('');
  const [url, setUrl] = useState('');
  const [isValidShortcut, setIsValidShortcut] = useState(true);
  const [touched, setTouched] = useState(false);
  const [touched2, setTouched2] = useState(false);
  const [existingShortcuts, setExistingShortcuts] = useState([]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentUrl = tabs[0]?.url || '';
      setUrl(currentUrl);
    });

    const storedShortcuts = Object.keys(localStorage).filter((key) => key.startsWith('r/'));
    setExistingShortcuts(storedShortcuts);
  }, []);

  const handleCreate = () => {
    if (isValidShortcut) {
      const shortcutNameWithoutPrefix = shortcutName.startsWith('r/') ? shortcutName.slice(2) : shortcutName;
      const uniqueName = `r/${shortcutNameWithoutPrefix}`;
  
      if (existingShortcuts.includes(uniqueName)) {
        setTouched2(true);
        alert('Shortcut with the same name already exists.');
      } else {
        const bookmarkData = { uniqueName, url };
        localStorage.setItem(uniqueName, JSON.stringify(bookmarkData));
        console.log('Stored Bookmark Data:', bookmarkData);
        alert('Congratulations! Shortcut created successfully.');

        chrome.runtime.sendMessage({ action: 'storeBookmark', bookmarkData });
      
      }
    } else {
      alert('Invalid shortcut name. Please start with "r/".');
    }
  };

useEffect(() => {
    setIsValidShortcut(shortcutName.startsWith('r/'));
  }, [shortcutName]);

const handleManageClick = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
  };

 const handleShortcutNameChange = (e) => {
    setTouched(true);
    setShortcutName(e.target.value);
  };

  return (
    <>
      <div className="p-4 flex flex-col justify-center">
        <h3 className="text-xl text-center mb-4 flex items-center justify-between" style={{ fontSize: "14px" }}>
          <div className="flex items-center">
            <img src="./icon3.png" alt="" id="img" className="mr-2" />
            <p style={{ fontSize: "16px", color: "#202124" }}>Shortcuts</p>
          </div>

          <p style={{ color: "#202124", cursor: "pointer",textDecoration:"underline" }} onClick={handleManageClick}>
            Manage:
          </p>
        </h3>
        <hr />
        <input
          type="text"
          placeholder="shortcut-name"
          value={shortcutName}
          onChange={handleShortcutNameChange}
          className={`py-1 px-9 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2 w-full ${(touched2 && !isValidShortcut) ? 'border-red-500' : ''
            }`}
          style={{ fontSize: '14px' }}
        />
        {touched && !isValidShortcut && (
          <p className="text-red-500 text-sm mb-2">Shortcut must start with "r/".</p>
        )}

        {touched2 && !isValidShortcut && (
          <p className="text-red-500 text-sm mb-2">Shortcut with the same name already exists.</p>
        )}
        <input
          type="text"
          placeholder="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="py-1 px-9 border border-gray-300 rounded focus:outline-none focus:border-blue-500 mb-2 w-full"
          style={{ fontSize: '14px' }}
        />

      </div>
      <div className="flex justify-end" style={{ marginRight: "23px" }}>
        <button
          className="bg-white text-black py-1 px-4 mr-2 border border-brown-500 rounded focus:outline-none "
          style={{ borderColor: '#f7f9fd', fontSize: '14px' }}
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className={`bg-blue-800 text-white py-1 px-4 hover:bg-blue-600 focus:outline-none focus:bg-blue-600 rounded ${!isValidShortcut || existingShortcuts.includes(`r/${shortcutName}`) ? 'cursor-not-allowed' : ''
            }`}
          style={{ fontSize: '14px' }}
          disabled={!isValidShortcut || existingShortcuts.includes(`r/${shortcutName}`)}
        >
          Create
        </button>

      </div>
    </>
  );
};

export default App;

