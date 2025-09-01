import React from "react";
import { useNavigate } from "react-router-dom";
import Sheet1 from "../../public/img/sheet-6.png";
import Sheet2 from "../../public/img/sheet-1.png";
import Sheet3 from "../../public/img/sheet-2.png";
import Sheet4 from "../../public/img/Sheet-3.png";
import Sheet5 from "../../public/img/sheet-4.png";
import Sheet6 from "../../public/img/sheet-5.png";
import Sheet7 from "../../public/img/sheet-7.png";
import Sheet8 from "../../public/img/sheet-8.png";
import Sheet9 from "../../public/img/sheet-9.png";
import Sheet10 from "../../public/img/sheet-10.png";
import Sheet11 from "../../public/img/sheet-11.png";
import Sheet12 from "../../public/img/sheet-12.png";
import Sheet13 from "../../public/img/sheet-13.png";
import Sheet14 from "../../public/img/sheet-14.png";
import Sheet15 from "../../public/img/sheet-15.png";
import Sheet16 from "../../public/img/sheet-16.png";
import Sheet17 from "../../public/img/sheet-17.png";
import Sheet18 from "../../public/img/sheet-18.png";
import Sheet19 from "../../public/img/sheet-19.png";
import Sheet20 from "../../public/img/sheet-20.png";
import Sheet21 from "../../public/img/sheet-21.png";
import Sheet22 from "../../public/img/sheet-22.png";
import Sheet23 from "../../public/img/sheet-23.png";
import Sheet24 from "../../public/img/sheet-24.png";
import Sheet25 from "../../public/img/sheet-25.png";
import Sheet26 from "../../public/img/sheet-26.png";
import Sheet27 from "../../public/img/sheet-27.png";
import Sheet28 from "../../public/img/sheet-28.png";

const templates = [
  { id: 1, title: "Blank spreadsheet", img: Sheet1 },
  { id: 2, title: "To-do list", img: Sheet2 },
  { id: 3, title: "Annual budget", img: Sheet3 },
  { id: 4, title: "Monthly budget", img: Sheet4 },
  { id: 5, title: "Google Finance Investment Tracker", img: Sheet5 },
  { id: 6, title: "Annual Calendar", img: Sheet6 },
];

const templates1 = [
  { id: 1, title: "To-do list", img: Sheet2 },
  { id: 2, title: "Annual budget", img: Sheet3 },
  { id: 3, title: "Monthly budget", img: Sheet4 },
  { id: 4, title: "Google Finance Investment Tracker", img: Sheet5 },
  { id: 5, title: "Annual Calendar", img: Sheet6 },
  { id: 6, title: "Schedule", img: Sheet7 },
  { id: 7, title: "Travel Planner", img: Sheet8 },
  { id: 8, title: "Wedding Planner", img: Sheet9 },
  { id: 9, title: "Team Roster", img: Sheet10 },
  { id: 10, title: "Pros and cons", img: Sheet11 },
];

const templates2 = [
  { id: 1, title: "Invoice", img: Sheet12 },
  { id: 2, title: "Weekly time sheet", img: Sheet13 },
  { id: 3, title: "Annual business budget", img: Sheet14 },
  { id: 4, title: "Expense report", img: Sheet15 },
  { id: 5, title: "Purchase order", img: Sheet16 },
  { id: 6, title: "Employee shift schedule", img: Sheet17 },
  { id: 7, title: "Customer relationship managementr", img: Sheet18 },
  { id: 8, title: "Website paid traffic report", img: Sheet19 },
  { id: 9, title: "Website traffic dashboard", img: Sheet20 },
  { id: 10, title: "Analytics dashboard", img: Sheet21 },
];

const templates3 = [
  { id: 1, title: "Gantt chart", img: Sheet22 },
  { id: 2, title: "Project timeline", img: Sheet23 },
  { id: 3, title: "Project tracking", img: Sheet24 },
  { id: 4, title: "Event marketing timeline", img: Sheet25 },
];

const templates4 = [
  { id: 1, title: "Attendance", img: Sheet26 },
  { id: 2, title: "Grade book", img: Sheet27 },
  { id: 3, title: "Assignment tracker", img: Sheet28 },
];

const TemplateGallery = () => {
    const navigate = useNavigate();

  return (
    <div className="container template-gallery">
      {/* Header */}
      <div className="gallery-header">
        <i className="bi bi-arrow-left me-3" onClick={() => navigate("/sheetgallery")}></i>
        <h5>Template gallery</h5>
      </div>

      {/* Section 1 */}
      <h6 className="gallery-section">Recently used templates</h6>
      <div className="gallery-grid">
        {templates.map((t) => (
          <div key={t.id} className="template-card">
            <img src={t.img} alt={t.title} className="template-img" />
            <p className="template-title">{t.title}</p>
          </div>
        ))}
      </div>

      {/* Section 2 */}
      <h6 className="gallery-section gallery2">Personal</h6>
      <div className="gallery-grid1">
        {templates1.map((t) => (
          <div key={t.id} className="template-card">
            <img src={t.img} alt={t.title} className="template-img" />
            <p className="template-title">{t.title}</p>
          </div>
        ))}
      </div>

      {/* Section 3 */}
      <h6 className="gallery-section gallery2">Work</h6>
      <div className="gallery-grid1">
        {templates2.map((t) => (
          <div key={t.id} className="template-card">
            <img src={t.img} alt={t.title} className="template-img" />
            <p className="template-title">{t.title}</p>
          </div>
        ))}
      </div>

      {/* Section 4 */}
      <h6 className="gallery-section gallery2">Project management</h6>
      <div className="gallery-grid1">
        {templates3.map((t) => (
          <div key={t.id} className="template-card">
            <img src={t.img} alt={t.title} className="template-img" />
            <p className="template-title mb-0">{t.title}</p>
            <p className="text-muted fw-semibold mb-5">by Smartsheet</p>
          </div>
        ))}
      </div>

      {/* Section 5 */}
      <h6 className="gallery-section gallery-space">Education</h6>
      <div className="gallery-grid1">
        {templates4.map((t) => (
          <div key={t.id} className="template-card">
            <img src={t.img} alt={t.title} className="template-img" />
            <p className="template-title mb-0">{t.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateGallery;
