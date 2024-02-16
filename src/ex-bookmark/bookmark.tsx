import React, { useState, useEffect } from 'react';
import StarPurple500Icon from '@mui/icons-material/StarPurple500';
import EditIcon from '@mui/icons-material/Edit';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './bookmark.css';

function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [linkName, setLinkName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(storedBookmarks);
  }, []);

  const saveBookmark = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const url = currentTab.url;
      const logo = fetchLogoForUrl(url);
      const newBookmark = { url, logo, name: linkName };
      const newBookmarks = [...bookmarks, newBookmark];
      setBookmarks(newBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));

      chrome.runtime.sendMessage({ action: 'saveBookmark', bookmark: newBookmark });
    });
  };
  
  const fetchLogoForUrl = (url) => {
    return 'https://example.com/logo.png';
  };

  const handleClose = () => {
    setShow(false);
    setSelectedBookmark(null);
  };

  const handleShow = (index) => {
    setSelectedBookmark(index);
    setShow(true);
    setLinkName(bookmarks[index].name);
  };

  const handleClick = () => {
    if (selectedBookmark !== null) {
      const updatedBookmarks = [...bookmarks];
      updatedBookmarks[selectedBookmark].name = linkName;
      setBookmarks(updatedBookmarks);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

      const bookmarkUrl = updatedBookmarks[selectedBookmark].url;
      chrome.runtime.sendMessage({ action: 'handleSearch', searchInput: linkName });
 }
    setShow(false);
    setSelectedBookmark(null);
  };
  
  // const searchAndOpenBookmark = (searchTerm) => {
  //   const matchingBookmark = bookmarks.find(bookmark => bookmark.name === searchTerm);
  
  //   if (matchingBookmark) {
  //     chrome.tabs.create({ url: matchingBookmark.url });
  //   }
  // };
  
  const searchAndOpenGoogle = (searchTerm) => {
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    chrome.tabs.create({ url: googleSearchUrl });
  };
  
  const handleSearch = () => {
    chrome.runtime.sendMessage({ action: 'handleSearch', searchInput: searchTerm });
    const matchingBookmark = bookmarks.find(bookmark => bookmark.name === searchTerm);
      if (matchingBookmark) {
      chrome.tabs.create({ url: matchingBookmark.url });
    } else {
      console.log('No matching bookmark found. Opening Google search page:', searchTerm);
      searchAndOpenGoogle(searchTerm);
    }
  };
    
  
  return (
    <>
      <div className="text-center">
        <h2 style={{ textDecoration: 'underline', marginTop: '8px' }}>Bookmark Extension:</h2>
        <button onClick={() => saveBookmark()}>
          Save Bookmark
          <StarPurple500Icon className="text-purple-500 hover:text-blue-500" />
        </button>
        <br/>
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Google Search...'
          />
          <button onClick={handleSearch}>:Search</button>
      </div>
      <hr />
      <div style={{ marginTop: '23px' }}>
      <span>
          <h3>Bookmarks:</h3>
          <h3 style={{ color: 'black' }}>More</h3>
        </span>
       <div className="rt">
          <table>
            <thead>
              <tr>
                <th colSpan={2}>Bookmark</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.map((bookmark, index) => (
                <tr key={index}>
                  <td>
                    <img src={bookmark.logo} alt="Logo" width="20" height="20" />
                  </td>
                  <td style={{ width: '345px' }}>
                    <a
                      href={bookmark.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: '#5d5d5d' }}
                    >
                      {bookmark.name}
                    </a>
                  </td>
                  <td>
                    <EditIcon style={{ fontSize: '13px', cursor: 'pointer' }} onClick={() => handleShow(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Body id="bo">
          <img src="./icon3.png" alt="" />
          <div>
            <h2 style={{ fontSize: "18px" }}>Bookmark added</h2>
            <input type="text" value={linkName} onChange={(e) => setLinkName(e.target.value)} />
            <input type="text" value={selectedBookmark !== null ? bookmarks[selectedBookmark].url : ''} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClick}>
            Done
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Bookmark;
