import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faChain,
  faClose,
  faPlusCircle,
  faUpload,
  faVideo,
  faTrashAlt,
  faEllipsisV,
  faParagraph,
  faListUl,
  faCheckSquare,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

// ✅ ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

// ✅ Parse YouTube URLs into embed
const parseYouTubeUrl = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
};

const JobApplicationFormBuilder = () => {
  const [elements, setElements] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');

  // ✅ Add element handler
  const addElement = (type) => {
    let newElement = null;

    if (type === 'section') {
      newElement = {
        id: generateId(),
        type: 'section',
        content: {
          title: 'Untitled Section',
          description: 'Section description',
        },
      };
    } else if (type === 'text') {
      newElement = { id: generateId(), type: 'text', content: '' };
    } else if (type === 'multipleChoice') {
      newElement = { id: generateId(), type: 'multipleChoice', options: ['Option 1'] };
    } else if (type === 'image') {
      newElement = { id: generateId(), type: 'image', file: null };
    } else if (type === 'video') {
      newElement = {
        id: generateId(),
        type: 'video',
        content: parseYouTubeUrl(videoUrl) || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      };
    } else if (type === 'file') {
      newElement = { id: generateId(), type: 'file', file: null };
    }

    if (newElement) setElements([...elements, newElement]);
  };

  // ✅ Update element content
  const handleUpdateElement = (id, updates) => {
    setElements(elements.map(el => (el.id === id ? { ...el, ...updates } : el)));
  };

  // ✅ Delete element
  const handleDeleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id));
  };

  // ✅ Update type (used for multipleChoice / text etc.)
  const updateElementType = (id, newType) => {
    setElements(elements.map(el => (el.id === id ? { ...el, type: newType } : el)));
  };

  return (
    <div className="container mt-4">
      <h3>Job Application Form Builder</h3>

      {/* ✅ Add buttons */}
      <div className="mb-3">
        <button className="btn btn-primary m-1" onClick={() => addElement('section')}>
          Add Section
        </button>
        <button className="btn btn-secondary m-1" onClick={() => addElement('text')}>
          <FontAwesomeIcon icon={faParagraph} /> Add Text
        </button>
        <button className="btn btn-info m-1" onClick={() => addElement('multipleChoice')}>
          <FontAwesomeIcon icon={faListUl} /> Add Multiple Choice
        </button>
        <button className="btn btn-warning m-1" onClick={() => addElement('image')}>
          <FontAwesomeIcon icon={faUpload} /> Add Image
        </button>
        <input
          type="text"
          placeholder="YouTube URL"
          className="form-control d-inline-block w-50 m-1"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button className="btn btn-danger m-1" onClick={() => addElement('video')}>
          <FontAwesomeIcon icon={faVideo} /> Add Video
        </button>
        <button className="btn btn-dark m-1" onClick={() => addElement('file')}>
          <FontAwesomeIcon icon={faChain} /> Add File
        </button>
      </div>

      {/* ✅ Render elements */}
      <div className="form-preview border p-3 rounded">
        {elements.map((element) => (
          <div key={element.id} className="mb-3 p-2 border rounded">
            {element.type === 'section' && (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Section Title"
                  value={element.content.title}
                  onChange={(e) =>
                    handleUpdateElement(element.id, {
                      content: { ...element.content, title: e.target.value },
                    })
                  }
                />
                <textarea
                  className="form-control"
                  placeholder="Section Description"
                  value={element.content.description}
                  onChange={(e) =>
                    handleUpdateElement(element.id, {
                      content: { ...element.content, description: e.target.value },
                    })
                  }
                />
              </>
            )}

            {element.type === 'text' && (
              <input
                type="text"
                className="form-control"
                placeholder="Text Question"
                value={element.content}
                onChange={(e) => handleUpdateElement(element.id, { content: e.target.value })}
              />
            )}

            {element.type === 'multipleChoice' && (
              <div>
                <select
                  className="form-control mb-2"
                  value={element.type}
                  onChange={(e) => updateElementType(element.id, e.target.value)}
                >
                  <option value="multipleChoice">Multiple Choice</option>
                  <option value="text">Short Answer</option>
                </select>
                {element.options.map((opt, idx) => (
                  <input key={idx} type="text" className="form-control mb-1" value={opt} readOnly />
                ))}
              </div>
            )}

            {element.type === 'image' && (
              <input type="file" className="form-control" accept="image/*" />
            )}

            {element.type === 'video' && (
              <div>
                <iframe
                  width="100%"
                  height="200"
                  src={element.content}
                  title="YouTube video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {element.type === 'file' && (
              <input type="file" className="form-control" />
            )}

            {/* ✅ Delete button */}
            <button
              className="btn btn-sm btn-outline-danger mt-2"
              onClick={() => handleDeleteElement(element.id)}
            >
              <FontAwesomeIcon icon={faTrashAlt} /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobApplicationFormBuilder;
