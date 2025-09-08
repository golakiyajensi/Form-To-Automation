// RsvpForm.jsx
import React, { useState, useRef } from "react";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaLink,
    FaListUl,
    FaImage,
    FaCopy,
    FaTrash,
    FaFont,
    FaRegListAlt,
    FaVideo,
    FaUpload,
    FaBars,

} from "react-icons/fa";

const RsvpForm = () => {
    const [description] = useState(
        "Event Address: 123 Your Street, Your City, ST 12345 Contact us at (123) 456-7890 or no_reply@example.com"
    );
    const [expandedQuestion, setExpandedQuestion] = useState(false);
    const [questionType, setQuestionType] = useState("Multiple choice");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRequired, setIsRequired] = useState(false);

    const fileInputRef = useRef(null);
    const floatingFileRef = useRef(null);

    const [dynamicFields, setDynamicFields] = useState([]); // for toolbar added fields
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoLink, setVideoLink] = useState("");

    // Toolbar formatting
    const applyFormat = (command) => {
        document.execCommand(command, false, null);
    };

    const insertLink = () => {
        const url = prompt("Enter the link URL:");
        if (url) {
            document.execCommand("createLink", false, url);
        }
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setSelectedFile(e.target.files[0].name);
        }
    };

    // Floating Toolbar Actions
    const addField = (type) => {
        setDynamicFields([...dynamicFields, { type }]);
    };

    const handleFloatingImageClick = () => {
        floatingFileRef.current.click();
    };

    const handleFloatingFileChange = (e) => {
        if (e.target.files[0]) {
            alert("Image Uploaded: " + e.target.files[0].name);
        }
    };

    const handleFileUpload = () => {
        floatingFileRef.current.click();
    };

    const addSection = () => {
        setDynamicFields([...dynamicFields, { type: "section" }]);
    };

    const handleVideoSubmit = () => {
        alert("Video Link Added: " + videoLink);
        setShowVideoModal(false);
        setVideoLink("");
    };

    return (
        <>
        <div className="rsvs mt-5" style={{paddingTop:"30px", backgroundColor:"#f7f1ed"}}>
            <div className="rsvp-main-container">
                {/* Banner */}
                <div className="rsvp-bgpicture"></div>

                {/* Event Section */}
                <div className="rsvp-form-section">
                    <h1 className="rsvp-form-title">Event RSVP</h1>
                    <div className="rsvp-title-underline"></div>
                    <div className="rsvp-description-wrapper">
                        <div
                            className="rsvp-description-editable"
                            contentEditable="true"
                            suppressContentEditableWarning={true}
                        >
                            {description}
                        </div>
                    </div>
                </div>

                {/* RSVP Question Box */}
                <div className="rsvp-question-card">
                    <div
                        className="rsvp-question-header"
                        onClick={() => setExpandedQuestion(!expandedQuestion)}
                    >
                        <span className="rsvp-question-title">
                            Can you attend?{" "}
                            {isRequired && <span className="rsvp-required">*</span>}
                        </span>
                        {expandedQuestion && (
                            <div
                                className="rsvp-header-actions"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaImage
                                    className="rsvp-icon"
                                    onClick={handleFileClick}
                                />
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />

                                <div className="rsvp-dropdown">
                                    <select
                                        value={questionType}
                                        onChange={(e) =>
                                            setQuestionType(e.target.value)
                                        }
                                    >
                                        <option>Multiple choice</option>
                                        <option>Short answer</option>
                                        <option>Paragraph</option>
                                        <option>Checkboxes</option>
                                        <option>Dropdown</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {expandedQuestion && (
                        <>
                            {/* Toolbar */}
                            <div className="rsvp-toolbar">
                                <button
                                    className="rsvp-toolbar-btn"
                                    onClick={() => applyFormat("bold")}
                                    title="Bold"
                                >
                                    <FaBold />
                                </button>
                                <button
                                    className="rsvp-toolbar-btn"
                                    onClick={() => applyFormat("italic")}
                                    title="Italic"
                                >
                                    <FaItalic />
                                </button>
                                <button
                                    className="rsvp-toolbar-btn"
                                    onClick={() => applyFormat("underline")}
                                    title="Underline"
                                >
                                    <FaUnderline />
                                </button>
                                <button
                                    className="rsvp-toolbar-btn"
                                    onClick={insertLink}
                                    title="Insert Link"
                                >
                                    <FaLink />
                                </button>
                                <button
                                    className="rsvp-toolbar-btn"
                                    onClick={() =>
                                        applyFormat("insertUnorderedList")
                                    }
                                    title="Bullet List"
                                >
                                    <FaListUl />
                                </button>
                            </div>

                            {selectedFile && (
                                <p className="rsvp-file-name">
                                    Uploaded: {selectedFile}
                                </p>
                            )}
                        </>
                    )}

                    {/* Options */}
                    <div className="rsvp-options">
                        {questionType === "Multiple choice" && (
                            <>
                                <label>
                                    <input type="radio" name="attendance" /> Yes,
                                    I'll be there
                                </label>
                                <label>
                                    <input type="radio" name="attendance" /> Sorry,
                                    can't make it
                                </label>
                            </>
                        )}

                        {questionType === "Short answer" && (
                            <input
                                type="text"
                                placeholder="Short answer text"
                                className="rsvp-input"
                            />
                        )}

                        {questionType === "Paragraph" && (
                            <textarea
                                placeholder="Long answer text"
                                className="rsvp-textarea"
                            ></textarea>
                        )}

                        {questionType === "Checkboxes" && (
                            <>
                                <label>
                                    <input type="checkbox" /> Yes, I'll be there
                                </label>
                                <label>
                                    <input type="checkbox" /> Sorry, can't make it
                                </label>
                            </>
                        )}

                        {questionType === "Dropdown" && (
                            <select className="rsvp-select">
                                <option>Yes, I'll be there</option>
                                <option>Sorry, can't make it</option>
                            </select>
                        )}
                    </div>

                    {expandedQuestion && (
                        <div className="rsvp-actions-footer-unique">
                            <FaCopy className="rsvp-icon" />
                            <FaTrash className="rsvp-icon" />

                            <label className="rsvp-required-toggle">
                                Required
                                <input
                                    type="checkbox"
                                    checked={isRequired}
                                    onChange={() => setIsRequired(!isRequired)}
                                />
                                <span className="rsvp-slider"></span>
                            </label>
                        </div>
                    )}
                </div>

                <div className="event-mcq-card">
                    <label className="event-mcq-label">
                        How did you hear about this event?
                    </label>
                    <div className="event-mcq-options">
                        <label className="event-mcq-option">
                            <input type="radio" name="eventSource" value="Website" /> Website
                        </label>
                        <label className="event-mcq-option">
                            <input type="radio" name="eventSource" value="Friend" /> Friend
                        </label>
                        <label className="event-mcq-option">
                            <input type="radio" name="eventSource" value="Newsletter" /> Newsletter
                        </label>
                        <label className="event-mcq-option">
                            <input type="radio" name="eventSource" value="Advertisement" /> Advertisement
                        </label>
                    </div>
                </div>

                {/* Comment Box */}
                <div className="comment-mcq-card">
                    <label className="comment-mcq-label">
                        Comments and/or questions
                    </label>
                    <div className="comment-mcq-options">
                        <textarea
                            className="rsvp-long-question-textarea"
                            placeholder="Long answer text"
                        ></textarea>
                    </div>
                </div>

                {/* Dynamic Fields from Floating Toolbar */}
                {dynamicFields.map((field, index) => (
                    <div key={index} className="dynamic-field">
                        {field.type === "text" && (
                            <input
                                type="text"
                                placeholder="New short answer"
                                className="rsvp-input"
                            />
                        )}
                        {field.type === "textarea" && (
                            <textarea
                                placeholder="New long answer"
                                className="rsvp-textarea"
                            ></textarea>
                        )}
                        {field.type === "section" && (
                            <div className="event-mcq-card">
                                <label className="event-mcq-label">
                                    New Section
                                </label>
                                <p>Write your content here...</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Floating Toolbar */}
            <div className="rsvp-floating-toolbarend">
                <button
                    className="rsvp-toolbar-btnend"
                    onClick={() => addField("text")}
                    title="Add Text"
                >
                    <FaFont />
                </button>
                <button
                    className="rsvp-toolbar-btnend"
                    onClick={() => addField("textarea")}
                    title="Add Paragraph"
                >
                    <FaRegListAlt />
                </button>
                <button
                    className="rsvp-toolbar-btnend"
                    onClick={handleFloatingImageClick}
                    title="Add Image"
                >
                    <FaImage />
                </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={floatingFileRef}
                    style={{ display: "none" }}
                    onChange={handleFloatingFileChange}
                />
                <button
                    className="rsvp-toolbar-btnend"
                    onClick={() => setShowVideoModal(true)}
                    title="Add Video"
                >
                    <FaVideo />
                </button>
                <button
                    className="rsvp-toolbar-btnend"
                    onClick={handleFileUpload}
                    title="Upload File"
                >
                    <FaUpload />
                </button>
                <button
                    className="rsvp-toolbar-btnend"
                    onClick={addSection}
                    title="Add Section"
                >
                    <FaBars />
                </button>
            </div>

            {/* Video Modal */}
            {showVideoModal && (
                <div className="video-modal">
                    <div className="video-modal-content">
                        <h3>Add Video Link</h3>
                        <input
                            type="text"
                            placeholder="Paste video link here"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleVideoSubmit}>Add</button>
                            <button onClick={() => setShowVideoModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
};

export default RsvpForm;
