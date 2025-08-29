// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Map path → logo + title
  const headerConfig = {
    "/docs": { logo: "./img/docs.png", title: "Docs" },
    "/sheets": { logo: "./img/sheets.png", title: "Sheets" },
    "/slide": { logo: "./img/slides.png", title: "Slides" },
    "/forms": { logo: "./img/forms.png", title: "Forms" },
  };
  const currentHeader =
    headerConfig[location.pathname] || headerConfig["/forms"];

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
          <img src={currentHeader.logo} alt="Logo" className="me-2" />
          <span className="fw-bold">{currentHeader.title}</span>
        </div>

        {/* Search Bar */}
        <div className="col d-none d-md-block mx-3">
          <div className="search-bar border rounded-pill px-4 d-flex align-items-center">
            <i className="bi bi-search text-muted"></i>
            <input
              type="text"
              placeholder={`Search ${currentHeader.title}`}
              className="form-control border-0"
            />
          </div>
        </div>

        {/* Profile + Apps */}
        <div className="col-auto d-flex align-items-center position-relative">
          <button className="btn btn-link text-dark me-2">
            <i className="bi bi-grid-3x3-gap" style={{ fontSize: "22px" }}></i>
          </button>

          <div ref={profileRef}>
            <i
              className="bi bi-person-circle text-secondary"
              style={{ fontSize: "32px", cursor: "pointer" }}
              onClick={() => setProfileOpen(!profileOpen)}
            ></i>

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
          <li onClick={() => navigate("/docs")}>Docs</li>
          <li onClick={() => navigate("/docstemplate")}>Docs Template</li>
          <li onClick={() => navigate("/docsgallery")}>Docs Gallery</li>
          <li onClick={() => navigate("/sheets")}>Sheets</li>
          <li onClick={() => navigate("/sheetgallery")}>Sheets Gallery</li>
          <li onClick={() => navigate("/slide")}>Slides</li>
          <li onClick={() => navigate("/forms")}>Forms</li>
          <li onClick={() => navigate("/formgallery")}>Form Gallery</li>
          <li onClick={() => navigate("/gallery")}>Gallery</li>
        </ul>
      </div>
    </>
  );
};

export default Header;
