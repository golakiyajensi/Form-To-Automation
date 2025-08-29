// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm px-3">
        <div className="d-flex align-items-center">
          <i
            className="bi bi-list fs-4 me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          ></i>
          <img
            src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png"
            alt="Logo"
            className="me-2"
          />
          <span className="fw-bold">Google Apps Clone</span>
        </div>

        <div className="ms-auto d-flex align-items-center">
          {/* Profile Menu */}
          <div ref={profileRef} className="position-relative">
            <i
              className="bi bi-person-circle fs-4"
              style={{ cursor: "pointer" }}
              onClick={() => setProfileOpen(!profileOpen)}
            ></i>
            {profileOpen && (
              <div className="dropdown-menu dropdown-menu-end show mt-2 shadow-sm">
                <button className="dropdown-item">My Account</button>
                <button className="dropdown-item">Settings</button>
                <button className="dropdown-item text-danger">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`bg-white border-end position-fixed top-0 start-0 vh-100 p-3 shadow-sm ${
          sidebarOpen ? "d-block" : "d-none"
        }`}
        style={{ width: "250px", zIndex: 1050 }}
      >
        <h5 className="mb-4">Menu</h5>
        <ul className="list-unstyled">

          {/* Docs */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/docs")}
          >
            <img src="./img/docs.png" alt="Docs" className="me-2" />
            Docs
          </li>

          {/* Docs Template */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/docstemplate")}
          >
            <img
              src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png"
              alt="Docs Template"
              className="me-2"
            />
            Docs Template
          </li>

          {/* Docs Gallery */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/docsgallery")}
          >
            <i className="bi bi-card-text me-2"></i>
            Docs Gallery
          </li>

          {/* Sheets */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/sheets")}
          >
            <img src="./img/sheets.png" alt="Sheets" className="me-2" />
            Sheets
          </li>

          {/* Sheet Gallery */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/sheetgallery")}
          >
            <img
              src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
              alt="Sheets Gallery"
              className="me-2"
            />
            Sheets Gallery
          </li>

          {/* Slides */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/slide")}
          >
            <img src="./img/slides.png" alt="Slides" className="me-2" />
            Slides
          </li>

          {/* Forms */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/forms")}
          >
            <img src="./img/forms.png" alt="Forms" className="me-2" />
            Forms
          </li>

          {/* Form Gallery */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/formgallery")}
          >
            <i className="bi bi-ui-radios me-2"></i>
            Form Gallery
          </li>

          {/* Gallery */}
          <li
            className="d-flex align-items-center mb-2"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/gallery")}
          >
            <i className="bi bi-images me-2"></i>
            Gallery
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
