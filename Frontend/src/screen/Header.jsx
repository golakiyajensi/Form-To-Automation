// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // ✅ Map path → logo + title
  const headerConfig = {
    "/docs": {
      logo: "./img/docs.png",
      title: "Docs",
    },
    "/sheets": {
      logo: "./img/sheets.png",
      title: "Sheets",
    },
    "/slide": {
      logo: "./img/slides.png",
      title: "Slides",
    },
    "/forms": {
      logo: "./img/forms.png",
      title: "Forms",
    },
  };

  // ✅ current header (default = Forms)
  const currentHeader = headerConfig[location.pathname] || headerConfig["/forms"];

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
      <header className="forms-header container-fluid shadow-sm py-2 bg-white">
        <div className="row align-items-center w-100">
          {/* Left: menu + dynamic logo + dynamic title */}
          <div className="col-auto d-flex align-items-center">
            <button
              className="btn btn-link text-dark me-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list" style={{ fontSize: "22px" }}></i>
            </button>
            <img
              src={currentHeader.logo}
              alt={`${currentHeader.title} Logo`}
              className="logo me-2"
              style={{ height: "32px" }}
            />
            <span className="fw-semibold fs-5">{currentHeader.title}</span>
          </div>

          {/* Middle: search bar */}
          <div className="col d-none d-md-block">
            <div className="search-bar border rounded-pill px-4 d-flex align-items-center">
              <i className="bi bi-search text-muted"></i>
              <input
                type="text"
                placeholder={`Search ${currentHeader.title}`}
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
                        <button className="btn btn-light w-50 me-1">
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
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/docs")}
            >
              <img src="./img/docs.png" alt="Docs" className="side me-2" />
              Docs
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/sheets")}
            >
              <img src="./img/sheets.png" alt="Sheets" className="side me-2" />
              Sheets
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/slide")}
            >
              <img src="./img/slides.png" alt="Slides" className="side me-2" />
              Slides
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/forms")}
            >
              <img src="./img/forms.png" alt="Forms" className="side me-2" />
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
