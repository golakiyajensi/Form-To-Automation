import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";

const recentTemplates = [
  { id: 1, name: "Blank presentation", img: "./img/s5.png" },
  { id: 2, name: "Your big idea", img: "./img/s1.png" },
  { id: 3, name: "Modern pitch", img: "./img/s2.png" },
  { id: 4, name: "Portfolio", img: "./img/s3.png" },
  { id: 5, name: "Class report", img: "./img/s4.png" },
  { id: 6, name: "Wedding", img: "./img/s6.png" },
];

const Slidetemplate = () => {
  const [showHeader] = useState(true);
  const navigate = useNavigate(); // ✅ navigation hook

  if (showHeader) {
    return (
      <div>
        <div className="container py-4">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h5 className="fw-normal">Start a new presentation</h5>
            <div>
              {/* ✅ Button navigates to /slidegallery */}
              <button
                className="btn mb-2"
                onClick={() => navigate("/slidegallery")}
              >
                Template Gallery <i className="bi bi-chevron-up"></i>
              </button>
              <i className="bi bi-three-dots-vertical ms-2"></i>
            </div>
          </div>

          <div className="row g-4 mb-5">
            {recentTemplates.map((t) => (
              <div
                key={t.id}
                className="col-12 col-sm-6 col-md-4 col-lg-2"
              >
                <div className="rounded border bg-white shadow-sm h-80 template-tile">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-100 rounded-top"
                    style={{ height: 99, objectFit: "cover" }}
                  />
                </div>
                <div className="p-2 small text-center">{t.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-3">
            {/* Left title */}
            <h6 className="fw-normal mb-0">Earlier</h6>

            {/* Right controls */}
            <div className="d-flex align-items-center gap-3">
              {/* Dropdown: Owned by anyone */}
              <div className="dropdown">
                <button
                  className="btn btn-light btn-sm dropdown-toggle"
                  type="button"
                  id="ownedDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Owned by anyone
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="ownedDropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      Owned by anyone
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Owned by me
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Not owned by me
                    </a>
                  </li>
                </ul>
              </div>

              {/* Last opened by me text */}
              <span className="small text-muted">Last opened by me</span>

              {/* Grid/List Toggle */}
              <i
                className="bi bi-grid-3x3-gap fs-6"
                style={{ cursor: "pointer" }}
              ></i>

              {/* Sort A-Z */}
              <i
                className="bi bi-sort-alpha-down fs-6"
                style={{ cursor: "pointer" }}
              ></i>

              {/* Folder */}
              <i
                className="bi bi-folder fs-6"
                style={{ cursor: "pointer" }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Slidetemplate;
