import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './options.css';

const MyComponent = () => {
  const [shortcutName, setShortcutName] = useState('');
  const [url, setUrl] = useState('');
  const [isValidShortcut, setIsValidShortcut] = useState(true);
  const [touched, setTouched] = useState(false);
  const [touched2, setTouched2] = useState(false);
  const [existingShortcuts, setExistingShortcuts] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [editShortcutIndex, setEditShortcutIndex] = useState(null);
  const [listOfShortcuts, setListOfShortcuts] = useState([]);

  useEffect(() => {
    const storedShortcuts = Object.keys(localStorage).filter((key) => key.startsWith('r/'));
    setExistingShortcuts(storedShortcuts);
  }, []);

  const handleCreate = () => {
    if (shortcutNameExists(shortcutName)) {
      alert("Shortcut name already exists. Please choose a different name.");
      return;
    }

    if (isValidShortcut) {
      const shortcutNameWithoutPrefix = shortcutName.startsWith('r/') ? shortcutName.slice(2) : shortcutName;
      const uniqueName = `r/${shortcutNameWithoutPrefix}`;

      if (editShortcutIndex !== null) {
        const editedShortcuts = [...existingShortcuts];
        const oldShortcut = existingShortcuts[editShortcutIndex];
        editedShortcuts[editShortcutIndex] = uniqueName;
        setExistingShortcuts(editedShortcuts);

        const oldData = JSON.parse(localStorage.getItem(oldShortcut));
        localStorage.setItem(uniqueName, JSON.stringify({ ...oldData, url }));

        localStorage.removeItem(oldShortcut);
      } else if (existingShortcuts.includes(uniqueName)) {
        setTouched2(true);
        alert('Shortcut with the same name already exists.');
        return;
      }

      const storedShortcuts = Object.keys(localStorage).filter((key) => key.startsWith('r/'));
      if (storedShortcuts.includes(uniqueName)) {
        setTouched2(true);
        alert('Shortcut Update name Store.');
        return;
      }

      const bookmarkData = { uniqueName, url };
      localStorage.setItem(uniqueName, JSON.stringify(bookmarkData));
      alert('Congratulations! Shortcut created successfully.');
      handleClose();
      chrome.runtime.sendMessage({ action: 'storeBookmark', bookmarkData });
    } else {
      alert('Invalid shortcut name. Please start with "r/".');
    }
  };

  const handleEdit = (index) => {
    const shortcut = existingShortcuts[index];
    const shortcutData = JSON.parse(localStorage.getItem(shortcut));
    setShortcutName(shortcut);
    setUrl(shortcutData.url);
    setEditShortcutIndex(index);

    handleShow();

    chrome.runtime.sendMessage({
      action: 'storeBookmark',
      bookmarkData: {
        uniqueName: shortcut,
        url: shortcutData.url,
      },
    }, (response) => {
      console.log(response.message);

      chrome.runtime.sendMessage({ action: 'getBookmarks' }, (response) => {
        const updatedBookmarks = response.bookmarks;
        console.log('Updated Bookmarks:', updatedBookmarks);
        updateDisplay(updatedBookmarks);
      });
    });
  };
  const updateDisplay = (bookmarks) => {
    console.log('Displaying updated data:', bookmarks);
  };

  const handleDelete = (index) => {
    const shortcut = existingShortcuts[index];
    localStorage.removeItem(shortcut);
    const updatedShortcuts = existingShortcuts.filter((_, i) => i !== index);
    setExistingShortcuts(updatedShortcuts);

    chrome.runtime.sendMessage({ action: 'shortcutDeleted', shortcut }, (response) => {
      console.log(response.message);
    });
  };

  const shortcutNameExists = (name) => {
    return listOfShortcuts.some((shortcut) => shortcut.name === name);
  };

  const handleClose = () => {
    setShortcutName('');
    setUrl('');
    setTouched(false);
    setTouched2(false);
    setEditShortcutIndex(null);
    setShow(false);
  };

  const handleClose2 = () => {
    setShortcutName('');
    setUrl('');
    setShow2(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShow2 = () => {
    setShow2(true);
  };

  const handleShortcutNameChange = (e) => {
    setTouched(true);
    setShortcutName(e.target.value);
    setIsValidShortcut(e.target.value.startsWith('r/'));
  };

  return (
    <>
      <h3>Open Side Panel to See All Shortcuts:</h3>
      <div id="his">
        <div id="fl">
          <p>
            <input
              type="text"
              className="rounded border border-gray-300 rounded-md py-1 px-1 pr-10 focus:outline-none focus:border-blue-500"
              placeholder="Search"
            />{' '}
          </p>
          <p>
            <button
              style={{
                borderRadius: '4px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                height: '33px',
                width: '68px',
              }}
              onClick={handleShow2}
            >
              Create
            </button>
          </p>
          <p>
            <button
              style={{
                borderRadius: '4px',
                color: 'black',
                border: 'none',
                height: '33px',
                width: '38px',
              }}
            >
              <MoreVertIcon />
            </button>
          </p>
        </div>
        <table style={{ width: '90%' }}>
          <thead>
            <tr>
              <th>SHORTCUT</th>
              <th>DESTINATION</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {existingShortcuts.map((shortcut, index) => {
              const shortcutData = JSON.parse(localStorage.getItem(shortcut));
              return (
                <tr key={shortcut}>
                  <td>{shortcut}</td>
                  <td>{shortcutData.url}</td>
                  <td>
                    <EditIcon
                      style={{ fontSize: '16px', cursor: 'pointer' }}
                      onClick={() => handleEdit(index)}
                    />
                  </td>
                  <td>
                    <DeleteIcon
                      style={{ fontSize: '19px', color: 'red', cursor: 'pointer' }}
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Update */}
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Body id="bo">
          <img src="./icon3.png" alt="" />
          <div>
            <h2 style={{ fontSize: '18px' }}>{editShortcutIndex !== null ? 'Edit Shortcut' : 'Create Shortcut'}</h2>
            <input
              type="text"
              placeholder="shortcut-name"
              value={shortcutName}
              onChange={handleShortcutNameChange}
              style={{ fontSize: '14px' }}
            />
            {touched && !isValidShortcut && (
              <p className="text-red-500 text-sm">Shortcut must start with "r/".</p>
            )}

            {touched2 && !isValidShortcut && (
              <p className="text-red-500 text-sm">Shortcut with the same name already exists.</p>
            )}
            <input
              type="text"
              placeholder="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" style={{ backgroundColor: 'blue', fontSize: '14px' }} onClick={handleCreate}>
            {editShortcutIndex !== null ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Insert */}
      <Modal show={show2} onHide={handleClose2} animation={false}>
        <Modal.Body id="bo">
          <img src="./icon2.png" alt="" />
          <div>
            <h2 style={{ fontSize: '18px' }}>Insert</h2>
            <input
              type="text"
              placeholder="shortcut-name"
              value={shortcutName}
              onChange={(e) => setShortcutName(e.target.value)}
              style={{ fontSize: '14px' }}
            />
            <input
              type="text"
              placeholder="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ fontSize: '14px' }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose2}>
            Cancel
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: 'blue', fontSize: '14px' }}
            onClick={handleCreate}
            disabled={!shortcutName.startsWith('r/')}
          >
            Insert
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
