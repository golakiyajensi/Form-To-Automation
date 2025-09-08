import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faT,
  faUpload,
  faVideo,
  faTrashAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

export default function EventFeedbackForm() {
  const [formData, setFormData] = useState({
    satisfaction: "",
    relevance: "",
    takeaway: "",
    logistics: {},
    logisticsFeedback: "",
    sessionRelevance: {},
    sessionContent: "",
    sessionComments: "",
    overallFeedback: "",
    name: "",
  });

  const [elements, setElements] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  /** Convert YouTube URL to embed format */
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // Add dynamic form elements
  const addElement = (type, payload = null) => {
    const newElement = {
      id: Date.now(),
      type,
      label: `New ${type} question`,
      options: type === "multiple_choice" ? ["Option 1", "Option 2"] : [],
      value: payload || "",
    };
    setElements((prev) => [...prev, newElement]);
  };

  // Handle element value change
  const handleElementChange = (id, value) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, value } : el))
    );
  };

  // Delete element
  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  // Normal form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGridChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData, "Dynamic:", elements);
    alert("✅ Feedback submitted! (Check console for form data)");
  };

  return (
    <div className="background01 mt-5" style={{paddingTop:"60px"}}>
    <div className="gform-container">
      {/* Banner */}
      <div className="gform-banner">
        <img src="/img/event.jpg" alt="Event Banner" />
      </div>

      {/* Title & description */}
      <div className="gform-card">
        <h2 className="gform-title">Event feedback</h2>
        <p className="gform-desc">
          Thanks for participating in our event. We hope you had as much fun
          attending as we did organizing it. <br />
          We value your feedback and would like to hear your thoughts to improve
          our future events.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Satisfaction */}
        <div className="gform-card">
          <label className="gform-label">
            How satisfied were you with the event?
          </label>
          <div className="gform-scale">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  name="satisfaction"
                  value={n}
                  onChange={handleChange}
                  checked={formData.satisfaction === String(n)}
                />
                {n}
              </label>
            ))}
          </div>
        </div>

        {/* Relevance */}
        <div className="gform-card">
          <label className="gform-label">
            How relevant and helpful do you think it was for your job?
          </label>
          <div className="gform-scale">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} style={{ marginRight: "10px" }}>
                <input
                  type="radio"
                  name="relevance"
                  value={n}
                  onChange={handleChange}
                  checked={formData.relevance === String(n)}
                />
                {n}
              </label>
            ))}
          </div>
        </div>

        {/* Key takeaway */}
        <div className="gform-card">
          <label className="gform-label">
            What was your key takeaway from this event?
          </label>
          <textarea
            name="takeaway"
            value={formData.takeaway}
            onChange={handleChange}
            className="gform-textarea"
            rows="2"
          />
        </div>

        {/* --- Dynamic Elements --- */}
        {elements.map((el) => (
          <div key={el.id} className="gform-card dynamic-element">
            <label className="gform-label">{el.label}</label>

            {el.type === "text" && (
              <input
                type="text"
                className="gform-input"
                value={el.value}
                onChange={(e) => handleElementChange(el.id, e.target.value)}
              />
            )}

            {el.type === "multiple_choice" &&
              el.options.map((opt, idx) => (
                <div key={idx}>
                  <input
                    type="radio"
                    name={`mc-${el.id}`}
                    value={opt}
                    onChange={(e) => handleElementChange(el.id, e.target.value)}
                  />
                  {opt}
                </div>
              ))}

            {el.type === "image" && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleElementChange(el.id, e.target.files[0]?.name)
                }
              />
            )}

            {el.type === "video" && el.value && (
              <iframe
                width="100%"
                height="200"
                src={convertToEmbedUrl(el.value)}
                title="Video Preview"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            )}

            {el.type === "file" && (
              <input
                type="file"
                onChange={(e) =>
                  handleElementChange(el.id, e.target.files[0]?.name)
                }
              />
            )}

            {el.type === "section" && (
              <textarea
                rows="3"
                className="gform-textarea"
                placeholder="Section notes..."
                onChange={(e) => handleElementChange(el.id, e.target.value)}
              />
            )}

            {/* Delete button */}
            <button
              type="button"
              className="delete-btn btn btn-sm btn-danger mt-2"
              onClick={() => deleteElement(el.id)}
            >
              <FontAwesomeIcon icon={faTrashAlt} /> Delete
            </button>
          </div>
        ))}

        
      </form>

      {/* Floating Toolbar */}
      <div className="gform-toolbar">
        <button type="button" onClick={() => addElement("text")}>
          <FontAwesomeIcon icon={faT} />
        </button>
        <button type="button" onClick={() => addElement("multiple_choice")}>
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
        <button type="button" onClick={() => addElement("image")}>
          <FontAwesomeIcon icon={faImage} />
        </button>
        <button type="button" onClick={() => setShowVideoModal(true)}>
          <FontAwesomeIcon icon={faVideo} />
        </button>
        <button type="button" onClick={() => addElement("file")}>
          <FontAwesomeIcon icon={faUpload} />
        </button>
        <button type="button" onClick={() => addElement("section")}>
          <FontAwesomeIcon icon={faBox} />
        </button>
      </div>

      {/* Video Modal */}
      <Modal
        show={showVideoModal}
        onHide={() => setShowVideoModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Insert Video</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            placeholder="Paste YouTube URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVideoModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (videoUrl.trim()) {
                addElement("video", videoUrl);
                setVideoUrl("");
                setShowVideoModal(false);
              }
            }}
          >
            Insert
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
}
