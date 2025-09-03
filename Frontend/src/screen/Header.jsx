import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

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
      {/* HEADER */}
      <header className="forms-header container-fluid shadow-sm py-2">
        <div className="row align-items-center w-100">
          {/* Left: menu + logo + title */}
          <div className="col-auto d-flex align-items-center">
            <button
              className="btn btn-link text-dark me-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list" style={{ fontSize: "22px" }}></i>
            </button>
            <img
              src="https://www.gstatic.com/images/branding/product/1x/forms_48dp.png"
              alt="Forms Logo"
              className="logo me-2"
              style={{ height: "32px" }}
            />
            <span className="forms-title fw-semibold fs-5">Forms</span>
          </div>

          {/* Middle: search bar */}
          <div className="col d-none d-md-block" style={{ justifyItems: "center" }}>
            <div className="search-bar border rounded-pill px-4 d-flex align-items-center">
              <i className="bi bi-search text-muted"></i>
              <input
                type="text"
                placeholder="Search"
                className="form-control border-0"
              />
            </div>
          </div>

          {/* Right: grid + profile */}
          <div className="col-auto d-flex align-items-center position-relative">
            <button className="btn btn-link text-dark me-2">
              <i className="bi bi-grid-3x3-gap" style={{ fontSize: "22px" }}></i>
            </button>

            {/* Profile Icon */}
            <div ref={profileRef}>
              <i
                className="bi bi-person-circle text-secondary"
                style={{ fontSize: "32px", cursor: "pointer" }}
                onClick={() => setProfileOpen(!profileOpen)}
              ></i>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="card shadow border-0 position-absolute end-0 mt-3">
                  <div className="card-body text-center">
                    {/* Profile Picture */}
                    <img
                      src="./img/logo.png"
                      alt="profile"
                      className="rounded-circle mb-2"
                      style={{ width: "70px", height: "70px" }}
                    />
                    <h6 className="fw-semibold mb-0">Hi, Divyesh!</h6>
                    <small className="text-muted">divyesh1234@gmail.com</small>

                    <div className="mt-3">
                      <button className="btn btn-outline-primary w-100 mb-2">
                        Manage your Google Account
                      </button>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-light w-50 me-1"
                          onClick={() => navigate("/signin")}
                        >
                          Add account
                        </button>
                        <button className="btn btn-light w-50 ms-1">
                          Sign out
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer text-center small">
                    <a href="#" className="text-muted me-2">
                      Privacy Policy
                    </a>
                    ·
                    <a href="#" className="text-muted ms-2">
                      Terms of Service
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SIDEBAR */}
      <div
        className={`offcanvas offcanvas-start ${sidebarOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{
          visibility: sidebarOpen ? "visible" : "hidden",
          maxWidth: "18%",
        }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">
            <img src="./img/logo.png" className="image" alt="" />
          </h5>
          <button
            className="btn-close"
            onClick={() => setSidebarOpen(false)}
          ></button>
        </div>
        <hr />
        <div className="offcanvas-body">
          <ul className="list-unstyled">
            <li className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/docsgallery")}

            >
              <img
                src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png"
                alt="Docs"
                className="me-2"
              />
              Docs
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/sheetgallery")}
            >
              <img
                src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
                alt="Sheets"
                className="me-2"
              />
              Sheets
            </li>
            <li className="d-flex align-items-center mb-1">
              <img
                src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_presentation_x16.png"
                alt="Slides"
                className="me-2"
              />
              Slides
            </li>


            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/formgallery")}
            >
              <img
                src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_form_x16.png"
                alt="Forms"
                className="me-2"
              />
              Forms
            </li>

            <hr />
            <li className="mb-1">
              <i className="bi bi-gear me-2"></i> Settings
            </li>
            <li className="mb-1">
              <i className="bi bi-question-circle me-2"></i> Help & Feedback
            </li>
            <hr />
            <li className="mb-1">
              <img
                className="drive me-2"
                src="./img/Google-Drive.png"
                alt=""
              />{" "}
              Drive
            </li>
            <hr />
          </ul>
        </div>
        <div className="offcanvas-footer text-center small border-top py-2">
          <a href="#" className="text-muted me-2">
            Privacy Policy
          </a>
          ·
          <a href="#" className="text-muted ms-2">
            Terms of Service
          </a>
        </div>
      </div>
    </>
  );
};

export default Header;
