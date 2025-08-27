import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Logo from "../Images/logo.png";

export default function Signin() {
  const [language, setLanguage] = useState("English (United States)");

  const languages = [
    "English (United States)",
    "English (United Kingdom)",
    "हिन्दी (Hindi)",
    "Español (Spanish)",
    "Français (French)",
    "Deutsch (German)",
    "日本語 (Japanese)",
    "中文 (Chinese)"
  ];

  return (
    <div className="signin-container d-flex flex-column justify-content-center">
      <div className="container">
        {/* Center Box */}
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="signin-card shadow-sm rounded-4">
            <div>
                {/* Google Logo */}
                <div className="text-start mb-4">
                    <img
                    src={Logo}
                    className="google-logo"
                    />
                </div>

                {/* Heading */}
                <h3 className="text-dark">Sign in</h3>
                <p className="mt-3 account-txt text-dark">Use your Google Account</p>
            </div>

            <div className="txt-column">
                {/* Email / Phone */}
                <div className="mb-3">
                    <input
                    type="text"
                    className="form-control border-secondary txt-box"
                    placeholder="Email or phone"
                    />
                </div>

                {/* Forgot email */}
                <div className="mb-3">
                    <a href="#" className="small text-decoration-none forgot-email">
                    Forgot email?
                    </a>
                </div>

                {/* Info Text */}
                <p className="small mb-4 mt-4 txt-des">
                    Not your computer? Use a private browsing window to sign in.{" "}
                    <a href="#" className="text-decoration-none forgot-email">
                    Learn more about using Guest mode
                    </a>
                </p>

                {/* Bottom Section */}
                <div className="d-flex justify-content-end align-items-center">
                    <a href="/password" className="btn rounded-pill px-4 next-button">Next</a>
                </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <footer className="footer d-flex justify-content-between align-items-center px-4 py-2">
            {/* Language Dropdown */}
            <div className="dropdown">
            <button
                className="btn btn-link lang-dropdown dropdown-toggle small"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {language}
            </button>
            <ul className="dropdown-menu lang-menu">
                {languages.map((lang, idx) => (
                <li key={idx}>
                    <button
                    className="dropdown-item"
                    onClick={() => setLanguage(lang)}
                    >
                    {lang}
                    </button>
                </li>
                ))}
            </ul>
            </div>

            {/* Footer Links */}
            <div>
            <a href="#" className="footer-link">
                Help
            </a>
            <a href="#" className="footer-link">
                Privacy
            </a>
            <a href="#" className="footer-link">
                Terms
            </a>
            </div>
        </footer>
      </div>
    </div>
  );
}
