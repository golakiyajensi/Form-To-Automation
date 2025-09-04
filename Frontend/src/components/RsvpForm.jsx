import React, { useState } from "react";
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaLink,
    FaListUl,
} from "react-icons/fa";

const RsvpForm = () => {
    const [description] = useState(
        "Event Address: 123 Your Street, Your City, ST 12345\nContact us at (123) 456-7890 or no_reply@example.com"
    );
    const [isExpanded, setIsExpanded] = useState(false);

    const applyFormat = (command) => {
        document.execCommand(command, false, null);
    };

    const insertLink = () => {
        const url = prompt("Enter the link URL:");
        if (url) {
            document.execCommand("createLink", false, url);
        }
    };

    return (
        <>
            <div className="container">
                <div className="bgpicture"></div>
            </div>

            <div className="form-section-container">
                <h1
                    className={`form-main-title ${isExpanded ? "active" : ""}`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    Event RSVP
                </h1>

                {isExpanded && <div className="title-underline"></div>}

             
                {isExpanded && (
                    <div className="toolbar">
                        <button
                            className="toolbar-btn"
                            onClick={() => applyFormat("bold")}
                            title="Bold"
                        >
                            <FaBold />
                        </button>
                        <button
                            className="toolbar-btn"
                            onClick={() => applyFormat("italic")}
                            title="Italic"
                        >
                            <FaItalic />
                        </button>
                        <button
                            className="toolbar-btn"
                            onClick={() => applyFormat("underline")}
                            title="Underline"
                        >
                            <FaUnderline />
                        </button>
                        <button
                            className="toolbar-btn"
                            onClick={insertLink}
                            title="Insert Link"
                        >
                            <FaLink />
                        </button>
                        <button
                            className="toolbar-btn"
                            onClick={() => applyFormat("insertUnorderedList")}
                            title="Bullet List"
                        >
                            <FaListUl />
                        </button>
                    </div>
                )}

                <div className="form-description-wrapper">
                    <div
                        className="form-description-editable"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                    >
                        {description}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RsvpForm;
