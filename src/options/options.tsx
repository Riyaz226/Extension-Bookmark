import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './options.css'

const MyComponent = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedBookmark, setSelectedBookmark] = useState(null);
  const [linkName, setLinkName] = useState('');

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
    }
    setShow(false);
    setSelectedBookmark(null);
  };

  const onDeleteBookmark = (index) => {
    const updatedBookmarks = [...bookmarks];
    updatedBookmarks.splice(index, 1);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };
return (
    <>
      <h3>Open Side to Panel see All Bookmarks:</h3>
      <div id="his">
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th rowSpan={2}>No</th>
              <th colSpan={2}>Bookmarks</th>
              <th rowSpan={2}>Items</th>
            </tr>
            <tr>
              <th>Rename</th>
              <th>Url</th>
            </tr>
          </thead>
          <tbody>
            {bookmarks.map((bookmark, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#5d5d5d' }}
                  >
                    {bookmark.name}
                  </a>
                </td>
                <td style={{ width: '345px' }}>
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: '#5d5d5d' }}
                  >
                    <img src={bookmark.logo} width="20" height="20" />{bookmark.url}
                  </a>
                </td>
                <td>
                  <EditIcon style={{ fontSize: '18px', cursor: 'pointer' }} onClick={() => handleShow(index)} />
                  <DeleteIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDeleteBookmark(index)} />
                  <AccountBoxIcon style={{ color: 'blue' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Body id="bo">
        <img src="./icon.png" alt="" />
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
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<MyComponent />);
