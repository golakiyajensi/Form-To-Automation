import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FormCheck, FormSelect } from 'react-bootstrap';

function App() {
  const [isQuizEnabled, setIsQuizEnabled] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  // Responses state
  const [collectEmails, setCollectEmails] = useState("Do not collect");
  const [sendCopy, setSendCopy] = useState("Off");
  const [allowEdit, setAllowEdit] = useState(false);
  const [limitOne, setLimitOne] = useState(false);

  // const [isQuizEnabled, setIsQuizEnabled] = useState(false);
const [releaseType, setReleaseType] = useState("immediate");
const [showMissed, setShowMissed] = useState(true);
const [showCorrect, setShowCorrect] = useState(true);
const [showPoints, setShowPoints] = useState(true);
const [defaultPoints, setDefaultPoints] = useState(0);


  const toggleSection = (sectionName) => {
    setOpenSection(openSection === sectionName ? null : sectionName);
  };

  const renderSection = (title, description, sectionName, content, withBorder = true) => (
    <div
      className={`section-container w-100 text-left mb-4 p-3 ${
        withBorder
          ? openSection !== sectionName
            ? "border-bottom border-muted pb-4"
            : "border-bottom border-muted pb-4"
          : ""
      }`}
    >
      <div
        className="d-flex justify-content-between align-items-center"
        onClick={() => toggleSection(sectionName)}
        style={{ cursor: "pointer" }}
      >
        <div className="section-text-wrapper">
          <h5 className="section-title text-dark ps-0 mb-0">{title}</h5>
          <p className="section-description-text text-muted mb-0 mt-2">
            {description}
          </p>
        </div>
        <FontAwesomeIcon
          icon={openSection === sectionName ? faChevronUp : faChevronDown}
          className="section-toggle-icon"
        />
      </div>
      {openSection === sectionName && (
        <div className="section-content-wrapper mt-3" style={{ fontSize: "16px" }}>
          {content}
        </div>
      )}
    </div>
  );

  return (
    <div className="background p-4">
      <div className="settings-page-wrapper">
        <div className="settings-content-area">

          {/* Settings Card */}
          <div className="card1 w-100 settings-card-wrapper text-left mb-4 p-4 border rounded-3 pb-0">
            <h4 className="card-title-header mb-4 pb-3 w-100 text-left">Settings</h4>

            {/* Quiz Section */}
            <div className="section-container mb-4 p-3 pb-4 border-bottom border-muted">
              <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: "default" }}
              >
                <div className="section-text-wrapper">
                  <h5 className="section-title text-dark ps-0 mb-0" style={{ fontSize: "18px" }}>
                    Make this a quiz
                  </h5>
                  <p className="section-description-text mb-0 mt-2" style={{ fontSize: "16px" }}>
                    Assign point values, set answers, and automatically provide feedback
                  </p>
                </div>

                <div className="section-content-wrapper mt-3" style={{ fontSize: "16px" }}>
                  <div className="d-flex justify-content-end align-items-center w-100">
                    <FormCheck
                      type="switch"
                      id="quiz-switch"
                      checked={isQuizEnabled}
                      onChange={() => setIsQuizEnabled(!isQuizEnabled)}
                      className="quiz-toggle w-100"
                    />
                  </div>
                </div>
              </div>

              {/* Collapsible Content */}
              {isQuizEnabled && (
                <div className="quiz-settings mt-4 p-4 pt-0">
                  {/* Release Grades */}
                  <div className="mb-4">
                    <h6 className="fw-medium" style={{ fontSize:"18px" }}>Release Grades</h6>
                    <FormCheck
                      type="radio"
                      id="release-immediate"
                      label="Immediately after each submission"
                      name="releaseGrades"
                      value="immediate"
                      checked={releaseType === "immediate"}
                      onChange={() => setReleaseType("immediate")}
                      style={{ fontSize:"18px", marginTop:"10px"}}
                    />
                    <FormCheck
                      type="radio"
                      id="release-later"
                      label="Later, after manual review"
                      name="releaseGrades"
                      value="later"
                      checked={releaseType === "later"}
                      onChange={() => setReleaseType("later")}
                      style={{ fontSize:"18px", marginTop:"10px"}}
                    />
                    <p className="text-muted ms-4" style={{ fontSize: "14px" }}>
                      Turns on Responses → Collect email addresses
                    </p>
                  </div>

                  {/* Respondent Settings */}
                  <div className="mb-4">
                    <h6 className="fw-medium" style={{ fontSize:"18px"}}>Respondent Settings</h6>
                    <div className='d-flex align-items-center justify-content-between mt-3'>
                      <div>
                        <label className='fw-medium' style={{ fontSize: "16px" }}>Missed questions</label>
                        <p className="text-muted" style={{ fontSize: "16px" }}>
                          Respondents can see which questions were answered incorrectly
                        </p>
                      </div>
                      <FormCheck
                        type="switch"
                        id="missed-questions"
                        
                        checked={showMissed}
                        onChange={() => setShowMissed(!showMissed)}
                      />
                    </div>

                    <div className='d-flex align-items-center justify-content-between mt-2'>
                      <div>
                        <label className='fw-medium' style={{ fontSize: "16px" }}>Correct answers</label>
                        <p className="text-muted" style={{ fontSize: "16px" }}>
                          Respondents can see correct answers after grades are released
                        </p>
                      </div>
                      <FormCheck
                      type="switch"
                      id="correct-answers"
                      checked={showCorrect}
                      onChange={() => setShowCorrect(!showCorrect)}
                    />
                    </div>

                    <div className='d-flex align-items-center justify-content-between mt-2'>
                      <div>
                        <label className='fw-medium' style={{ fontSize: "16px" }}>Point values</label>
                        <p className="text-muted" style={{ fontSize: "16px" }}>
                          Respondents can see total points and points received for each question
                        </p>
                      </div>
                      <FormCheck
                      type="switch"
                      id="point-values"
                      label=""
                      checked={showPoints}
                      onChange={() => setShowPoints(!showPoints)}
                    />
                    </div>
                  </div>

                  {/* Global Defaults */}
                  <div>
                    <h6 className="fw-medium" style={{fontSize:"18px"}}>Global Quiz Defaults</h6>
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="me-2 fw-medium">Default question point value</span>
                      <div className='d-flex align-item-center'>
                        <Form.Control
                          type="number"
                          value={defaultPoints}
                          onChange={(e) => setDefaultPoints(e.target.value)}
                          style={{ width: "70px", border:"none", borderBottom:"1px solid #ceccccff" }}
                          className='rounded-0'
                        />
                        <span>points</span>
                      </div>
                    </div>
                    <p className="text-muted" style={{ fontSize: "16px" }}>
                      Point values for every new question
                    </p>
                  </div>
                </div>
              )}
            </div>


            {/* Responses Section (with border) */}
            {renderSection(
              "Responses",
              "Manage how responses are collected and protected",
              "responses",
              <div className="responses-settings p-4">
                {/* Collect email addresses */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>Collect email addresses</label>

                    <p>
                      {collectEmails === "Verified"
                        ? "Respondents will be required to sign in to Google"
                        : collectEmails === "Responder Input"
                        ? "Respondents will manually enter their email response"
                        : ""}
                    </p>
                  </div>

                  <FormSelect
                    value={collectEmails}
                    onChange={(e) => setCollectEmails(e.target.value)}
                    style={{ width: "220px", fontSize: "16px" }}
                  >
                    <option value="Do not collect">Do not collect</option>
                    <option value="Verified">Verified</option>
                    <option value="Responder Input">Responder Input</option>
                  </FormSelect>
                </div>

                {/* Send responders a copy */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>
                      Send responders a copy of their response
                    </label>
                    <p className="text-muted small mb-0" style={{ fontSize: "16px" }}>
                      Requires Collect email addresses
                    </p>
                  </div>
                  <FormSelect
                    value={sendCopy}
                    onChange={(e) => setSendCopy(e.target.value)}
                    style={{ width: "220px", fontSize: "16px" }}
                  >
                    <option>Off</option>
                    <option>When requested</option>
                    <option>Always</option>
                  </FormSelect>
                </div>

                {/* Allow response editing */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>
                      Allow response editing
                    </label>
                    <p className="text-muted small mb-0" style={{ fontSize: "16px" }}>
                      Responses can be changed after being submitted
                    </p>
                  </div>
                  <FormCheck
                    type="switch"
                    id="allow-edit"
                    checked={allowEdit}
                    onChange={() => setAllowEdit(!allowEdit)}
                  />
                </div>

                {/* Limit to 1 response */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>
                      Limit to 1 response
                    </label>
                    <p className="text-muted small mb-0" style={{ fontSize: "16px" }}>
                      Requires sign in
                    </p>
                  </div>
                  <FormCheck
                    type="switch"
                    id="limit-one"
                    checked={limitOne}
                    onChange={() => setLimitOne(!limitOne)}
                  />
                </div>
              </div>,
              true
            )}

            {/* Presentation Section (no border) */}
            {renderSection(
              "Presentation",
              "Manage how the form and responses are presented",
              "presentation",
              <div className="presentation-settings p-4">
                {/* Form Presentation */}
                <h6 className="text-uppercase text-muted small fw-medium mb-3" style={{ fontSize: "14px" }}>
                  Form Presentation
                </h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="fw-medium" style={{ fontSize: "18px" }}>Show progress bar</label>
                  <FormCheck type="switch" id="progress-bar" />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <label className="fw-medium" style={{ fontSize: "18px" }}>Shuffle question order</label>
                  <FormCheck type="switch" id="shuffle-questions" />
                </div>

                {/* After Submission */}
                <h6 className="text-uppercase text-muted small fw-bold mt-5 mb-3" style={{ fontSize: "14px" }}>
                  After Submission
                </h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>
                      Confirmation message
                    </label>
                    <p className="text-muted small mb-0" style={{ fontSize: "16px" }}>
                      Your response has been recorded
                    </p>
                  </div>
                  <button className="btn btn-link text-decoration-none p-0 text-primary" style={{ fontSize: "16px" }}>
                    Edit
                  </button>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="fw-medium" style={{ fontSize: "18px" }}>
                    Show link to submit another response
                  </label>
                  <FormCheck type="switch" id="submit-another" defaultChecked />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>
                      View results summary
                    </label>
                    <p className="text-muted small mb-0" style={{ fontSize: "16px" }}>
                      Share <a href="#!" className="text-primary">results summary</a> with respondents.
                      <a href="#!" className="text-primary ms-1">Important details</a>
                    </p>
                  </div>
                  <FormCheck type="switch" id="view-summary" />
                </div>

                {/* Restrictions */}
                <h6 className="text-uppercase text-muted small fw-bold mt-5 mb-3" style={{ fontSize: "14px" }}>
                  Restrictions
                </h6>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="fw-medium" style={{ fontSize: "18px" }}>
                    Disable autosave for all respondents
                  </label>
                  <FormCheck type="switch" id="disable-autosave" />
                </div>
              </div>,
              false
            )}

          </div>

          {/* Defaults Card */}
          <div className="card1 border rounded-3 w-100 defaults-card-wrapper p-4 pb-0">
            <h4 className="card-title-header mb-4 pb-3">Defaults</h4>

            {/* Form defaults (with border) */}
            {renderSection(
              "Form defaults",
              "Settings applied to this form and new forms",
              "formDefaults",
              <div className="form-defaults-settings p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <label className="fw-medium" style={{ fontSize: "18px" }}>
                      Collect email addresses by default
                    </label>
                    <p>
                      {collectEmails === "Verified"
                        ? "Respondents will be required to sign in to Google"
                        : collectEmails === "Responder Input"
                        ? "Respondents will manually enter their email response"
                        : ""}
                    </p>
                  </div>
                  <FormSelect
                    value={collectEmails}
                    onChange={(e) => setCollectEmails(e.target.value)}
                    style={{ width: "220px", fontSize: "16px" }}
                  >
                    <option value="Do not collect">Do not collect</option>
                    <option value="Verified">Verified</option>
                    <option value="Responder Input">Responder Input</option>
                  </FormSelect>
                </div>
              </div>,
              true
            )}

            {/* Question defaults (no border) */}
            {renderSection(
              "Question defaults",
              "Settings applied to all new questions",
              "questionDefaults",
              <div className="question-defaults-settings p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="fw-medium" style={{ fontSize: "18px" }}>
                    Make questions required by default
                  </label>
                  <FormCheck type="switch" id="required-by-default" />
                </div>
              </div>,
              false
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
