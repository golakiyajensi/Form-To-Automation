import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom"; 

// Recently used templates
const recentTemplates = [
  { id: 1, name: "Blank presentation", img: "./img/s5.png" },
  { id: 2, name: "Your big idea", img: "./img/s1.png" },
  { id: 3, name: "Photo album", img: "./img/s2.png" },
  { id: 4, name: "Wedding", img: "./img/s6.png" },
  { id: 5, name: "Portfolio", img: "./img/s3.png" },
  { id: 6, name: "Lookbook", img: "./img/s4.png" },
];

// Personal templates
const personalTemplates = [
  { id: 1, name: "General presentation", img: "./img/s-1.png" },
  { id: 2, name: "Your big idea", img: "./img/s-2.png" },
  { id: 3, name: "Photo album", img: "./img/s-3.png" },
  { id: 4, name: "Wedding", img: "./img/s-4.png" },
  { id: 5, name: "Recipe book", img: "./img/s-5.png" },
  { id: 6, name: "Portfolio", img: "./img/s-6.png" },
  { id: 7, name: "Lookbook", img: "./img/s-7.png" },
  { id: 8, name: "Party invite", img: "./img/s-8.png" },
  { id: 9, name: "Yearbook", img: "./img/s-9.png" },
  { id: 10, name: "Recipe showcase", img: "./img/s-10.png" },
];

// Work templates
const workTemplates = [
  { id: 1, name: "Prototyping presentation", img: "./img/s-11.png" },
  { id: 2, name: "Consulting proposal", img: "./img/s-12.png" },
  { id: 3, name: "Pitch", img: "./img/s-13.png" },
  { id: 4, name: "Status report", img: "./img/s-14.png" },
  { id: 5, name: "Case study", img: "./img/s-15.png" },
  { id: 6, name: "Consulting proposal", img: "./img/s-16.png" },
  { id: 7, name: "Professional profile", img: "./img/s-17.png" },
  { id: 8, name: "Employee certificate", img: "./img/s-18.png" },
  { id: 9, name: "Project wireframes", img: "./img/s-19.png" },
];

// Education templates
const educationTemplates = [
  { id: 1, name: "Lesson plan", img: "./img/s-20.png" },
  { id: 2, name: "Book report", img: "./img/s-21.png" },
  { id: 3, name: "Field trip", img: "./img/s-22.png" },
  { id: 4, name: "Flash cards", img: "./img/s-23.png" },
  { id: 5, name: "Science project", img: "./img/s-24.png" },
  { id: 6, name: "Science fair", img: "./img/s-25.png" },
  { id: 7, name: "Student certificate", img: "./img/s-26.png" },
];

function SlideGallery() {
  const navigate = useNavigate(); 

  return (
    <div className="bg-light min-vh-100">
      {/* Custom Header with Back Button */}
      <div className="nav d-flex align-items-center p-3 bg-white shadow-sm">
        <i
          className="bi bi-arrow-left fs-5 me-3"
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)} 
        ></i>
        <h5 className="mb-0 fw-normal">Template gallery</h5>
      </div>

      <div className="container py-4">
        {/* Recently used templates */}
        <h6 className="fw-normal mb-3">Recently used templates</h6>
        <div className="row g-4 mb-5">
          {recentTemplates.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-2">
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

        {/* Personal */}
        <h6 className="fw-normal mb-3">Personal</h6>
        <div className="row g-4 mb-5">
          {personalTemplates.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="rounded border shadow-sm h-90 template-tile">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-100 rounded-top"
                  style={{ height: 180, objectFit: "cover" }}
                />
              </div>
              <div className="p-2 small text-center">{t.name}</div>
            </div>
          ))}
        </div>

        {/* Work */}
        <h6 className="fw-normal mb-3">Work</h6>
        <div className="row g-4">
          {workTemplates.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="rounded border shadow-sm h-90 template-tile">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-100 rounded-top"
                  style={{ height: 180, objectFit: "cover" }}
                />
              </div>
              <div className="p-2 small text-center">{t.name}</div>
            </div>
          ))}
        </div>

        {/* Education */}
        <h6 className="fw-normal mb-3">Education</h6>
        <div className="row g-4">
          {educationTemplates.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="rounded border shadow-sm h-90 template-tile">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-100 rounded-top"
                  style={{ height: 180, objectFit: "cover" }}
                />
              </div>
              <div className="p-2 small text-center">{t.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlideGallery;
