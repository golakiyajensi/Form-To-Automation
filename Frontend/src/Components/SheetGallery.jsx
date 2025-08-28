import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./TemplateGallery.css";
import Sheet1 from "../../public/img/sheet-1.png";
import Sheet2 from "../../public/img/sheet-2.png";
import Sheet3 from "../../public/img/Sheet-3.png";
import Sheet4 from "../../public/img/sheet-4.png";
import Sheet5 from "../../public/img/sheet-5.png";

const templates = [
  { id: 1, title: "Blank spreadsheet", img: "https://ssl.gstatic.com/docs/templates/thumbnails/sheets-blank-googlecolors.png" },
  { id: 2, title: "To-do list", img: Sheet1 },
  { id: 3, title: "Annual budget", img: Sheet2 },
  { id: 4, title: "Monthly budget", img: Sheet3 },
  { id: 5, title: "Google Finance Invest…", img: Sheet4 },
  { id: 6, title: "Annual Calendar", img: Sheet5 }
];

const files = [
  {
    id: 1,
    name: "To-do list",
    owner: "me",
    lastOpened: "2:19 PM",
    icon: "https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_spreadsheet_x16.png"
  }
];

const TemplateGallery = () => {
  const [selected, setSelected] = useState("Owned by anyone");
  const navigate = useNavigate();

  const options = ["Owned by anyone", "Owned by me", "Not owned by me"];
  return (
    <div>
        <div className="sheet-gallery">
            <div className="container">
                <div className="gallery-head">
                    <h6 className="head-txt">Start a new spreadsheet</h6>
                    <button
                        className="btn btn-light border-0 bg-transparent"
                        onClick={() => navigate("/templategallery")}
                    >
                        Template gallery ▾
                    </button>
                </div>

                {/* ✅ Grid instead of col classes */}
                <div className="template-grid1">
                    {templates.map((template) => (
                        <div key={template.id} className="template-card1 text-center">
                            <img
                                src={template.img}
                                alt={template.title}
                                className="template-img1"
                            />
                            <p className="mt-2">{template.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>


        <div className="container">
  <div className="file-container">
    {/* Header */}
    <div className="file-header">
      <div className="file-title">Today</div>

      <div className="dropdown">
        <button
          className="btn dropdown-toggle custom-dropdown-btn"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {selected}
        </button>
        <ul className="dropdown-menu custom-dropdown-menu">
          {options.map((option, index) => (
            <li key={index}>
              <button
                className={`dropdown-item ${
                  option === selected ? "active" : ""
                }`}
                onClick={() => setSelected(option)}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="file-header-center">Last opened by me</div>

      <div className="file-header-actions">
        <i className="bi bi-grid"></i>
        <i className="bi bi-sort-alpha-down"></i>
        <i className="bi bi-folder"></i>
      </div>
    </div>

    {/* File Rows */}
    {files.map((file) => (
      <div key={file.id} className="file-row">
        <div className="file-icon-wrapper">
          <img src={file.icon} alt="file-icon" className="file-icon" />
        </div>
        <div className="file-name">{file.name}</div>
        <div className="file-owner">{file.owner}</div>
        <div className="file-last-opened">{file.lastOpened}</div>

        <div className="file-actions">
          <i className="bi bi-three-dots-vertical"></i>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default TemplateGallery;
