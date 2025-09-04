import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./ForgotPassword.css";
import Logo from "../../public/img/logo.png";

export default function ForgotPassword() {
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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
    } else {
      setError("");
      alert("Password reset successfully ✅");
      // you can add API call here
    }
  };

  return (
    <div className="forgot-container d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="forgot-card d-flex justify-content-between">
                <div>
                    <img src={Logo} className="google-logo"/>
                    <h3 className="mb-3 mt-4">Reset Password</h3>
                </div>

                <form onSubmit={handleSubmit} className="txt-column">
                    <div className="mb-3">
                        <label className="form-label">New Password</label>
                        <input
                        type="password"
                        className="form-control p-3"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        />
                    </div>

                    <div className="mb-3 mt-4">
                        <label className="form-label">Confirm Password</label>
                        <input
                        type="password"
                        className="form-control p-3"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        />
                    </div>

                    {error && <p className="text-danger">{error}</p>}

                    <button type="submit" className="btn next-button mt-4 w-100">
                        Reset Password
                    </button>
                </form>
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
}
