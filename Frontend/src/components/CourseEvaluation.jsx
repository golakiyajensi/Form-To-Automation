import React, { useState } from "react";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaLink,
    FaFont,
    FaRegListAlt,
    FaStrikethrough,
    FaImage,
    FaVideo,
    FaUpload,
    FaBars,
} from "react-icons/fa";

const CourseEvaluation = () => {
    const [description, setDescription] = useState(
        "Please submit feedback regarding the course you have just completed, including feedback on course structure, content, and instructor."
    );
    const [className, setClassName] = useState("");
    const [instructor, setInstructor] = useState("");
    const [effort, setEffort] = useState("");

    // Dynamic sections state
    const [sections, setSections] = useState([]);

    // Modal state
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoUrl, setVideoUrl] = useState("");

    // Add section handler
    const addSection = (type, content = "") => {
        setSections([...sections, { type, content }]);
    };

    // Update section content
    const handleSectionChange = (index, value) => {
        const updated = [...sections];
        updated[index].content = value;
        setSections(updated);
    };

    // Image Upload handler
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imgUrl = URL.createObjectURL(file);
            addSection("image", imgUrl);
        }
    };

    // Video Insert handler
    const insertVideo = () => {
        if (videoUrl.trim() !== "") {
            addSection("video", videoUrl);
            setVideoUrl("");
            setShowVideoModal(false);
        }
    };

    // Level of Effort
    const effortOptions = ["Poor", "Fair", "Satisfactory", "Very good", "Excellent"];

    // Contribution to Learning
    const contribOptions = ["Poor", "Fair", "Satisfactory", "Very good", "Excellent"];
    const contribQuestions = [
        "Level of skill/knowledge gained",
        "Level of skill/knowledge applied",
        "Level of skill/knowledge improved",
        "Contribution of course to learning",
    ];
    const [contribResponses, setContribResponses] = useState({});
    const handleContribChange = (qIndex, value) => {
        setContribResponses({ ...contribResponses, [qIndex]: value });
    };

    // Instructor Skill & Responsiveness
    const instrOptions = [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
    ];
    const instrQuestions = [
        "Instructor was well prepared",
        "Presentations were clear",
        "Instructor stimulated interest",
        "Instructor was effective",
        "Instructor was responsive",
        "Grading was prompt & fair",
    ];
    const [instrResponses, setInstrResponses] = useState({});
    const handleInstrChange = (qIndex, value) => {
        setInstrResponses({ ...instrResponses, [qIndex]: value });
    };

    // Course Content
    const contentOptions = [
        "Strongly disagree",
        "Disagree",
        "Neutral",
        "Agree",
        "Strongly agree",
    ];
    const contentQuestions = [
        "Learning objectives were clear",
        "Course content was relevant",
        "Course workload was appropriate",
        "Course organization was effective",
    ];
    const [contentResponses, setContentResponses] = useState({});
    const handleContentChange = (qIndex, value) => {
        setContentResponses({ ...contentResponses, [qIndex]: value });
    };

    // Feedback Questions
    const [feedback, setFeedback] = useState({
        useful: "",
        improve: "",
        reason: "",
    });
    const handleFeedbackChange = (field, value) => {
        setFeedback({ ...feedback, [field]: value });
    };


    return (
        <>
            <div className="bg-color">
                <div className="course-evaluation">
                    {/* Banner */}
                    <div className="course-bg"></div>

                    {/* Card Content */}
                    <div className="courseevaluation-card-content">
                        <h2 className="courseevaluation-title">Course Evaluation</h2>
                        <div className="courseevaluation-divider"></div>

                        {/* Toolbar */}
                        <div className="courseevaluation-toolbar">
                            <button className="courseevaluation-toolbar-btn">
                                <FaBold />
                            </button>
                            <button className="courseevaluation-toolbar-btn">
                                <FaItalic />
                            </button>
                            <button className="courseevaluation-toolbar-btn">
                                <FaUnderline />
                            </button>
                            <button className="courseevaluation-toolbar-btn">
                                <FaLink />
                            </button>
                            <button className="courseevaluation-toolbar-btn">
                                <FaStrikethrough />
                            </button>
                        </div>

                        {/* Description */}
                        <textarea
                            className="courseevaluation-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                    {/* Class + Instructor */}
                    <div className="courseevaluation-form">
                        <div className="courseevaluation-fieldtop">
                            <label className="courseevaluation-label">
                                Class name <span className="courseevaluation-required">*</span>
                            </label>
                            <input
                                type="text"
                                className="courseevaluation-input"
                                placeholder="Short answer text"
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                            />
                        </div>

                        <div className="courseevaluation-field">
                            <label className="courseevaluation-label">
                                Instructor <span className="courseevaluation-required">*</span>
                            </label>
                            <input
                                type="text"
                                className="courseevaluation-input"
                                placeholder="Short answer text"
                                value={instructor}
                                onChange={(e) => setInstructor(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Level of Effort */}
                    <div className="courseevaluation-effort-field">
                        <label className="courseevaluation-effort-label">
                            Level of effort <span className="courseevaluation-required">*</span>
                        </label>

                        <div className="courseevaluation-effort-options">
                            {effortOptions.map((opt, index) => (
                                <label key={index} className="courseevaluation-effort-option">
                                    <input
                                        type="radio"
                                        name="levelOfEffort"
                                        value={opt}
                                        checked={effort === opt}
                                        onChange={(e) => setEffort(e.target.value)}
                                    />
                                    <span className="courseevaluation-effort-text">{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>


                    {/* Contribution to Learning */}
                    <div className="ce-matrix">
                        <h3 className="ce-title">Contribution to learning</h3>
                        <table className="ce-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {contribOptions.map((opt, i) => (
                                        <th key={i} className="ce-option-header">
                                            {opt}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {contribQuestions.map((q, qIndex) => (
                                    <tr key={qIndex}>
                                        <td className="ce-question">{q}</td>
                                        {contribOptions.map((opt, i) => (
                                            <td key={i} className="ce-cell">
                                                <input
                                                    type="radio"
                                                    name={`contrib-${qIndex}`}
                                                    value={opt}
                                                    checked={contribResponses[qIndex] === opt}
                                                    onChange={() => handleContribChange(qIndex, opt)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Instructor Evaluation */}
                    <div className="sr-matrix">
                        <h3 className="sr-title">Skill and responsiveness of the instructor</h3>
                        <table className="sr-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {instrOptions.map((opt, i) => (
                                        <th key={i} className="sr-option">
                                            {opt}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {instrQuestions.map((q, qIndex) => (
                                    <tr key={qIndex}>
                                        <td className="sr-question">{q}</td>
                                        {instrOptions.map((opt, i) => (
                                            <td key={i} className="sr-cell">
                                                <input
                                                    type="radio"
                                                    name={`instr-${qIndex}`}
                                                    value={opt}
                                                    checked={instrResponses[qIndex] === opt}
                                                    onChange={() => handleInstrChange(qIndex, opt)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Course Content */}
                    <div className="coursecontent">
                        <h3 className="coursecontent-title">Course content</h3>
                        <table className="coursecontent-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {contentOptions.map((opt, index) => (
                                        <th key={index} className="coursecontent-option">
                                            {opt}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {contentQuestions.map((q, qIndex) => (
                                    <tr key={qIndex}>
                                        <td className="coursecontent-question">{q}</td>
                                        {contentOptions.map((opt, i) => (
                                            <td key={i} className="coursecontent-cell">
                                                <input
                                                    type="radio"
                                                    name={`content-${qIndex}`}
                                                    value={opt}
                                                    checked={contentResponses[qIndex] === opt}
                                                    onChange={() => handleContentChange(qIndex, opt)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Extra Feedback Questions */}
                    <div className="ec-container">
                        <div className="ec-box">
                            <label className="ec-label">
                                What aspects of this course were most useful or valuable?
                            </label>
                            <textarea
                                className="ec-textarea"
                                placeholder="Long answer text"
                                value={feedback.useful}
                                onChange={(e) => handleFeedbackChange("useful", e.target.value)}
                            />
                        </div>

                        <div className="ec-box">
                            <label className="ec-label">How would you improve this course?</label>
                            <textarea
                                className="ec-textarea"
                                placeholder="Long answer text"
                                value={feedback.improve}
                                onChange={(e) => handleFeedbackChange("improve", e.target.value)}
                            />
                        </div>

                        <div className="ec-box">
                            <label className="ec-label">Why did you choose this course?</label>
                            <div className="ec-options">
                                {["Degree requirement", "Time offered", "Interest"].map((opt, i) => (
                                    <label key={i} className="ec-option">
                                        <input
                                            type="radio"
                                            name="reason"
                                            value={opt}
                                            checked={feedback.reason === opt}
                                            onChange={() => handleFeedbackChange("reason", opt)}
                                        />
                                        {opt}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>







































































































                    {/* Render Dynamic Sections */}
                    <div className="dynamic-sections">
                        {sections.map((sec, index) => (
                            <div key={index} className="dynamic-section">
                                {sec.type === "text" && (
                                    <>
                                        <h4>Add Text</h4>
                                        <input
                                            type="text"
                                            className="dynamic-input"
                                            placeholder="Enter text"
                                            value={sec.content}
                                            onChange={(e) =>
                                                handleSectionChange(index, e.target.value)
                                            }
                                        />
                                    </>
                                )}
                                {sec.type === "paragraph" && (
                                    <>
                                        <h4>Add Paragraph</h4>
                                        <textarea
                                            className="dynamic-textarea"
                                            placeholder="Enter paragraph"
                                            value={sec.content}
                                            onChange={(e) =>
                                                handleSectionChange(index, e.target.value)
                                            }
                                        ></textarea>
                                    </>
                                )}
                                {sec.type === "image" && (
                                    <>
                                        <h4>Add Image</h4>
                                        <img
                                            src={sec.content}
                                            alt="Uploaded Preview"
                                            className="dynamic-image"
                                        />
                                    </>
                                )}
                                {sec.type === "video" && (
                                    <>
                                        <h4>Add Video</h4>
                                        <iframe
                                            width="560"
                                            height="315"
                                            src={sec.content}
                                            title="Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </>
                                )}
                                {sec.type === "file" && (
                                    <>
                                        <h4>Upload File</h4>
                                        <input type="file" className="dynamic-file" />
                                    </>
                                )}
                                {sec.type === "section" && (
                                    <div className="dynamic-subsection">
                                        <h4>New Section</h4>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Floating Toolbar */}
                    <div className="cour-evulation-floating-toolbar">
                        <button
                            className="cour-evulation-toolbar-btn"
                            title="Add Text"
                            onClick={() => addSection("text")}
                        >
                            <FaFont />
                        </button>
                        <button
                            className="cour-evulation-toolbar-btn"
                            title="Add Paragraph"
                            onClick={() => addSection("paragraph")}
                        >
                            <FaRegListAlt />
                        </button>
                        <label className="cour-evulation-toolbar-btn" title="Add Image">
                            <FaImage />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                            />
                        </label>
                        <button
                            className="cour-evulation-toolbar-btn"
                            title="Add Video"
                            onClick={() => setShowVideoModal(true)}
                        >
                            <FaVideo />
                        </button>
                        <button
                            className="cour-evulation-toolbar-btn"
                            title="Upload File"
                            onClick={() => addSection("file")}
                        >
                            <FaUpload />
                        </button>
                        <button
                            className="cour-evulation-toolbar-btn"
                            title="Add Section"
                            onClick={() => addSection("section")}
                        >
                            <FaBars />
                        </button>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showVideoModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Insert Video URL</h3>
                        <input
                            type="text"
                            placeholder="Enter video URL"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="modal-input"
                        />
                        <div className="modal-actions">
                            <button onClick={insertVideo} className="modal-btn">
                                Insert
                            </button>
                            <button
                                onClick={() => setShowVideoModal(false)}
                                className="modal-btn cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseEvaluation;
