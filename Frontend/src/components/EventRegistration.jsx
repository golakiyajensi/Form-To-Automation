import React, { useState, useRef } from "react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaStrikethrough,
  FaFont,
  FaRegListAlt,
  FaImage,
  FaVideo,
  FaUpload,
  FaBars,
} from "react-icons/fa";
 
const EventRegistration = () => {
  const [description, setDescription] = useState(
    `Event Timing: January 4th - 6th, 2016
Event Address: 123 Your Street, Your City, ST 12345
Contact us at (123) 456-7890 or no_reply@example.com`
  );
 
  const [sections, setSections] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const floatingFileRef = useRef(null);
 
  // Toolbar actions
  const addSection = (type, content = "") => {
    setSections((prev) => [...prev, { type, content }]);
  };
 
  const handleImageClick = () => {
    floatingFileRef.current.click();
  };
 
  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      addSection("image", imageUrl);
    }
  };
 
  const handleVideoSubmit = () => {
    if (videoUrl.trim() !== "") {
      addSection("video", videoUrl);
      setVideoUrl("");
      setShowVideoModal(false);
    }
  };
 
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      addSection("file", fileName);
    }
  };
 
  // Helper: section titles
  const getSectionTitle = (type) => {
    switch (type) {
      case "text":
        return "Text Section";
      case "paragraph":
        return "Paragraph Section";
      case "image":
        return "Image Section";
      case "video":
        return "Video Section";
      case "file":
        return "File Upload Section";
      case "section":
        return "New Section";
      default:
        return "Section";
    }
  };
 
  return (
    <div className="eventreg-background">
      <div className="eventregistration">
        {/* Banner */}
        <div className="form-registration"></div>
 
        {/* Event Card */}
        <div className="event-card">
          <div className="event-card-top"></div>
          <div className="event-card-content">
            <h2 className="event-title">Event Registration</h2>
            <div className="event-divider"></div>
 
            {/* Toolbar */}
            <div className="event-toolbar">
              <button>
                <FaBold />
              </button>
              <button>
                <FaItalic />
              </button>
              <button>
                <FaUnderline />
              </button>
              <button>
                <FaLink />
              </button>
              <button>
                <FaStrikethrough />
              </button>
            </div>
 
            {/* Description */}
            <textarea
              className="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
        </div>
 
        {/* Name Field */}
        <div className="field-card">
          <label className="field-label">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            placeholder="Short answer text"
            className="field-input"
          />
          <div className="field-underline"></div>
        </div>
 
        {/* Email & Organization */}
        <div className="ff-container">
          <div className="ff-card">
            <label className="ff-label">
              Email <span className="ff-required">*</span>
            </label>
            <input
              type="email"
              placeholder="Short answer text"
              className="ff-input"
            />
            <div className="ff-underline"></div>
          </div>
 
          <div className="ff-card">
            <label className="ff-label">
              Organization <span className="ff-required">*</span>
            </label>
            <input
              type="text"
              placeholder="Short answer text"
              className="ff-input"
            />
            <div className="ff-underline"></div>
          </div>
        </div>
 
        {/* Attendance & Dietary Restrictions */}
        <div className="af-container">
          <div className="af-card">
            <label className="af-label">
              What days will you attend? <span className="af-required">*</span>
            </label>
            <div className="af-options">
              <label className="af-option">
                <input type="checkbox" /> Day 1
              </label>
              <label className="af-option">
                <input type="checkbox" /> Day 2
              </label>
              <label className="af-option">
                <input type="checkbox" /> Day 3
              </label>
            </div>
          </div>
          <div className="af-card">
            <label className="af-label">
              Dietary restrictions <span className="af-required">*</span>
            </label>
            <div className="af-options">
              <label className="af-option">
                <input type="radio" name="diet" /> None
              </label>
              <label className="af-option">
                <input type="radio" name="diet" /> Vegetarian
              </label>
              <label className="af-option">
                <input type="radio" name="diet" /> Vegan
              </label>
              <label className="af-option">
                <input type="radio" name="diet" /> Kosher
              </label>
              <label className="af-option">
                <input type="radio" name="diet" /> Gluten-free
              </label>
              <label className="af-option">
                <input type="radio" name="diet" /> Other...
              </label>
            </div>
          </div>
        </div>
 
        {/* Payment Checkbox */}
        <div className="payment-checkbox-container">
          <label className="payment-label">
            I understand that I will have to pay $$ upon arrival{" "}
            <span className="required">*</span>
          </label>
          <div className="payment-checkbox">
            <input
              type="checkbox"
              id="paymentAgree"
              className="payment-input"
            />
            <label htmlFor="paymentAgree" className="payment-text">
              Yes
            </label>
          </div>
        </div>
 
        {/* Dynamic Sections */}
        {sections.map((sec, index) => (
          <div key={index} className="dynamic-section">
            <h4>{getSectionTitle(sec.type)}</h4>
            {sec.type === "text" && (
              <input
                type="text"
                placeholder="Enter text"
                className="field-input"
              />
            )}
            {sec.type === "paragraph" && (
              <textarea
                placeholder="Enter paragraph"
                className="event-description"
              ></textarea>
            )}
            {sec.type === "image" && (
              <img
                src={sec.content}
                alt="Uploaded"
                className="uploaded-image"
              />
            )}
            {sec.type === "video" && (
              <iframe
                width="560"
                height="315"
                src={sec.content}
                title="Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}
            {sec.type === "file" && (
              <div className="file-section">Uploaded File: {sec.content}</div>
            )}
            {sec.type === "section" && (
              <div className="new-section">New Section Added</div>
            )}
          </div>
        ))}
 
        {/* Floating Toolbar */}
        <div className="eventregistration-floating-toolbar">
          <button
            className="eventregistration-toolbar-btn"
            title="Add Text"
            onClick={() => addSection("text")}
          >
            <FaFont />
          </button>
          <button
            className="eventregistration-toolbar-btn"
            title="Add Paragraph"
            onClick={() => addSection("paragraph")}
          >
            <FaRegListAlt />
          </button>
          <button
            className="eventregistration-toolbar-btn"
            title="Add Image"
            onClick={handleImageClick}
          >
            <FaImage />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={floatingFileRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          <button
            className="eventregistration-toolbar-btn"
            title="Add Video"
            onClick={() => setShowVideoModal(true)}
          >
            <FaVideo />
          </button>
          <button className="eventregistration-toolbar-btn" title="Upload File">
            <label style={{ cursor: "pointer" }}>
              <FaUpload />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={handleFileUpload}
              />
            </label>
          </button>
          <button
            className="eventregistration-toolbar-btn"
            title="Add Section"
            onClick={() => addSection("section")}
          >
            <FaBars />
          </button>
        </div>
 
        {/* Video Modal */}
        {showVideoModal && (
          <div className="video-modal">
            <div className="video-modal-content">
              <h4>Add Video URL</h4>
              <input
                type="text"
                placeholder="Enter video URL (YouTube embed link)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="field-input"
              />
              <button onClick={handleVideoSubmit}>Add Video</button>
              <button onClick={() => setShowVideoModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default EventRegistration;