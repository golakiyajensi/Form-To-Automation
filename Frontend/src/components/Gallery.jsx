import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import blank from "/img/blank1.png";
import blank8 from "/img/blank8.png";
import blank2 from "/img/blank2.png";
import blank4 from "/img/blank4.png";
import blank3 from "/img/blank3.png";
import blank5 from "/img/blank5.png";
import blank6 from "/img/blank6.png";
import blank7 from "/img/blank7.png";
import blank9 from "/img/blank9.png";
import blank10 from "/img/blank10.png";
import blank11 from "/img/blank11.png";
import blank12 from "/img/blank12.png";
import blank13 from "/img/blank13.png";
import blank14 from "/img/blank14.png";
import blank15 from "/img/blank15.png";
import blank16 from "/img/blank16.png";
import blank17 from "/img/blank17.png";
import blank18 from "/img/blank18.png";

const Gallery = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="heading-head">
                <h2 className="gallery-heading">
                    <ArrowBackIcon className="back-icon" onClick={() => navigate("/")} />
                    Template gallery
                </h2>
            </div>

            <div className="gallery-container">
                {/* recently */}
                <div className="section">
                    <h3 className="section-title">Recently used templates</h3>
                    <div className="card-grid">
                        <Link to="/form/blank" className="card">
                            <img src={blank} alt="Blank" />
                            <p>Blank form</p>
                        </Link>
                        <Link to="/form/job" className="card">
                            <img src={blank8} alt="Job" />
                            <p>Contact Information</p>
                        </Link>
                        <Link to="/form/contact" className="card">
                            <img src={blank2} alt="Contact" />
                            <p>Job Application</p>
                        </Link>
                        <Link to="/form/rsvp" className="card">
                            <img src={blank4} alt="RSVP" />
                            <p>RSVP</p>
                        </Link>
                        <Link to="/form/party" className="card">
                            <img src={blank3} alt="Party" />
                            <p>Party Invite</p>
                        </Link>
                        <Link to="/form/tshirt" className="card">
                            <img src={blank5} alt="T-Shirt" />
                            <p>T-Shirt Sign Up</p>
                        </Link>
                    </div>
                </div>

                {/* personal */}
                <div className="section">
                    <h3 className="section-title">Personal</h3>
                    <div className="card-grid">
                        <Link to="/form/contact" className="card">
                            <img src={blank2} alt="Contact" />
                            <p>Contact Information</p>
                        </Link>
                        <Link to="/form/findtime" className="card">
                            <img src={blank8} alt="Find Time" />
                            <p>Find a Time</p>
                        </Link>
                        <Link to="/form/rsvp" className="card">
                            <img src={blank3} alt="RSVP" />
                            <p>RSVP</p>
                        </Link>
                        <Link to="/form/party" className="card">
                            <img src={blank5} alt="Party" />
                            <p>Party Invite</p>
                        </Link>
                        <Link to="/form/tshirt" className="card">
                            <img src={blank6} alt="T-Shirt" />
                            <p>T-Shirt Sign Up</p>
                        </Link>
                        <Link to="/form/event" className="card">
                            <img src={blank7} alt="Event" />
                            <p>Event registration</p>
                        </Link>
                    </div>
                </div>

                {/* work */}
                <div className="section">
                    <h3 className="section-title">Work</h3>
                    <div className="card-grid">
                        <Link to="/form/contact" className="card">
                            <img src={blank9} alt="Contact" />
                            <p>Event Feedback</p>
                        </Link>
                        <Link to="/form/findtime" className="card">
                            <img src={blank10} alt="Find Time" />
                            <p>Order Form</p>
                        </Link>
                        <Link to="/form/rsvp" className="card">
                            <img src={blank4} alt="RSVP" />
                            <p>Job Application</p>
                        </Link>
                        <Link to="/form/party" className="card">
                            <img src={blank11} alt="Party" />
                            <p>Time Off Request</p>
                        </Link>
                        <Link to="/form/tshirt" className="card">
                            <img src={blank12} alt="T-Shirt" />
                            <p>Work Request</p>
                        </Link>
                        <Link to="/form/event" className="card">
                            <img src={blank13} alt="Event" />
                            <p>Customer Feedback</p>
                        </Link>
                    </div>
                </div>

                {/* education */}
                <div className="section">
                    <h3 className="section-title">Education</h3>
                    <div className="card-grid">
                        <Link to="/form/contact" className="card">
                            <img src={blank14} alt="Contact" />
                            <p>Contact Information</p>
                        </Link>
                        <Link to="/form/findtime" className="card">
                            <img src={blank15} alt="Find Time" />
                            <p>Find a Time</p>
                        </Link>
                        <Link to="/form/rsvp" className="card">
                            <img src={blank16} alt="RSVP" />
                            <p>RSVP</p>
                        </Link>
                        <Link to="/form/party" className="card">
                            <img src={blank17} alt="Party" />
                            <p>Party Invite</p>
                        </Link>
                        <Link to="/form/tshirt" className="card">
                            <img src={blank18} alt="T-Shirt" />
                            <p>T-Shirt Sign Up</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Gallery;
