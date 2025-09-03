import React, { useState, useRef, useEffect } from "react";
// import { Navbar, Nav } from "react-bootstrap";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import Forms from "./Forms.jsx";
 
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faCopy, faTrash, faList, faCode, faPrint,
  faPuzzlePiece, faPlug, faBan, faKeyboard } from "@fortawesome/free-solid-svg-icons";
 
import ModalImg from "../../public/img/modal-img.svg";
export default function CustomNavbar() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpenSetting(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [title, setTitle] = useState("Untitled form");
  const [open, setOpen] = useState(false);
 
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);
 
  const togglePanel = () => setIsOpen((prev) => !prev);
  const closePanel = () => setIsOpen(false);
 
  const [show, setShow] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 
  const [active, setActive] = useState("suggested");
 
  const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
 
    useEffect(() => {
        const handleClickOutside = (event) => {
          if (profileRef.current && !profileRef.current.contains(event.target)) {
            setProfileOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
 
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
   const [openSetting, setOpenSetting] = useState(false);
  const rootRef = useRef(null);
 
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
            <div className="navbar-left">
                <img
                src="https://www.gstatic.com/images/branding/product/1x/forms_48dp.png"
                alt="Form"
                className="form-logo"
                />
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-title"
                />
 
                {/* Trigger Button */}
                <button onClick={() => setShowMove(true)} className="btn">
                  <i className="bi bi-folder"></i>
                </button>
 
                {/* Modal */}
                <Modal show={showMove} onHide={() => setShowMove(false)} centered size="lg" className="move-modal">
                  <Modal.Header closeButton>
                    <Modal.Title>
                      Move <span className="fw-normal">"Untitled form"</span>
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {/* Current Location */}
                    <div className="d-flex align-items-center mb-3">
                      <span className="me-2 fw-semibold">Current location:</span>
                      <Button variant="light" className="border px-3 py-1 d-flex align-items-center">
                        <i className="bi bi-folder me-2"></i> My Drive
                      </Button>
                      <i className="bi bi-box-arrow-up-right ms-2 text-primary" role="button"></i>
                    </div>
 
                      {/* Tabs */}
                      {/* Tabs */}
                    <ul className="nav nav-tabs custom-tabs">
                      <li className="nav-item">
                        <button
                          className={`nav-link ${active === "suggested" ? "active" : ""}`}
                          onClick={() => setActive("suggested")}
                        >
                          Suggested
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${active === "starred" ? "active" : ""}`}
                          onClick={() => setActive("starred")}
                        >
                          Starred
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${active === "all" ? "active" : ""}`}
                          onClick={() => setActive("all")}
                        >
                          All locations
                        </button>
                      </li>
                    </ul>
 
 
                    {/* Content below */}
                    <div className="p-3 border-top-0">
                      {active === "suggested" && (
                        // Folder List
                        <ul className="list-unstyled">
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-folder me-2"></i> My Drive
                          </li>
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-people me-2"></i> Shared drives
                          </li>
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-laptop me-2"></i> Computers
                          </li>
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-folder-symlink me-2"></i> Shared with me
                          </li>
                        </ul>
                      )}
 
                      {active === "starred" && (
                        <div className="d-flex flex-column mt-5 mb-5 align-items-center justify-content-center">
                          <div className="modal-img">
                            <img src={ModalImg}/>
                          </div>
                          <p className="mb-0 mt-2">No starred folders</p>
                        </div>
                      )}
                      {active === "all" && (
                        // Folder List
                        <ul className="list-unstyled">
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-folder me-2"></i> My Drive
                          </li>
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-people me-2"></i> Shared drives
                          </li>
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-laptop me-2"></i> Computers
                          </li>
                          <li className="d-flex align-items-center py-2">
                            <i className="bi bi-folder-symlink me-2"></i> Shared with me
                          </li>
                        </ul>
                      )}
                    </div>
                  </Modal.Body>
 
                  <Modal.Footer className="justify-content-between">
                    <small className="text-muted">
                      <i className="bi bi-exclamation-triangle me-1"></i> Select a location to show the folder path
                    </small>
                    <div className="d-flex align-items-center gap-3">
                      <Button variant="light" onClick={() => setShowMove(false)}>Cancel</Button>
                      <button className="btn done-btn btn-primary">Move</button>
                    </div>
                  </Modal.Footer>
                </Modal>
 
                <i className="bi bi-star ms-2"></i>
                <span className="ms-3 save-text">All changes saved in Drive</span>
            </div>
 
            {/* Right Section */}
            <div className="navbar-right">
                <div className="theme-dropdown">
                  {/* Palette Icon */}
                  <button className="theme-toggle-btn" onClick={togglePanel}>
                    <i className="bi bi-palette"></i>
                  </button>
 
                  {/* Side Panel */}
                  {isOpen && (
                    <div className="theme-panel" ref={panelRef}>
                      <div className="theme-panel-header">
                        <h4 className="theme-title">Theme</h4>
                        <button className="close-btn" onClick={closePanel}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
 
                      {/* Text Style */}
                      <div className="theme-section">
                        <h5>Text style</h5>
                        <div className="form-group mt-4">
                          <label>Header</label>
                          <div className="d-flex align-items-center gap-3">
                            <select className="w-75 select-btn">
                              <option>Roboto</option>
                              <option>Arial</option>
                              <option>Times New Roman</option>
                            </select>
                            <select>
                              <option>24</option>
                              <option>22</option>
                              <option>20</option>
                            </select>
                          </div>
                        </div>
 
                        <div className="form-group mt-4">
                          <label>Question</label>
                          <div className="d-flex align-items-center gap-3">
                            <select className="w-75">
                              <option>Roboto</option>
                              <option>Arial</option>
                            </select>
                            <select>
                              <option>12</option>
                              <option>14</option>
                              <option>16</option>
                            </select>
                          </div>
                        </div>
 
                        <div className="form-group mt-4">
                          <label>Text</label>
                          <div className="d-flex align-items-center gap-3">
                            <select className="w-75">
                              <option>Roboto</option>
                              <option>Arial</option>
                            </select>
                            <select>
                              <option>11</option>
                              <option>13</option>
                              <option>15</option>
                            </select>
                          </div>
                        </div>
                      </div>
 
                      {/* Header */}
                      <div className="theme-section mt-4">
                        <h5>Header</h5>
                        <button className="choose-img-btn">+ Choose Image</button>
                      </div>
 
                      {/* Colors */}
                      <div className="theme-section mt-4">
                        <h5>Color</h5>
                        <div className="color-palette mt-3">
                          <span className="color-circle red"></span>
                          <span className="color-circle purple active"></span>
                          <span className="color-circle blue"></span>
                          <span className="color-circle teal"></span>
                          <span className="color-circle green"></span>
                          <span className="color-circle orange"></span>
                        </div>
                      </div>
 
                      {/* Background */}
                      <div className="theme-section mt-4">
                        <h5>Background</h5>
                        <div className="color-palette mt-3">
                          <span className="bg-circle light active"></span>
                          <span className="bg-circle lighter"></span>
                          <span className="bg-circle white"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
 
 
                <button className="theme-toggle-btn">
                  <i className="bi bi-eye"></i>
                </button>
 
                <button className="theme-toggle-btn">
                  <i className="bi bi-arrow-counterclockwise"></i>
                </button>
 
                <button className="theme-toggle-btn">
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
 
                <div className="dropdown-container">
                {/* Trigger Button */}
                <button
                  className="btn theme-toggle-btn"
                  onClick={() => setOpen(!open)}
                >
                  <i className="bi bi-link-45deg"></i>
                </button>
 
                {/* Dropdown Box */}
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
                      {/* Close Button */}
                      <button
                        className="btn-close"
                        onClick={() => setOpen(false)}
                      ></button>
                    </div>
                  </div>
                )}
              </div>
 
               {/* Trigger Button */}
                <button className="btn theme-toggle-btn" onClick={() => setShow(true)}>
                  <i className="bi bi-person-plus"></i>
                </button>
 
                {/* Modal */}
                <Modal show={show} onHide={() => setShow(false)} centered size="lg">
                  <Modal.Body className="share-modal-body ">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-semibold">Share "Untitled form"</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShow(false)}
                      ></button>
                    </div>
 
                    {/* Input */}
                    <Form.Control
                      type="text"
                      placeholder="Add people, groups, and calendar events"
                      className="mb-4"
                    />
 
                    {/* People with access */}
                    <div className="mb-4 mt-5">
                      <h6 className="fw-semibold">People with access</h6>
                      <div className="d-flex align-items-center mt-3 gap-2">
                        <div className="avatar-circle">
                          <i className="bi bi-person-circle text-secondary"></i>
                        </div>
                        <div className="ms-2">
                          <div className="fw-medium">Jhon Walker (you)</div>
                          <small className="text-muted">jhonwalker23@gmail.com</small>
                        </div>
                        <span className="ms-auto text-muted">Owner</span>
                      </div>
                    </div>
 
                    {/* General Access */}
                    <div className="mb-4">
                      <h6 className="fw-semibold">General access</h6>
 
                      <div className="d-flex align-items-center mt-3 access-item gap-2">
                        <i className="bi bi-lock-fill text-secondary"></i>
                        <div className="ms-2 flex-grow-1">
                          <div className="fw-medium">Editor view</div>
                          <small className="text-muted">
                            Only people with access can open with the link
                          </small>
                        </div>
                        <Form.Select size="sm" className="w-auto">
                          <option>Restricted</option>
                          <option>Anyone with link</option>
                        </Form.Select>
                      </div>
 
                      <div className="d-flex align-items-center mt-3 access-item1 gap-2">
                        <i className="bi bi-globe-americas text-success"></i>
                        <div className="ms-2 flex-grow-1">
                          <div className="fw-medium">Responder view</div>
                          <small className="text-muted">
                            Anyone on the internet with the link can respond
                          </small>
                        </div>
                        <Form.Select size="sm" className="w-auto">
                          <option>Anyone with link</option>
                          <option>Restricted</option>
                        </Form.Select>
                      </div>
                    </div>
 
                    {/* Info + Button */}
                    <div className="info-box mb-3 mt-5">
                      <i className="bi bi-info-circle me-2"></i>
                      Publish the form to accept responses
                    </div>
 
                    {/* Done button */}
                    <div className="text-end">
                      <Button variant="primary" className="done-btn" onClick={() => setShow(false)}>
                        Done
                      </Button>
                    </div>
                  </Modal.Body>
                </Modal>
 
                <button className="publish-btn">Publish</button>
 
                <div className="settings-dd" ref={rootRef}>
                  <button
                    type="button"
                    className="border-0 setting-btn1"
                    onClick={() => setOpenSetting((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={openSetting}
                    aria-label="More options"
                  >
                    <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
                  </button>
 
                  <div className={`settings-menu ${openSetting ? "show" : ""}`} role="menu">
                    <button className="item"><FontAwesomeIcon icon={faCopy} className="me-2" />Make a copy</button>
                    <button className="item"><FontAwesomeIcon icon={faTrash} className="me-2" />Move to trash</button>
                    <button className="item"><FontAwesomeIcon icon={faList} className="me-2" />Pre-fill form</button>
                    <button className="item"><FontAwesomeIcon icon={faCode} className="me-2" />Embed HTML</button>
                    <button className="item"><FontAwesomeIcon icon={faPrint} className="me-2" />Print</button>
                    <div className="divider" />
                    <button className="item"><FontAwesomeIcon icon={faPuzzlePiece} className="me-2" />Apps Script</button>
                    <button className="item"><FontAwesomeIcon icon={faPlug} className="me-2" />Get add-ons</button>
                    <button className="item disabled" disabled>
                      <FontAwesomeIcon icon={faBan} className="me-2" />Unpublish form
                    </button>
                    <div className="divider" />
                    <button className="item"><FontAwesomeIcon icon={faKeyboard} className="me-2" />Keyboard shortcuts</button>
                  </div>
                </div>
               
                <i
                className="bi bi-person-circle text-secondary"
                style={{ fontSize: "32px", cursor: "pointer" }}
                onClick={() => setProfileOpen(!profileOpen)}
              ></i>
 
              {/* Profile Dropdown */}
              {profileOpen && (
                <div
                  className="card shadow border-0 position-absolute end-0 mt-3"
                >
                  <div className="card-body text-center">
                    {/* Profile Picture */}
                    <img
                      src="./img/logo.png"
                      alt="profile"
                      className="rounded-circle mb-2"
                      style={{ width: "70px", height: "70px" }}
                    />
                    <h6 className="fw-semibold mb-0">Hi, Divyesh!</h6>
                    <small className="text-muted">
                      divyesh1234@gmail.com
                    </small>
 
                    <div className="mt-3">
                      <button className="btn btn-outline-primary w-100 mb-2">
                        Manage your Google Account
                      </button>
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-light w-50 me-1" onClick={() => navigate("/signin")}>
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
 
        {/* Center Tabs */}
        <div className="navbar-center">
          <ul className="nav-links">
            <li className="nav-item questions" onClick={() => navigate("/question")}>Questions</li>
            <li className="nav-item responses" onClick={() => navigate("/responses")}>Responses</li>
            <li className="nav-item settings" onClick={() => navigate("/settings")}>Settings</li>
          </ul>
         </div>
 
    </div>
 
    {/* <Forms/> */}
    </div>
  );
}