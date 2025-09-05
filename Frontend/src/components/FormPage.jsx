// ContactForm.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  FaFont,
  FaImage,
  FaVideo,
  FaBars,
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaListUl,
  FaCopy,
  FaTrash,
  FaEllipsisV,
  FaUpload,
  FaRegListAlt
} from "react-icons/fa";

const ContactForm = () => {
  const [formTitle, setFormTitle] = useState("Contact information");
  const [formDescription, setFormDescription] = useState("");

  const [fields, setFields] = useState([
    { type: "textarea", label: "Address", placeholder: "Long answer text", required: true },
    { type: "tel", label: "Phone number", placeholder: "Short answer text", required: false },
    { type: "textarea", label: "Comments", placeholder: "Long answer text", required: false },
  ]);

  const [sections, setSections] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedEmailImage, setUploadedEmailImage] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [isEmailExpanded, setIsEmailExpanded] = useState(false);

  const [questionTitle, setQuestionTitle] = useState("Name");
  const [emailTitle, setEmailTitle] = useState("Email");

  const [type, setType] = useState("short");
  const [emailType, setEmailType] = useState("short");

  const [required, setRequired] = useState(true);
  const [emailRequired, setEmailRequired] = useState(true);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoLink, setVideoLink] = useState("");

  const [showFileUpload, setShowFileUpload] = useState(false);
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);
  const emailFileInputRef = useRef(null);
  const uploadFileRef = useRef(null);

  const blockRef = useRef(null);
  const emailBlockRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (blockRef.current && !blockRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
      if (emailBlockRef.current && !emailBlockRef.current.contains(event.target)) {
        setIsEmailExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addField = (type) => {
    const newField =
      type === "text"
        ? { type: "text", label: "New Question", placeholder: "Short answer text", required: false }
        : { type: "textarea", label: "New Question", placeholder: "Long answer text", required: false };
    setFields([...fields, newField]);
  };

  const addSection = () => {
    setSections([...sections, { title: `New Section ${sections.length + 1}`, description: "Section description" }]);
  };

  const handleImageClick = (forEmail = false) => {
    if (forEmail) {
      emailFileInputRef.current.click();
    } else {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e, forEmail = false) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (forEmail) {
        setUploadedEmailImage(imageUrl);
      } else {
        setUploadedImage(imageUrl);
      }
    }
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles([...files, ...uploadedFiles]);
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
  };

  const insertLink = () => {
    const url = prompt("Enter the link URL:");
    if (url) {
      document.execCommand("createLink", false, url);
    }
  };

  const handleToggle = () => setRequired(!required);
  const handleEmailToggle = () => setEmailRequired(!emailRequired);

  const onDuplicate = () => alert("Duplicate function not implemented yet!");
  const onDelete = () => alert("Delete function not implemented yet!");

  const renderFieldByType = (selectedType, isEmail = false) => {
    switch (selectedType) {
      case "short":
        return (
          <input
            type={isEmail ? "email" : "text"}
            placeholder={isEmail ? "Your email" : "Short answer text"}
            required={isEmail ? emailRequired : required}
          />
        );
      case "paragraph":
        return <textarea placeholder={isEmail ? "Your email details" : "Long answer text"}></textarea>;
      case "multiple":
        return (
          <div>
            <label><input type="radio" /> Option 1</label>
            <label><input type="radio" /> Option 2</label>
          </div>
        );
      case "checkbox":
        return (
          <div>
            <label><input type="checkbox" /> Option A</label>
            <label><input type="checkbox" /> Option B</label>
          </div>
        );
      case "dropdown":
        return (
          <select>
            <option>Select an option</option>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        );
      case "date":
        return <input type="date" />;
      case "time":
        return <input type="time" />;
      default:
        return <input type="text" placeholder="Short answer text" />;
    }
  };

  const handleAddVideo = () => {
    if (videoLink.trim() !== "") {
      let embedLink = videoLink;
      if (videoLink.includes("watch?v=")) {
        embedLink = videoLink.replace("watch?v=", "embed/");
      }
      setVideos([...videos, embedLink]);
      setVideoLink("");
      setShowVideoModal(false);
    }
  };

  return (
    <div className="main-form">
      <div className="form-container">
        {/* Title & Description */}
        <div className="contact-section">
          <div
            className="editable-title"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setFormTitle(e.currentTarget.textContent)}
          >
            {formTitle}
          </div>
          <div
            className="editable-description"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => setFormDescription(e.currentTarget.textContent)}
          >
            {formDescription || "Form description"}
          </div>
        </div>

        {/* NAME Question */}
        <div ref={blockRef} className={`question-block ${isExpanded ? "expanded" : ""}`} onClick={() => setIsExpanded(true)}>
          <div className="question-title-row">
            <div
              className="question-title"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setQuestionTitle(e.currentTarget.textContent)}
            >
              {questionTitle}
            </div>
            <button type="button" className="icon-button" onClick={(e) => { e.stopPropagation(); handleImageClick(); }}>
              <FaImage />
            </button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={(e) => handleImageChange(e, false)} style={{ display: "none" }} />

            <div className="question-type">
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="short">Short answer</option>
                <option value="paragraph">Paragraph</option>
                <option value="multiple">Multiple choice</option>
                <option value="checkbox">Checkboxes</option>
                <option value="dropdown">Dropdown</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
              </select>
            </div>
          </div>

          {isExpanded && (
            <div className="toolbar">
              <button onClick={() => applyFormat("bold")}><FaBold /></button>
              <button onClick={() => applyFormat("italic")}><FaItalic /></button>
              <button onClick={() => applyFormat("underline")}><FaUnderline /></button>
              <button onClick={insertLink}><FaLink /></button>
              <button onClick={() => applyFormat("insertUnorderedList")}><FaListUl /></button>
            </div>
          )}

          <div className="question-preview">{renderFieldByType(type, false)}</div>

          {uploadedImage && <div className="uploaded-image"><img src={uploadedImage} alt="Uploaded" /></div>}

          {isExpanded && (
            <div className="question-actions">
              <button className="action-btn" onClick={onDuplicate}><FaCopy /></button>
              <button className="action-btn" onClick={onDelete}><FaTrash /></button>
              <div className="required-toggle">
                <label>
                  Required
                  <input type="checkbox" checked={required} onChange={handleToggle} />
                </label>
              </div>
              <button className="action-btn"><FaEllipsisV /></button>
            </div>
          )}
        </div>

        {/* EMAIL Question */}
        <div ref={emailBlockRef} className={`question-block ${isEmailExpanded ? "expanded" : ""}`} onClick={() => setIsEmailExpanded(true)}>
          <div className="question-title-row">
            <div
              className="question-title"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => setEmailTitle(e.currentTarget.textContent)}
            >
              {emailTitle}
            </div>
            <button type="button" className="icon-button" onClick={(e) => { e.stopPropagation(); handleImageClick(true); }}>
              <FaImage />
            </button>
            <input type="file" accept="image/*" ref={emailFileInputRef} onChange={(e) => handleImageChange(e, true)} style={{ display: "none" }} />

            <div className="question-type">
              <select value={emailType} onChange={(e) => setEmailType(e.target.value)}>
                <option value="short">Short answer</option>
                <option value="paragraph">Paragraph</option>
                <option value="multiple">Multiple choice</option>
                <option value="checkbox">Checkboxes</option>
                <option value="dropdown">Dropdown</option>
                <option value="date">Date</option>
                <option value="time">Time</option>
              </select>
            </div>
          </div>

          {isEmailExpanded && (
            <div className="toolbar">
              <button onClick={() => applyFormat("bold")}><FaBold /></button>
              <button onClick={() => applyFormat("italic")}><FaItalic /></button>
              <button onClick={() => applyFormat("underline")}><FaUnderline /></button>
              <button onClick={insertLink}><FaLink /></button>
              <button onClick={() => applyFormat("insertUnorderedList")}><FaListUl /></button>
            </div>
          )}

          <div className="question-preview">{renderFieldByType(emailType, true)}</div>

          {uploadedEmailImage && <div className="uploaded-image"><img src={uploadedEmailImage} alt="Uploaded" /></div>}

          {isEmailExpanded && (
            <div className="question-actions">
              <button className="action-btn" onClick={onDuplicate}><FaCopy /></button>
              <button className="action-btn" onClick={onDelete}><FaTrash /></button>
              <div className="required-toggle">
                <label>
                  Required
                  <input type="checkbox" checked={emailRequired} onChange={handleEmailToggle} />
                </label>
              </div>
              <button className="action-btn"><FaEllipsisV /></button>
            </div>
          )}
        </div>

        {/* Dynamic Fields */}
        <div className="form-body">
          {fields.map((field, index) => (
            <div key={index} className="form-field">
              <label>{field.label} {field.required && "*"}</label>
              {field.type === "tel" && <input type="tel" placeholder={field.placeholder} required={field.required} />}
              {field.type === "textarea" && <textarea placeholder={field.placeholder} required={field.required}></textarea>}
              {field.type === "text" && <input type="text" placeholder={field.placeholder} required={field.required} />}
            </div>
          ))}

          {/* Uploaded Images */}
          {images.length > 0 && (
            <div className="form-images">
              {images.map((img, i) => (
                <img key={i} src={img} alt="Uploaded" className="uploaded-img" />
              ))}
            </div>
          )}

          {/* Uploaded Files */}
          {files.length > 0 && (
            <div className="form-files">
              <h4>Uploaded Files</h4>
              <ul>
                {files.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div className="form-videos">
              {videos.map((video, i) => (
                <div key={i} className="video-wrapper">
                  <iframe
                    width="100%"
                    height="315"
                    src={video}
                    title={`video-${i}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sections */}
        {sections.length > 0 && (
          <div className="form-sections">
            {sections.map((sec, idx) => (
              <div key={idx} className="section-block">
                <h3 contentEditable suppressContentEditableWarning>{sec.title}</h3>
                <p contentEditable suppressContentEditableWarning>{sec.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Floating Toolbar */}
        <div className="floating-toolbar">
          <button onClick={() => addField("text")} title="Add Text"><FaFont /></button>
          <button onClick={() => addField("textarea")} title="Add Paragraph"><FaRegListAlt /></button>
          <button onClick={handleImageClick} title="Add Image"><FaImage /></button>
          <button onClick={() => setShowVideoModal(true)} title="Add Video"><FaVideo /></button>
          <button onClick={() => setShowFileUpload(!showFileUpload)} title="Upload File"><FaUpload /></button>
          <button onClick={addSection} title="Add Section"><FaBars /></button>
        </div>

        {/* File Upload Section */}
        {showFileUpload && (
          <div className="file-upload-section">
            <h4>Upload Files</h4>
            <input
              type="file"
              ref={uploadFileRef}
              onChange={handleFileUpload}
              multiple
            />
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add YouTube Video</h3>
            <input
              type="text"
              placeholder="Paste YouTube link"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleAddVideo}>Add Video</button>
              <button onClick={() => setShowVideoModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
