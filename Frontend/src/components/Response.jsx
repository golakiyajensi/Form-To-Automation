import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, Modal, Button, Form } from "react-bootstrap";

// import './App.css';

function App() {
  const [destination, setDestination] = useState("new"); // "new" or "existing"
  const [spreadsheetName, setSpreadsheetName] = useState("Untitled form (Responses)");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className='background'>
        <div className="response-page-container">
            <div className="response-page-content">
                {/* Responses Header Card */}
                <div className="card1 border rounded-3 w-100 response-header-card p-4">
                <div className="card-body d-flex justify-content-between align-items-center w-100">
                    <h5 className="responses-count mb-0">0 responses</h5>
                    <div className="d-flex align-items-center">
                    <button className="btn btn-link text-decoration-none view-sheets-btn border-0">
                        <img
                            src="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
                            alt="Sheets"
                            className="me-3 border-0"
                        />
                        View in Sheets
                    </button>
                    <Dropdown align="end">
                      <Dropdown.Toggle 
                        variant="link" 
                        className="text-muted ms-2 p-0 border-0"
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu className="shadow-sm">
                        <Dropdown.Item onClick={() => console.log("Get email notifications")}>
                          Get email notifications for new responses
                        </Dropdown.Item>
                        {/* Dropdown Item */}
                        <Dropdown.Item onClick={() => setShowModal(true)}>
                          Select destination for responses
                        </Dropdown.Item>

                        {/* Modal */}
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Select destination for responses</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Form>
                              {/* Create new spreadsheet */}
                              <Form.Check
                                type="radio"
                                id="new-spreadsheet"
                                label={
                                  <>
                                    Create a new spreadsheet{" "}
                                    <input
                                      type="text"
                                      className="ms-2 border-0 border-bottom"
                                      style={{ outline: "none" }}
                                      value={spreadsheetName}
                                      onChange={(e) => setSpreadsheetName(e.target.value)}
                                    />
                                  </>
                                }
                                checked={destination === "new"}
                                onChange={() => setDestination("new")}
                              />

                              {/* Select existing spreadsheet */}
                              <Form.Check
                                type="radio"
                                id="existing-spreadsheet"
                                label="Select existing spreadsheet"
                                checked={destination === "existing"}
                                onChange={() => setDestination("existing")}
                                className="mt-3"
                              />
                            </Form>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                              Cancel
                            </Button>
                            <Button variant="primary" onClick={() => {
                              console.log("Selected:", destination, spreadsheetName);
                              setShowModal(false);
                            }}>
                              Create
                            </Button>
                          </Modal.Footer>
                        </Modal>

                        <Dropdown.Item onClick={() => console.log("Unlink form")} disabled>
                          Unlink form
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item disabled>Download responses (.csv)</Dropdown.Item>
                        <Dropdown.Item disabled>Print all responses</Dropdown.Item>
                        <Dropdown.Item disabled>Delete all responses</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    </div>
                </div>
                </div>

                {/* No Responses Placeholder Card */}
                <div className="card w-100 mt-4 no-responses-card p-2">
                <div className="card-body d-flex flex-column align-items-center justify-content-center text-center">
                    <p className="no-responses-text text-muted mb-0">
                    No responses. Publish your form to start accepting responses.
                    </p>
                </div>
                </div>
            </div>
            </div>
    </div>
  );
}

export default App;
