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
import { Button, Modal, FormCheck, FormControl } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OrderForm() {
  const [formTitle, setFormTitle] = useState("Oreder Form");
  const [formDescription, setFormDescription] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis sem odio. Sed commodo vestibulum leo..."
  );
  const [elements, setElements] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    positions: [],
    resume: "",
  });

  const generateId = () =>
    Date.now().toString(36) + Math.random().toString(36).substr(2);

  /** Convert YouTube URL to embed format */
  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(youtubeRegex);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  /** Add new element */
  const addElement = (type, url = "") => {
    let newElement = null;
    if (type === "text") {
      newElement = {
        id: generateId(),
        type: "text",
        label: "Untitled Question",
        required: true,
      };
    } else if (type === "multiple_choice") {
      newElement = {
        id: generateId(),
        type: "multiple_choice",
        label: "Untitled Question",
        options: ["Option 1"],
      };
    } else if (type === "image") {
      newElement = {
        id: generateId(),
        type: "image",
        content: "https://placehold.co/600x200?text=Image+Placeholder",
      };
    } else if (type === "video") {
      newElement = {
        id: generateId(),
        type: "video",
        content: convertToEmbedUrl(url),
      };
    } else if (type === "file") {
      newElement = { id: generateId(), type: "file" };
    } else if (type === "section") {
      newElement = {
        id: generateId(),
        type: "section",
        label: "Untitled Section",
      };
    }
    setElements([...elements, newElement]);
  };

  const removeElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => {
        const positions = checked
          ? [...prev.positions, value]
          : prev.positions.filter((p) => p !== value);
        return { ...prev, positions };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  const FormElement = ({ element }) => (
    <div className="gform-card">
      {element.type === "text" && (
        <>
          <label className="gform-label">
            {element.label} {element.required && <span className="gform-required">*</span>}
          </label>
          <input type="text" className="gform-input" placeholder="Short-answer text" disabled />
          <div className="gform-actions">
            <Button variant="light" size="sm" onClick={() => removeElement(element.id)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
            <FormCheck type="switch" label="Required" checked={element.required} />
          </div>
        </>
      )}

      {element.type === "multiple_choice" && (
        <>
          <label className="gform-label">{element.label}</label>
          {element.options.map((opt, i) => (
            <div key={i} className="d-flex align-items-center mb-2">
              <input type="radio" disabled className="me-2" />
              <FormControl type="text" value={opt} readOnly />
            </div>
          ))}
        </>
      )}

      {element.type === "image" && (
        <div className="text-center">
          <img src={element.content} alt="Uploaded" className="img-fluid rounded" />
        </div>
      )}

      {element.type === "video" && (
        <div className="ratio ratio-16x9">
          <iframe src={element.content} title="Video" allowFullScreen></iframe>
        </div>
      )}

      {element.type === "file" && (
        <>
          <label className="gform-label">Upload File</label>
          <input type="file" className="form-control" />
        </>
      )}

      {element.type === "section" && <h4 className="gform-section">{element.label}</h4>}
    </div>
  );

  return (
    <div className="order mt-5" style={{backgroundColor:"#fff3eb", paddingTop:"20px"}}>
    <div className="gform-container mt-5">
      {/* Header Banner */}
      <div className="gform-header-banner">
        <img src="/img/order.jpg" alt="Header" />
      </div>

      {/* Header */}
      <div className="gform-header">
        <input
          type="text"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="gform-title"
        />
        <textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          className="gform-desc"
        />
      </div>

      {/* Job Application Form */}
      <form className="gform-form" onSubmit={handleSubmit}>
        {/* Name */}
        <div className="gform-card">
          <label className="gform-label">
            Name <span className="gform-required">*</span>
          </label>
          <p className="gform-sub">First and last name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="gform-input"
            required
          />
        </div>

        {/* Email */}
        <div className="gform-card">
          <label className="gform-label">
            Email <span className="gform-required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="gform-input"
            required
          />
        </div>

        {/* Phone */}
        <div className="gform-card">
          <label className="gform-label">
            Phone number <span className="gform-required">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="gform-input"
            required
          />
        </div>

        {/* Positions */}
        <div className="gform-card">
          <label className="gform-label">
            Which position(s) are you interested in? <span className="gform-required">*</span>
          </label>
          {["Position 1", "Position 2", "Position 3"].map((pos) => (
            <div key={pos} className="gform-checkbox">
              <label>
                <input
                  type="checkbox"
                  value={pos}
                  checked={formData.positions.includes(pos)}
                  onChange={handleChange}
                />{" "}
                {pos}
              </label>
            </div>
          ))}
        </div>

        {/* Resume */}
        <div className="gform-card">
          <label className="gform-label">Submit your cover letter or resume</label>
          <textarea
            name="resume"
            value={formData.resume}
            onChange={handleChange}
            className="gform-textarea"
            rows="4"
          />
        </div>

        {/* Dynamic Elements */}
        {elements.map((el) => (
          <FormElement key={el.id} element={el} />
        ))}
      </form>

      {/* Floating Toolbar */}
      <div className="gform-toolbar">
        <button onClick={() => addElement("text")}>
          <FontAwesomeIcon icon={faT} />
        </button>
        <button onClick={() => addElement("multiple_choice")}>
          <FontAwesomeIcon icon={faPlusCircle} />
        </button>
        <button onClick={() => addElement("image")}>
          <FontAwesomeIcon icon={faImage} />
        </button>
        <button onClick={() => setShowVideoModal(true)}>
          <FontAwesomeIcon icon={faVideo} />
        </button>
        <button onClick={() => addElement("file")}>
          <FontAwesomeIcon icon={faUpload} />
        </button>
        <button onClick={() => addElement("section")}>
          <FontAwesomeIcon icon={faBox} />
        </button>
      </div>

      {/* Video Modal */}
      <Modal show={showVideoModal} onHide={() => setShowVideoModal(false)} centered>
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
