import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical, faCopy, faTrash, faList, faCode, faPrint,
  faPuzzlePiece, faPlug, faBan, faKeyboard
} from "@fortawesome/free-solid-svg-icons";

import ModalImg from "../../public/img/modal-img.svg";

export default function CustomNavbar() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Untitled form");
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
  const [show, setShow] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [active, setActive] = useState("suggested");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [openSetting, setOpenSetting] = useState(false);
  const rootRef = useRef(null);

  // close profile if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close theme panel if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // close settings menu if clicked outside
  useEffect(() => {
    const onDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpenSetting(false);
    };
    const onEsc = (e) => e.key === "Escape" && setOpenSetting(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div className="background">
      <div className="navbar2">
        <div className="custom-navbar">
          {/* Left Section */}
          <div className="navbar-left d-flex align-items-center">
            <img
              src="/img/forms.png"
              alt="Form"
              className="form-logo"
            />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-title"
            />

            {/* Mobile only buttons */}
            <button onClick={() => setShowMove(true)} className="btn d-none d-md-inline">
              <i className="bi bi-folder"></i>
            </button>

            <i className="bi bi-star ms-2 d-none d-md-inline"></i>
            <span className="ms-3 save-text d-none d-lg-inline">All changes saved in Drive</span>
          </div>

          {/* Right Section */}
          <div className="navbar-right d-flex align-items-center">
            <button className="theme-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
              <i className="bi bi-palette"></i>
            </button>
            <button className="theme-toggle-btn d-none d-sm-inline">
              <i className="bi bi-eye"></i>
            </button>
            <button className="theme-toggle-btn d-none d-sm-inline">
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
            <button className="theme-toggle-btn d-none d-sm-inline">
              <i className="bi bi-arrow-clockwise"></i>
            </button>

            {/* Dropdown */}
            <div className="dropdown-container">
              <button className="btn theme-toggle-btn" onClick={() => setOpen(!open)}>
                <i className="bi bi-link-45deg"></i>
              </button>
              {open && (
                <div className="dropdown-box shadow rounded p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="fw-semibold mb-1">The form is unpublished</h6>
                      <p className="mb-2 small text-muted">
                        Currently, nobody can respond. Do you want to copy the unpublished form link?
                      </p>
                      <button className="btn text-primary p-0">Copy</button>
                    </div>
                    <button className="btn-close" onClick={() => setOpen(false)}></button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <i
              className="bi bi-person-circle text-secondary ms-3"
              style={{ fontSize: "32px", cursor: "pointer" }}
              onClick={() => setProfileOpen(!profileOpen)}
            ></i>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="navbar-center">
          <ul className="nav-links">
            <li className="nav-item" onClick={() => navigate("/question")}>Questions</li>
            <li className="nav-item" onClick={() => navigate("/responses")}>Responses</li>
            <li className="nav-item" onClick={() => navigate("/settings")}>Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
