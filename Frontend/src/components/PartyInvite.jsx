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

export default function PartyInviteForm() {
    const [formTitle, setFormTitle] = useState("Party Invite");
    const [formDescription, setFormDescription] = useState(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis sem odio. Sed commodo vestibulum leo..."
    );
    const [elements, setElements] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    const generateId = () =>
        Date.now().toString(36) + Math.random().toString(36).substr(2);

    /* Convert YouTube URL to embed format */
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

    /* Dynamic Form Element Renderer */
    const FormElement = ({ element }) => (
        <div className="form-section">
            {element.type === "text" && (
                <>
                    <label>
                        {element.label} {element.required && <span className="required">*</span>}
                    </label>
                    <input type="text" placeholder="Short-answer text" disabled />
                    <div className="form-actions">
                        <Button
                            variant="light"
                            size="sm"
                            onClick={() => removeElement(element.id)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </Button>
                        <FormCheck type="switch" label="Required" checked={element.required} />
                    </div>
                </>
            )}

            {element.type === "multiple_choice" && (
                <>
                    <label>{element.label}</label>
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
                    <label>Upload File</label>
                    <input type="file" className="form-control" />
                </>
            )}

            {element.type === "section" && <h4 className="gform-section">{element.label}</h4>}
        </div>
    );

    return (
        <div className="form-page">
            <div className="form-container">
                {/* Header Image */}
                <div className="form-header-image">
                    <img src="/img/party.jpg" alt="Party" />
                </div>

                {/* Title Section */}
                <div className="form-section title-section">
                    <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="form-title"
                    />
                    <div className="title-divider"></div>
                    <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        className="form-desc"
                    />
                </div>

                {/* Static Questions */}
                <div className="form-section">
                    <label>What is your name?</label>
                    <input type="text" placeholder="Short-answer text" />
                </div>

                <div className="form-section">
                    <label>
                        Can you attend? <span className="required">*</span>
                    </label>
                    <div className="form-option">
                        <input type="radio" name="attend" id="yes" />
                        <label htmlFor="yes">Yes, I'll be there</label>
                    </div>
                    <div className="form-option">
                        <input type="radio" name="attend" id="no" />
                        <label htmlFor="no">Sorry, can't make it</label>
                    </div>
                </div>

                <div className="form-section">
                    <label>How many of you are attending?</label>
                    <input type="text" placeholder="Short-answer text" />
                </div>

                <div className="form-section">
                    <label>What will you be bringing?</label>
                    <p className="hint">
                        Let us know what kind of dish(es) you'll be bringing
                    </p>
                    {["Mains", "Salad", "Dessert", "Drinks", "Sides/Appetizers", "Other"].map(
                        (item, i) => (
                            <div className="form-option" key={i}>
                                <input type="checkbox" id={item} />
                                <label htmlFor={item}>{item}</label>
                            </div>
                        )
                    )}
                </div>

                <div className="form-section">
                    <label>Do you have any allergies or dietary restrictions?</label>
                    <input type="text" placeholder="Short-answer text" />
                </div>

                <div className="form-section">
                    <label>What is your email address?</label>
                    <input type="email" placeholder="Short-answer text" />
                </div>

                {/* Dynamic Elements */}
                {elements.map((el) => (
                    <FormElement key={el.id} element={el} />
                ))}
            </div>

            {/* Floating Toolbar */}
            <div className="form-toolbar">
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
    );
}
