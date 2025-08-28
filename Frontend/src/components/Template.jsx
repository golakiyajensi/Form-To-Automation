import React from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { Link, useNavigate } from "react-router-dom";
import blank from "/img/blank1.png";
import blank8 from "/img/blank8.png";
import blank2 from "/img/blank2.png";
import blank4 from "/img/blank4.png";
import blank3 from "/img/blank3.png";
import blank5 from "/img/blank5.png";
import "../css/style.css";

const Templete = () => {
    const navigate = useNavigate();

    const handleGalleryClick = () => {
        navigate("/gallery");
    };

    return (
        <div className="container">
            <div className="template-section">
                <div className="template-top">
                    <div className="template-left">
                        <span className="form-text">Start a new form</span>
                    </div>
                    <div className="template-right">
                        <div
                            className="gallery-button"
                            onClick={handleGalleryClick}
                        >
                            Template gallery
                            <UnfoldMoreIcon />
                        </div>
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="cards-grid">
                    <Link to="/form/blank" className="card">
                        <img src={blank} alt="no-img" className="card-img" />
                        <p className="card-title">Blank</p>
                    </Link>
                    <Link to="/form/party" className="card">
                        <img src={blank8} alt="no-img" className="card-img" />
                        <p className="card-title">Find a Time</p>
                    </Link>
                    <Link to="/form/contact" className="card">
                        <img src={blank2} alt="no-img" className="card-img" />
                        <p className="card-title">Contact Information</p>
                    </Link>
                    <Link to="/form/rsvp" className="card">
                        <img src={blank4} alt="no-img" className="card-img" />
                        <p className="card-title">Job Application</p>
                    </Link>
                    <Link to="/form/event" className="card">
                        <img src={blank3} alt="no-img" className="card-img" />
                        <p className="card-title">RSVP</p>
                    </Link>
                    <Link to="/form/rsvp" className="card">
                        <img src={blank5} alt="no-img" className="card-img" />
                        <p className="card-title">Party Invite</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Templete;
