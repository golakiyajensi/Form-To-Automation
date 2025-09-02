import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./TemplateGallery.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";

const templates = [
  { id: 1, title: "Blank spreadsheet", img: "https://ssl.gstatic.com/docs/templates/thumbnails/sheets-blank-googlecolors.png" },
  { id: 2, title: "To-do list", img: "/img/sheet-1.png" },
  { id: 3, title: "Annual budget", img: "/img/sheet-2.png" },
  { id: 4, title: "Monthly budget", img: "/img/sheet-3.png" },
  { id: 5, title: "Google Finance Invest…", img: "/img/sheet-4.png" },
  { id: 6, title: "Annual Calendar", img: "/img/sheet-5.png" }
];

const files = [
  {
    id: 1,
    name: "To-do list",
    owner: "me",
    lastOpened: "2:19 PM",
    icon: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
  }
];

const TemplateGallery = () => {
  const [selected, setSelected] = useState("Owned by anyone");
  const navigate = useNavigate();

  const options = ["Owned by anyone", "Owned by me", "Not owned by me"];

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <div className="sheet-gallery">
        <div className="container">
          <div className="gallery-head">
            <h6 className="head-txt">Start a new spreadsheet</h6>
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-light border-0 bg-transparent d-flex align-items-center gap-3"
                onClick={() => navigate("/templategallery")}
              >
                <span>Template gallery</span>
                <div className="d-flex flex-column align-items-center">
                  <i className="bi bi-chevron-up up-btn"></i>
                  <i className="bi bi-chevron-down down-btn"></i>
                </div>
              </button>

              <div className="dropdown-container" ref={menuRef}>
                <button className="dropdown-toggle-btn" onClick={toggleDropdown}>
                  <FontAwesomeIcon icon={faEllipsisVertical} className="setting-btn" />
                </button>

                {isOpen && (
                  <div className="custom-dropdown-menu">
                    <div className="custom-dropdown-item">Hide all templates</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ✅ Grid instead of col classes */}
          <div className="template-grid1">
            {templates.map((template) => (
              <div key={template.id} className="template-card1 text-center">
                <img src={template.img} alt={template.title} className="template-img1" />
                <p className="mt-2">{template.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="file-container">
          {/* Header */}
          <div className="file-header">
            <div className="file-title">Today</div>

            <div className="dropdown">
              <button
                className="btn dropdown-toggle custom-dropdown-btn"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {selected}
              </button>
              <ul className="dropdown-menu custom-dropdown-menu">
                {options.map((option, index) => (
                  <li key={index}>
                    <button
                      className={`dropdown-item ${option === selected ? "active" : ""}`}
                      onClick={() => setSelected(option)}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="file-header-center">Last opened by me</div>

            <div className="file-header-actions">
              <i className="bi bi-grid"></i>
              <i className="bi bi-sort-alpha-down"></i>
              <i className="bi bi-folder"></i>
            </div>
          </div>

          {/* File Rows */}
          {files.map((file) => (
            <div key={file.id} className="file-row">
              <div className="file-icon-wrapper">
                <img src={file.icon} alt="file-icon" className="file-icon" />
              </div>
              <div className="file-name">{file.name}</div>
              <div className="file-owner">{file.owner}</div>
              <div className="file-last-opened">{file.lastOpened}</div>

              <div className="file-actions">
                <i className="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
