import React, {useState} from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Logo from "../../public/img/logo.png";

export default function Signin() {
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
  
  const accounts = [
    {
      name: "Jhon Walker",
      email: "jhonwalker34@gmail.com",
      status: "Signed out",
    },
    {
      name: "Aliana Jhonas",
      email: "alien876@gmail.com",
      status: "Signed out",
    },
  ];

  return (
    <div>
        <div className="account-container d-flex flex-column">
            <div className="container">
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <div className="account-card">
                    {/* Google logo */}
                    <div className="logo-card">
                        <img
                        src={Logo}
                        className="google-logo mb-3"
                        />
                        <h4 className="text-dark">Choose an account</h4>
                    </div>

                    {/* Accounts List */}
                    <div className="list-group list-group-flush">
                        {accounts.map((acc, index) => (
                        <div
                            key={index}
                            className="list-group-item d-flex justify-content-between account-item"
                        >
                            <div className="d-flex align-items-center gap-3">
                            {/* <FaUserCircle className="account-avatar me-3" /> */}
                            <FontAwesomeIcon icon={faUserCircle} className="account-icon"/>
                            <div>
                                <h5 className="fw-bold text-dark">{acc.name}</h5>
                                <p className="mb-0">{acc.email}</p>
                            </div>
                            </div>
                            <p className=" small status">{acc.status}</p>
                        </div>
                        ))}

                        {/* Options */}
                        <a href="/useaccount" className="list-group-item d-flex align-items-center gap-2 account-item">
                            {/* <FaUserCircle className="account-avatar me-3" /> */}
                            <FontAwesomeIcon icon={faUser} className="text-dark"/>
                            <span className="text-dark">Use another account</span>
                        </a>
                        <a href="#" className="list-group-item d-flex align-items-center gap-3 account-item">
                            {/* <FaUserAltSlash className="account-avatar me-3" /> */}
                            <FontAwesomeIcon icon={faUserMinus} className="text-dark"/>
                            <span className="text-dark">Remove an account</span>
                        </a>
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
    </div>
  );
}
