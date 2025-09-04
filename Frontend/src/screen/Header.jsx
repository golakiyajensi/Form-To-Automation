import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Profile state
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Hi, Divyesh!",
    email: "divyesh1234@gmail.com",
    photo: "/img/logo.png",
  });

  // App logo + title state
  const [appLogo, setAppLogo] = useState("/img/forms.png");
  const [appTitle, setAppTitle] = useState("Forms");

  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Example accounts
  const accounts = [
    {
      name: "Divyesh",
      email: "divyesh1234@gmail.com",
      photo: "/img/logo.png",
    },
    {
      name: "John Doe",
      email: "john.doe@gmail.com",
      photo: "/img/form.png",
    },
    {
      name: "Jane Smith",
      email: "jane.smith@gmail.com",
      photo: "/img/user.png",
    },
  ];

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

  // Handle sidebar clicks
  const handleSidebarClick = (logo, title, path) => {
    setAppLogo(logo);
    setAppTitle(title);
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="forms-header container-fluid shadow-sm py-2 bg-white">
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
              src={appLogo}
              alt="App Logo"
              className="logo me-2"
              style={{ height: "32px" }}
            />
            <span className="forms-title fw-semibold fs-5">{appTitle}</span>
          </div>

          {/* Middle: search bar */}
          <div className="col d-none d-md-block">
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

            {/* Profile Section */}
            <div ref={profileRef}>
              <img
                src={profile.photo}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "32px", height: "32px", cursor: "pointer" }}
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div
                  className="card shadow border-0 position-absolute end-0 mt-3"
                  style={{ width: "400px", zIndex: 1050 }}
                >
                  <div className="card-body text-center">
                    <img
                      src={profile.photo}
                      alt="profile"
                      className="rounded-circle mb-2"
                      style={{ width: "70px", height: "70px" }}
                    />
                    <h6 className="fw-semibold mb-0">{profile.name}</h6>
                    <small className="text-muted">{profile.email}</small>

                    <div className="mt-3">
                      <button className="btn btn-outline-primary w-100 mb-2">
                        Manage your Google Account
                      </button>
                    </div>
                  </div>

                  {/* Account Switcher */}
                  <div className="list-group list-group-flush">
                    {accounts.map((acc, index) => (
                      <button
                        key={index}
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={() => {
                          setProfile(acc);
                          setProfileOpen(false);
                        }}
                      >
                        <img
                          src={acc.photo}
                          alt={acc.name}
                          className="rounded-circle me-2"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <div>
                          <div className="fw-semibold">{acc.name}</div>
                          <small className="text-muted">{acc.email}</small>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="card-body">
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
            <img src="/img/logo.png" className="image" alt="" />
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
              onClick={() => navigate("/docsgallery")}

            >
              <img src="/img/docs.png" alt="Docs" className="sidelogo me-2" />
              Docs
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleSidebarClick("/img/sheets.png", "Sheets", "/sheetgallery")
              }
            >
              <img src="/img/sheets.png" alt="Sheets" className="sidelogo me-2" />
              Sheets
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleSidebarClick("/img/slides.png", "Slides", "/slidetemplate")
              }
            >
              <img src="/img/slides.png" alt="Slides" className="sidelogo me-2" />
              Slides
            </li>
            <li
              className="d-flex align-items-center mb-1"
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleSidebarClick("/img/forms.png", "Forms", "/formgallery")
              }
            >
              <img src="/img/forms.png" alt="Forms" className="sidelogo me-2" />
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
                src="/img/Google-Drive.png"
                alt="Drive"
              />
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
