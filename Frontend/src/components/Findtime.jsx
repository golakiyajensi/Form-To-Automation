// Findtime.jsx
import React, { useState } from "react";
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

const Findtime = () => {
    const [description, setDescription] = useState(
        "We need to get together to talk about some things - when do you have time to meet?"
    );

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const times = ["Morning", "Midday", "Afternoon", "Evening"];

    const [discussion, setDiscussion] = useState("");
    const [dietary, setDietary] = useState("");

    const [customFields, setCustomFields] = useState([]);

    // Modal states
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    // Add Field
    const handleAddField = (type, extra = null) => {
        setCustomFields((prev) => [
            ...prev,
            { id: Date.now(), type, data: extra },
        ]);
    };

    // Insert Video
    const handleInsertVideo = () => {
        if (videoUrl.trim() !== "") {
            handleAddField("video", videoUrl);
            setVideoUrl("");
            setIsVideoModalOpen(false);
        }
    };

    // Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            handleAddField("image", imageUrl);
        }
    };

    return (
        <div className="full-bg">
            <div className="find-time">
                <div className="time-bg"></div>

                <div className="findtime-card-content">
                    <h2 className="findtime-title">Find a Time</h2>
                    <div className="findtime-divider"></div>

                    {/* Toolbar */}
                    <div className="findtime-toolbar">
                        <button className="findtime-toolbar-btn">
                            <FaBold />
                        </button>
                        <button className="findtime-toolbar-btn">
                            <FaItalic />
                        </button>
                        <button className="findtime-toolbar-btn">
                            <FaUnderline />
                        </button>
                        <button className="findtime-toolbar-btn">
                            <FaLink />
                        </button>
                        <button className="findtime-toolbar-btn">
                            <FaStrikethrough />
                        </button>
                    </div>

                    {/* Description */}
                    <textarea
                        className="findtime-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                    <div className="find-para">
                        <p>Let's meet at 123 Your Street Your City, ST 12345</p>
                    </div>

                    {/* Email Field */}
                    <div className="email-field">
                        <div className="email-label-wrapper">
                            <span className="email-label">Email</span>
                            <span className="email-required">*</span>
                        </div>
                        <div className="email-input-wrapper">
                            <input
                                type="email"
                                className="email-input"
                                placeholder="Valid email"
                            />
                        </div>
                    </div>
                    <div className="changing pt-3">
                        <p>
                            This form is collecting emails.{" "}
                            <a href="#">Change settings</a>
                        </p>
                    </div>
                </div>

                {/* Time Selection */}
                <div className="find-time-box">
                    <h3 className="find-time-box-title">
                        What times are you available?
                    </h3>
                    <p className="find-time-box-subtitle">
                        Please select all that apply
                    </p>

                    <div className="find-time-box-table">
                        <div className="find-time-box-row find-time-box-header">
                            <div className="find-time-box-cell"></div>
                            {times.map((time) => (
                                <div
                                    key={time}
                                    className="find-time-box-cell header-cell"
                                >
                                    {time}
                                </div>
                            ))}
                        </div>

                        {days.map((day) => (
                            <div key={day} className="find-time-box-row">
                                <div className="find-time-box-cell day-cell">
                                    {day}
                                </div>
                                {times.map((time) => (
                                    <div
                                        key={time}
                                        className="find-time-box-cell"
                                    >
                                        <input
                                            type="checkbox"
                                            className="find-time-box-checkbox"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="findtime-wrapper">
                    {/* Items to Discuss */}
                    <div className="items-to-discuss">
                        <h3 className="section-title">Items to discuss?</h3>
                        <textarea
                            className="discussion-input"
                            placeholder="Long answer text"
                            value={discussion}
                            onChange={(e) => setDiscussion(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Dietary Restrictions */}
                    <div className="dietary-restrictions">
                        <h3 className="section-title">
                            Allergies or dietary restrictions?
                        </h3>
                        <div className="options">
                            {[
                                "Vegetarian",
                                "Vegan",
                                "Kosher",
                                "Halal",
                                "Gluten-free",
                                "None",
                                "Other",
                            ].map((option) => (
                                <label key={option}>
                                    <input
                                        type="radio"
                                        name="dietary"
                                        value={option}
                                        checked={dietary === option}
                                        onChange={(e) =>
                                            setDietary(e.target.value)
                                        }
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Comments */}
                <div className="timecomment-container">
                    <label className="timecomment-label">
                        Any other comments and/or questions?
                    </label>
                    <textarea
                        className="timecomment-textarea"
                        placeholder="Long answer text"
                    />
                </div>

                {/* Dynamic Fields */}
                <div className="custom-added-fields">
                    {customFields.map((field) => (
                        <div key={field.id} className="added-field">
                            <h4 className="field-heading">
                                {field.type === "text" && "Add Text"}
                                {field.type === "paragraph" && "Add Paragraph"}
                                {field.type === "image" && "Add Image"}
                                {field.type === "video" && "Add Video"}
                                {field.type === "file" && "Upload File"}
                                {field.type === "section" && "Add Section"}
                            </h4>

                            {field.type === "text" && (
                                <input
                                    type="text"
                                    className="dynamic-input"
                                    placeholder="Enter text"
                                />
                            )}
                            {field.type === "paragraph" && (
                                <textarea
                                    className="dynamic-textarea"
                                    placeholder="Enter paragraph"
                                />
                            )}
                            {field.type === "image" && (
                                <img
                                    src={field.data}
                                    alt="Uploaded"
                                    className="preview-img"
                                />
                            )}
                            {field.type === "video" && (
                                <iframe
                                    width="100%"
                                    height="250"
                                    src={field.data}
                                    title="Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                            {field.type === "file" && (
                                <input type="file" className="dynamic-file" />
                            )}
                            {field.type === "section" && (
                                <div className="dynamic-section">
                                    <h4>New Section</h4>
                                    <textarea placeholder="Section content"></textarea>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Floating Toolbar */}
                <div className="custom-floating-toolbar">
                    <button title="Add Text" onClick={() => handleAddField("text")}>
                        <FaFont />
                    </button>
                    <button
                        title="Add Paragraph"
                        onClick={() => handleAddField("paragraph")}
                    >
                        <FaRegListAlt />
                    </button>
                    <button title="Add Image">
                        <label>
                            <FaImage />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                        </label>
                    </button>
                    <button
                        title="Add Video"
                        onClick={() => setIsVideoModalOpen(true)}
                    >
                        <FaVideo />
                    </button>
                    <button
                        title="Upload File"
                        onClick={() => handleAddField("file")}
                    >
                        <FaUpload />
                    </button>
                    <button
                        title="Add Section"
                        onClick={() => handleAddField("section")}
                    >
                        <FaBars />
                    </button>
                </div>

                {/* Video Modal */}
                {isVideoModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal01">
                            <h3>Add Video URL</h3>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="Paste video embed URL"
                            />
                            <div className="modal-actions">
                                <button onClick={handleInsertVideo}>
                                    Insert
                                </button>
                                <button onClick={() => setIsVideoModalOpen(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Findtime;
