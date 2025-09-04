import React, { useState } from "react";
import Logo from "../../public/img/logo.png";

const SigninPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState("English (United States)");
      const languages = [
      "English (United States)",
      "English (United Kingdom)",
      "हिन्दी (Hindi)",
      "ગુજરાતી (Gujarati)",
      "Español (Spanish)",
      "Français (French)",
      "Deutsch (German)",
      "日本語 (Japanese)",
      "中文 (Chinese)",
    ];

  return (
    <div className="signin-container d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="signin-box rounded-4 d-flex justify-content-between">
                <div>
                    {/*Logo */}
                    <div className="text-start mb-3">
                        <img
                            src={Logo}
                            className="google-logo"
                        />
                    </div>

                    {/* Welcome Text */}
                    <h4 className="text-dark mt-4 mb-2">Welcome</h4>

                    {/* User Email (fixed pill) */}
                    <a href="/signin" className="d-flex align-items-center text-decoration-none gap-3 justify-content-between user-pill mb-4 mt-3">
                        <span className="text-dark">jhonwalker34@gmail.com</span>
                        <i className="fa fa-caret-down text-dark"></i>
                    </a>
                </div>

                <div className="txt-column">
                    {/* Password Input */}
                    <div className="mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="form-control password-input txt-box"
                    />
                    </div>

                    {/* Show Password Checkbox */}
                    <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="showPassword"
                        onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <label className="form-check-label text-dark" htmlFor="showPassword">
                        Show password
                    </label>
                    </div>

                    {/* Actions */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <a href="/forgotpassword" className="forgot-link forgot-password">
                            Forgot password?
                        </a>
                        <a href="#" className="btn next-button rounded-pill px-4">Next</a>
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
                {languages.map((lang) => (
                <li key={lang}>
                    <button className="dropdown-item" onClick={() => setLanguage(lang)}>
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
};

export default SigninPassword;
