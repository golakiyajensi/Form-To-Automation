import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faT,
  faUpload,
  faVideo,
  faTrashAlt,
  faPlusCircle,
  faBold,
  faItalic,
  faUnderline,
  faLink,
  faStrikethrough,
} from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function TShirtForm() {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    comments: "",
  });

  const [elements, setElements] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  // Title & Description state
  const [title, setTitle] = useState("T-Shirt Sign Up");
  const [desc, setDesc] = useState(
    "Enter your name and size to sign up for a T-Shirt."
  );
  const [editMode, setEditMode] = useState(false);

  const cardRef = useRef(null);

  // Close edit mode when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setEditMode(false);
      }
    }

    if (editMode) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editMode]);

  // Generate unique IDs
  const generateId = () => Date.now() + Math.random();

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
      };
    } else if (type === "multiple_choice") {
      newElement = {
        id: generateId(),
        type: "multiple_choice",
        label: "Untitled Question",
        options: ["Option 1", "Option 2"],
      };
    } else if (type === "image") {
      newElement = {
        id: generateId(),
        type: "image",
        content: "https://placehold.co/400x200?text=Image+Placeholder",
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
    setElements((prev) => [...prev, newElement]);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle delete element
  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData, "Dynamic Elements:", elements);
    alert(" Form submitted! (Check console for data)");
  };

  return (
    <div className="background02">
      <div className="gform-container">
        {/* Title & Description Card */}
        <div
          className="gform-card mb-3"
          ref={cardRef}
          onClick={() => setEditMode(true)}
          style={{ cursor: "pointer" }}
        >
          {!editMode ? (
            <>
              <h2 className="gform-title">{title}</h2>
              <p className="gform-desc">{desc}</p>
            </>
          ) : (
            <div>
              <input
                type="text"
                className="form-control mb-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              {/* Formatting toolbar */}
              <div className="d-flex gap-3 mb-2">
                <FontAwesomeIcon icon={faBold} />
                <FontAwesomeIcon icon={faItalic} />
                <FontAwesomeIcon icon={faUnderline} />
                <FontAwesomeIcon icon={faLink} />
                <FontAwesomeIcon icon={faStrikethrough} />
              </div>
              <textarea
                className="form-control"
                rows="2"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="gform-card mb-3">
            <label className="gform-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-control"
              placeholder="Your name"
            />
          </div>

          {/* Shirt size */}
          <div className="gform-card mb-3">
            <label className="gform-label">Shirt size</label>
            <div className="d-flex gap-3" style={{ flexDirection: "column" }}>
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <label key={size}>
                  <input
                    type="radio"
                    name="size"
                    value={size}
                    checked={formData.size === size}
                    onChange={handleChange}
                    required
                  />{" "}
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* T-Shirt preview */}
          <div className="gform-card mb-3">
            <label className="gform-label">T-Shirt Preview</label>
            <div style={{ textAlign: "center" }}>
              <img
                src="/img/t-shirt.png"
                alt="T-Shirt Preview"
                className="img-fluid"
                style={{ maxWidth: "200px" }}
              />
            </div>
          </div>

          {/* Other comments */}
          <div className="gform-card mb-3">
            <label className="gform-label">Other thoughts or comments</label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              className="form-control"
              placeholder="Write here..."
              rows="3"
            />
          </div>

          {/* Dynamic Elements */}
          {elements.map((el) => (
            <div key={el.id} className="gform-card mb-3 p-2 border rounded">
              <label className="gform-label">{el.label}</label>

              {el.type === "text" && (
                <input type="text" className="form-control" />
              )}

              {el.type === "multiple_choice" &&
                el.options.map((opt, idx) => (
                  <div key={idx}>
                    <input type="radio" name={`mc-${el.id}`} /> {opt}
                  </div>
                ))}

              {el.type === "image" && (
                <img src={el.content} alt="Dynamic" className="img-fluid" />
              )}

              {el.type === "video" && (
                <iframe
                  width="100%"
                  height="200"
                  src={el.content}
                  title="Video"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              )}

              {el.type === "file" && (
                <input type="file" className="form-control" />
              )}

              {el.type === "section" && (
                <textarea
                  rows="3"
                  className="form-control"
                  placeholder="Section notes..."
                />
              )}

              {/* Delete */}
              <button
                type="button"
                className="btn btn-sm btn-danger mt-2"
                onClick={() => deleteElement(el.id)}
              >
                <FontAwesomeIcon icon={faTrashAlt} /> Delete
              </button>
            </div>
          ))}
        </form>

        {/* Floating Toolbar */}
        <div className="gform-toolbar mt-4 d-flex gap-2">
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
