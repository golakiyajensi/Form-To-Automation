import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox, faChain, faClose, faPlusCircle, faT, faUpload, faVideo, faTrashAlt, faCopy, faEllipsisV, faTrash, faGripLines,
  faParagraph,
  faListUl,
  faCheckSquare,
  faChevronDown,
  faFileArrowUp,
  faRulerHorizontal,
  faStar,
  faThLarge,
  faTh,
  faCalendarAlt,
  faClock,
  faClipboardCheck
} from '@fortawesome/free-solid-svg-icons';
import { faImage, faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { Form, FormControl, FormCheck, FormSelect, Row, Col, Button, Modal, Dropdown } from 'react-bootstrap';
// import FormHeader from "./FormHeader.jsx";


export default function App() {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('Form description');
  const [elements, setElements] = useState([]);
  const [draggedElementId, setDraggedElementId] = useState(null);
  const [activeElementId, setActiveElementId] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const editorRefs = useRef({});
  const toolbarRef = useRef(null);
  const inputRef = useRef(null);

  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState("");

  const stripBidi = (s) => s.replace(/[\u200E\u200F\u202A-\u202E]/g, "");

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  const parseYouTubeUrl = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };


  const addElement = (type) => {
    let newElement;
    if (type === 'text') {
      newElement = { id: generateId(), type: 'text', content: 'Untitled Question', required: false };
    } else if (type === 'multiple_choice') {
      newElement = {
        id: generateId(),
        type: 'multiple_choice',
        content: 'Untitled Question',
        options: ['Option 1'],
        required: false,
      };
    } else if (type === 'image') {
      newElement = {
        id: generateId(),
        type: 'image',
        content: 'https://placehold.co/400x200/cccccc/000000?text=Image+Placeholder',
      };
    }
    else if (type === 'video') {
      newElement = {
        id: generateId(),
        type: 'video',
        content: parseYouTubeUrl(url) || "https://www.youtube.com/embed/dQw4w9WgXcQ",
      };
    }

    else if (type === 'file') {
      newElement = { id: generateId(), type: 'file', content: '' };
    }

    else if (type === 'section') {
      newElement = {
        id: generateId(),
        type: 'section',
        content: {
          title: 'Untitled Section',
          description: 'Section description',
        },
      };
    }
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleDragStart = (e, id) => {
    setDraggedElementId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedElementId === targetId) return;

    const newElements = [...elements];
    const draggedIndex = newElements.findIndex((el) => el.id === draggedElementId);
    const targetIndex = newElements.findIndex((el) => el.id === targetId);

    const [draggedItem] = newElements.splice(draggedIndex, 1);
    newElements.splice(targetIndex, 0, draggedItem);

    setElements(newElements);
    setDraggedElementId(null);
  };

  const handleFormat = (command, value) => {
    if (document.queryCommandSupported(command)) {
      document.execCommand(command, false, value);
    }
    const activeEl =
      editorRefs.current[activeElementId] || editorRefs.current['formTitle'];
    if (activeEl) {
      activeEl.focus();
    }
  };

  const handleFocus = (id) => {
    setActiveElementId(id);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const activeEl = document.activeElement;
      if (toolbarRef.current && !toolbarRef.current.contains(activeEl)) {
        setActiveElementId(null);
      }
    }, 10);
  };

  const updateQuestionContent = (elementId, content) => {
    const updated = elements.map((el) =>
      el.id === elementId ? { ...el, content: content } : el
    );
    setElements(updated);
  };

  const updateOption = (elementId, optionIndex, value) => {
    const updated = elements.map((el) =>
      el.id === elementId
        ? {
          ...el,
          options: el.options.map((opt, i) =>
            i === optionIndex ? value : opt
          ),
        }
        : el
    );
    setElements(updated);
  };

  const addOption = (elementId) => {
    const updatedElements = elements.map((el) => {
      if (el.id === elementId) {
        return {
          ...el,
          options: [...el.options, `Option ${el.options.length + 1}`],
        };
      }
      return el;
    });
    setElements(updatedElements);
  };

  const toggleRequired = (elementId) => {
    const updatedElements = elements.map((el) =>
      el.id === elementId ? { ...el, required: !el.required } : el
    );
    setElements(updatedElements);
  };

  // Image upload
  // Add these state variables at the top
  const [showImageModal, setShowImageModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState("");

  // Function to add an image element to the form
  const addImageElement = (url) => {
    if (!url) return;
    const newElement = {
      id: generateId(),
      type: "image",
      content: url,
    };
    setElements([...elements, newElement]);
  };

  // File upload handler
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addImageElement(url);
      setShowImageModal(false);
      setTempImageUrl("");
    }
  };

  // URL submit handler
  const handleImageUrlSubmit = () => {
    if (tempImageUrl.trim() !== "") {
      addImageElement(tempImageUrl.trim());
      setShowImageModal(false);
      setTempImageUrl("");
    }
  };

  const [activeInputId, setActiveInputId] = useState(null);

  const RichTextToolbar = () => (
    <div
      ref={toolbarRef}
      className="d-flex gap-2 py-2 border-0 toolbar"
      onMouseDown={(e) => e.preventDefault()}
    >
      <button className="toolbar-btn border-0" onClick={() => handleFormat('bold')} title="Bold">
        <b>B</b>
      </button>
      <button className="toolbar-btn border-0" onClick={() => handleFormat('italic')} title="Italic">
        <i>I</i>
      </button>
      <button className="toolbar-btn border-0" onClick={() => handleFormat('underline')} title="Underline">
        <u>U</u>
      </button>
      <button
        className="toolbar-btn border-0"
        onClick={() => {
          const url = prompt('Enter the URL:');
          if (url) handleFormat('createLink', url);
        }}
        title="Insert Link"
      >
        <FontAwesomeIcon icon={faChain} />
      </button>
      <button className="toolbar-btn border-0" onClick={() => handleFormat('removeFormat')} title="Remove Formatting">
        <FontAwesomeIcon icon={faClose} />
      </button>
    </div>
  );

  const FormElement = ({ element, onRemove }) => {
    const updateQuestionDescription = (elementId, newDescription) => {
      const updated = elements.map((el) =>
        el.id === elementId ? { ...el, description: stripBidi(newDescription) } : el
      );
      setElements(updated);
    };

    const updateElementTitle = (elementId, newTitle) => {
      const updated = elements.map((el) =>
        el.id === elementId ? { ...el, content: stripBidi(newTitle) } : el
      );
      setElements(updated);
    };
    return (
      <div
        className="form-element"
        draggable
        onDragStart={(e) => handleDragStart(e, element.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, element.id)}
      >
        {element.type === 'text' && (
          <div className="form-card p-4 my-3 rounded shadow-sm">
            {/* Title Input */}
            <input
              type="text"
              className="text-box mb-2 w-100"
              value={element.content}
              placeholder="Enter title"
              onFocus={() => setActiveInputId(`${element.id}-title`)}
              onBlur={() => setActiveInputId(null)}
              onChange={(e) => updateQuestionContent(element.id, e.target.value)}
              style={{
                border: "none",
                borderBottom: "1px solid #ccc",
                outline: "none",
                padding: "4px 0",
              }}
            />
            {activeInputId === `${element.id}-title` && <RichTextToolbar />}

            {/* Description Input */}
            <div
              contentEditable
              suppressContentEditableWarning={true}
              className="text-box mb-2 mt-2"
              onFocus={() => setActiveInputId(`${element.id}-description`)}
              onBlur={(e) => {
                setActiveInputId(null);
                updateQuestionDescription(element.id, e.currentTarget.textContent);
              }}
              style={{
                minHeight: "30px",
                border: "none",
                borderBottom: "1px solid #ccc",
                outline: "none",
                padding: "4px 0",
                color: !element.description ? "#2c2c2cff" : "#000",
              }}
            >
              {!element.description ? "Untitled description" : element.description}
            </div>

            {activeInputId === `${element.id}-description` && <RichTextToolbar />}
            {/* // Below your input (conditionally render description input) */}
            {element.showDescription && (
              <input
                type="text"
                className="text-box mb-2 mt-2 w-100"
                onFocus={() => setActiveInputId(`${element.id}-description1`)}
                value={element.description || ""}
                placeholder="Enter description"
                onChange={(e) => {
                  const updatedElements = elements.map((el) =>
                    el.id === element.id ? { ...el, description: e.target.value } : el
                  );
                  setElements(updatedElements);
                }}
              />
            )}

            {activeInputId === `${element.id}-description1` && <RichTextToolbar />}

            {/* Footer */}
            <div className="d-flex justify-content-end align-items-center pt-3 mt-3">
              <Button className="bg-transparent text-muted border-0" size="lg">
                <FontAwesomeIcon icon={faCopy} />
              </Button>
              <Button
                className="bg-transparent text-muted border-0"
                size="lg"
                onClick={() => onRemove(element.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
              <FormCheck
                type="switch"
                label="Required"
                checked={element.required}
                onChange={() => toggleRequired(element.id)}
                className="mx-3"
              />
              <Dropdown align="end">
                <Dropdown.Toggle as={Button} variant="light" className="border-0">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      // Example: toggle description for this element
                      const updatedElements = elements.map((el) =>
                        el.id === element.id
                          ? { ...el, showDescription: !el.showDescription }
                          : el
                      );
                      setElements(updatedElements);
                    }}
                  >
                    {element.showDescription ? "Remove Description" : "Add Description"}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        )}

        {element.type === 'multiple_choice' && (
          <div className="form-card p-4 my-3 rounded shadow-sm">
            <Row className="align-items-center mb-3">
              <Col xs={12} md={9}>
                <div
                  className="element-title text-box pb-2 w-75"
                  contentEditable
                  suppressContentEditableWarning
                  ref={(el) => (editorRefs.current[element.id] = el)}
                  onFocus={() => handleFocus(element.id)}
                  onBlur={(e) => {
                    handleBlur();
                    // Update element content only on blur
                    const updated = elements.map((el) =>
                      el.id === element.id
                        ? { ...el, content: e.target.innerHTML }
                        : el
                    );
                    setElements(updated);
                  }}
                  dangerouslySetInnerHTML={{ __html: element.content }}
                />
                {/* ✅ Description box after title */}
                {element.showDescription && (
                  <textarea
                    className="form-control mt-2"
                    placeholder="Enter description here..."
                    value={element.description}
                    onChange={(e) => {
                      const updated = elements.map((el) =>
                        el.id === element.id
                          ? { ...el, description: e.target.value }
                          : el
                      );
                      setElements(updated);
                    }}
                  />
                )}
              </Col>
              <Col xs={12} md={3} className="d-flex justify-content-end align-items-center mt-3 mt-md-0">
                <Button
                  variant="light"
                  className="me-2"
                  onClick={() => setShowImageModal(true)}
                >
                  <FontAwesomeIcon icon={faImage} />
                </Button>
                <FormSelect
                  className="w-auto"
                  value={element.type}
                  onChange={(e) => updateElementType(element.id, e.target.value)}
                >
                  <option value="short">Short Answer</option>
                  <option value="paragraph">Paragraph</option>
                  <option value="multiple">Multiple Choice</option>
                  <option value="checkboxes">Checkboxes</option>
                  <option value="dropdown">Dropdown</option>
                  <option value="file">File Upload</option>
                  <option value="linear">Linear Scale</option>
                  <option value="rating">Rating</option>
                  <option value="grid-mc">Multiple Choice Grid</option>
                  <option value="grid-checkbox">Checkbox Grid</option>
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                </FormSelect>
              </Col>
            </Row>

            {activeElementId === element.id && <RichTextToolbar />}

            {/* ✅ Options with conditional section dropdowns */}
            {element.options.map((option, index) => (
              <div className="d-flex align-items-center my-2" key={index}>
                <input type="radio" className="form-check- require-btn me-2" disabled />
                <FormControl
                  type="text"
                  className="option-input"
                  value={option}
                  onChange={(e) => updateOption(element.id, index, e.target.value)}
                />

                {/* ✅ Section dropdown appears if enabled */}
                {element.goToSectionEnabled && (
                  <FormSelect
                    className="ms-2 w-auto"
                    value={element.optionRouting?.[option] || "next"}
                    onChange={(e) => {
                      const updated = elements.map((el) =>
                        el.id === element.id
                          ? {
                            ...el,
                            optionRouting: {
                              ...el.optionRouting,
                              [option]: e.target.value,
                            },
                          }
                          : el
                      );
                      setElements(updated);
                    }}
                  >
                    <option value="next">Continue to next section</option>
                    <option value="section1">Go to section 1 (Untitled form)</option>
                    <option value="section2">Go to section 2 (Untitled Section)</option>
                    <option value="submit">Submit form</option>
                  </FormSelect>
                )}
              </div>
            ))}

            <div className="d-flex align-items-center mt-3">
              <Button variant="light" onClick={() => addOption(element.id)}>
                Add option
              </Button>
              <span className="mx-2">or</span>
              <Button variant="link" onClick={() => addOption(element.id, "Other")}>
                add "Other"
              </Button>
            </div>

            <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3 flex-wrap">
              <div className="flex items-center space-x-2 text-blue-600 cursor-pointer">
                {/* Icon */}
                {/* <FaClipboardCheck className="text-lg" /> */}
                <a href='#' className='text-decoration-none'>
                  <FontAwesomeIcon icon={faClipboardCheck} style={{ fontSize: "20px" }} />

                  {/* Text */}
                  <span className="ms-1" style={{ fontSize: "18px" }} >Answer key</span>
                </a>

                {/* Points */}
                <span className="text-gray-600 ms-2">(0 points)</span>
              </div>
              <div className='d-flex align-items-center flex-wrap mt-2 mt-md-0'>
                <Button className="bg-transparent text-muted border-0" size='lg'>
                  <FontAwesomeIcon icon={faCopy} />
                </Button>
                <Button className='bg-transparent text-muted border-0' size='lg' onClick={() => onRemove(element.id)}>
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
                <FormCheck
                  type="switch"
                  label="Required"
                  checked={element.required}
                  onChange={() => toggleRequired(element.id)}
                  className="mx-3"
                />
                <Dropdown align="end">
                  <Dropdown.Toggle as={Button} variant="light" className="p-0 border-0">
                    <FontAwesomeIcon icon={faEllipsisV} className='text-muted' />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-sm">
                    {/* Header */}
                    <Dropdown.Header>Show</Dropdown.Header>

                    {/* Items */}
                    <Dropdown.Item onClick={() => console.log("Description clicked")}>
                      Description
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => console.log("Go to section based on answer clicked")}>
                      Go to section based on answer
                    </Dropdown.Item>

                    <Dropdown.Divider />

                    <Dropdown.Item onClick={() => console.log("Shuffle option order clicked")}>
                      Shuffle option order
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        )}



        {/* image */}

        {/* Show the current image */}
        {element.type === "image" && element.content && (
          <div className="text-center flex-column form-card rounded p-3 my-3 shadow-sm position-relative">
            <div className='d-flex align-items-center justify-content-between mb-2'>
              {/* Image Title */}
              <input
                type="text"
                className="form-control p-2 w-75"
                placeholder="Image Title"
                value={element.title || ""}
                onChange={(e) => {
                  const updatedElements = elements.map((el) =>
                    el.id === element.id ? { ...el, title: e.target.value } : el
                  );
                  setElements(updatedElements);
                }}
              />

              {/* Delete Button */}
              <Button
                size="lg"
                className="mt-2 bg-transparent border-0 text-muted"
                onClick={() => removeElement(element.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </div>

            {/* Image */}
            <img
              src={element.content}
              alt={element.title || "Uploaded"}
              className="img-fluid rounded shadow-sm"
            />
          </div>
        )}


        {element.type === 'video' && (
          <div className="form-card p-4 my-3 rounded shadow-sm position-relative">
            {/* Action buttons */}
            <div className="d-flex justify-content-end mt-2 mb-3 gap-2">
              {/* Editable description */}
              <input
                type="text"
                className="form-control"
                placeholder="Untitled Video"
                value={element.description || ""}
                onChange={(e) => handleUpdateElement(element.id, { description: e.target.value })}
              />

              {/* Ellipsis button */}
              <button
                className="btn btn-sm"
                onClick={() => console.log("Ellipsis clicked for:", element.id)}
              >
                <i className="bi bi-three-dots-vertical text-muted text-lg"></i>
              </button>

              {/* Delete button */}
              <button
                className="btn btn-lg"
                onClick={() => handleDeleteElement(element.id)}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>

            {/* Video frame */}
            <div className="ratio ratio-16x9 mb-3">
              <iframe
                src={element.content}
                title="Video"
                allowFullScreen
                className="rounded"
              ></iframe>
            </div>
          </div>
        )}

        {element.type === 'file' && (
          // <div className="form-card p-4 my-3 rounded shadow-sm">
          <div className="file-upload">
            <input type="file" className="form-control" />
          </div>
          // </div>
        )}

        {element.type === 'section' && (
          <div className="form-card p-0 my-3 rounded shadow-sm">
            {/* Section Header with Auto Numbering */}
            <div className="section-header d-flex justify-content-between align-items-center px-4 py-2 text-white rounded-top">
              <h2 className="mb-0 fw-normal fs-6">
                Section {elements.filter(el => el.type === 'section').findIndex(el => el.id === element.id) + 1}
                of {elements.filter(el => el.type === 'section').length}
              </h2>
              <div className="d-flex gap-2">
                <Button
                  size="lg"
                  className='bg-transparent border-0'
                  onClick={() => removeElement(element.id)}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
                <Button size="lg" className='bg-transparent border-0'>
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Button>
              </div>
            </div>

            {/* Section Body */}
            <div className="section-body p-4">
              {/* Section Title */}
              <input
                type="text"
                className="form-control fw-bold mb-2 section-title-input"
                placeholder="Untitled Section"
                value={element.content.customTitle || ""}
                onChange={(e) => {
                  const updated = elements.map((el) =>
                    el.id === element.id
                      ? { ...el, content: { ...el.content, customTitle: e.target.value } }
                      : el
                  );
                  setElements(updated);
                }}
              />

              {/* Section Description */}
              <input
                type="text"
                className="form-control section-description-input"
                placeholder="Description (optional)"
                value={element.content.description || ""}
                onChange={(e) => {
                  const updated = elements.map((el) =>
                    el.id === element.id
                      ? { ...el, content: { ...el.content, description: e.target.value } }
                      : el
                  );
                  setElements(updated);
                }}
              />
            </div>

            {/* Section Footer/Navigation */}
            <div className="d-flex justify-content-between align-items-center p-4">
              <h5 className="mb-0 text-muted">After section {elements.filter(el => el.type === 'section').findIndex(el => el.id === element.id) + 1}</h5>
              <FormSelect className="w-auto ms-3 border-0 px-5">
                <option selected>Continue to next section</option>
                <option>Go to section 1</option>
                <option>Go to section 2</option>
              </FormSelect>
            </div>
          </div>
        )}

      </div>
    )
  };

  return (
    <div className='background'>
      {/* <FormHeader/> */}
      <div className="app-container">
        <div className='form-content'>
          <div className='w-100'>
            <div className="form-header-bar"></div>
            <div className="card1 shadow mb-4 w-100 border-rounded-0">
              <div className="card-body">
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="form-title-input text-box"
                  onFocus={() => setActiveInputId("form-title")}
                  onBlur={(e) => {
                    setActiveInputId(null);
                    setFormTitle(stripBidi(e.currentTarget.innerHTML));
                  }}
                  onKeyDown={(e) => {
                    // Handle Tab key for indentation
                    if (e.key === "Tab") {
                      e.preventDefault();
                      document.execCommand(
                        "insertHTML",
                        false,
                        "\u00a0\u00a0\u00a0\u00a0" // insert 4 non-breaking spaces
                      );
                    }
                  }}
                  dangerouslySetInnerHTML={{
                    __html: formTitle || "Blank Quiz", // ✅ Changed here
                  }}
                  style={{
                    minHeight: "40px",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                    outline: "none",
                    border: "none",
                    borderBottom: "1px solid #ccc",
                    padding: "4px 0",
                  }}
                ></div>

                {activeInputId === "form-title" && <RichTextToolbar />}


                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="text-box mt-4"
                  onFocus={() => setActiveInputId('form-description')}
                  onBlur={(e) => {
                    setActiveInputId(null);
                    setFormDescription(stripBidi(e.currentTarget.innerHTML));
                  }}
                  onKeyDown={(e) => {
                    // Handle Tab key for indentation
                    if (e.key === "Tab") {
                      e.preventDefault();
                      document.execCommand('insertHTML', false, "\u00a0\u00a0\u00a0\u00a0"); // insert 4 non-breaking spaces
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: formDescription || "Untitled description" }}
                  style={{
                    minHeight: "40px",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "break-word",
                    outline: "none",                // remove blue outline
                    border: "none",                 // remove all borders
                    borderBottom: "1px solid #ccc", // add only bottom border
                    padding: "4px 0"                // adjust padding
                  }}
                ></div>

                {activeInputId === 'form-description' && <RichTextToolbar />}

              </div>
            </div>

            {elements.length === 0 && (
              <div className="placeholder-box">
                Start by adding elements from the toolbar on the right.
              </div>
            )}

            {elements.map((element) => (
              <FormElement key={element.id} element={element} onRemove={removeElement} />
            ))}
          </div>

          {/* Floating Toolbar */}
          <div className="floating-toolbar">
            <button onClick={() => addElement('multiple_choice')} title="Add Multiple Choice"><FontAwesomeIcon icon={faPlusCircle} /></button>
            <button onClick={() => addElement('text')} title="Add Text"><FontAwesomeIcon icon={faT} /></button>
            <button onClick={() => setShowImageModal(true)} title="Add Image">
              <FontAwesomeIcon icon={faImage} />
            </button>
            <button onClick={() => setShowVideoModal(true)} title="Add Video"><FontAwesomeIcon icon={faVideo} /></button>
            <button onClick={() => addElement('file')} title="Add File"><FontAwesomeIcon icon={faUpload} /></button>
            <button onClick={() => addElement('section')} title="Add Section"><FontAwesomeIcon icon={faBox} /></button>
          </div>
        </div>
      </div>

      {/* image modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Upload from Computer</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageFileUpload} />
          </Form.Group>
          <Form.Group>
            <Form.Label className='mt-4'>Or enter Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="https://example.com/image.jpg"
              value={tempImageUrl}
              onChange={(e) => setTempImageUrl(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer className='border-0'>
          <Button className="mt-2" variant="primary" onClick={handleImageUrlSubmit}>
            Insert
          </Button>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Video Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Paste YouTube URL here"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
            Cancel
          </Button>

          <Button
            onClick={() => {
              if (videoUrl.trim() !== "") {
                const newElement = {
                  id: generateId(),
                  type: "video",
                  content: parseYouTubeUrl(videoUrl) || "https://www.youtube.com/embed/dQw4w9WgXcQ",
                };
                setElements((prev) => [...prev, newElement]);
                setVideoUrl(""); // clear input
                setShowVideoModal(false); // close modal
              }
            }}
          >
            Insert
          </Button>

        </Modal.Footer>
      </Modal>

    </div>
  );
}