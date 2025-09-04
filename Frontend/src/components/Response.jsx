import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faPlus } from '@fortawesome/free-solid-svg-icons';
// import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown } from "react-bootstrap";

// import './App.css';

function App() {
  return (
    <div className='background'>
        <div className="response-page-container">
            <div className="response-page-content">
                {/* Responses Header Card */}
                <div className="card w-100 response-header-card p-3">
                <div className="card-body d-flex justify-content-between align-items-center">
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
    <Dropdown.Item onClick={() => console.log("Select destination")}>
      Select destination for responses
    </Dropdown.Item>
    <Dropdown.Item onClick={() => console.log("Unlink form")}>
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
