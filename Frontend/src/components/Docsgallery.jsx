import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import blank from "/img/blank1.png";
import docs2 from "/img/docs2.png";
import docs3 from "/img/docs3.png";
import docs4 from "/img/docs4.png";
import docs5 from "/img/docs5.png";
import docs6 from "/img/docs6.png";
import docs7 from "/img/docs7.png";
// resume
import resume1 from "/img/resume1.png";
import resume2 from "/img/resume2.png";
import resume3 from "/img/resume3.png";
import resume4 from "/img/resume4.png";
import resume5 from "/img/resume5.png";
// letter 
import letter1 from "/img/letter1.png";
import letter2 from "/img/letter2.png";
import letter3 from "/img/letter3.png";
import letter4 from "/img/letter4.png";
import letter5 from "/img/letter5.png";


const Docsgallery = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="gal-header-wrap">
                <h2 className="gal-heading">
                    <ArrowBackIcon
                        className="gal-back-icon"
                        onClick={() => navigate("/docstemplate")}
                    />
                    Template gallery
                </h2>
            </div>

            <div className="gal-container">
                <h3 className="gal-section12">Recently used templates</h3>
                <div className="tpl2-cards">
                    <div className="tpl2-card">
                        <img src={blank} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Blank</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={docs2} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Find a Time</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={docs3} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Contact Information</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={docs4} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Job Application</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={docs5} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">RSVP</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={docs6} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Party Invite</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={docs7} alt="no-img" className="tpl2-card-img" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Party Invite</p>
                        </div>
                    </div>
                </div>
                <h3 className="gal-section12">Resume</h3>
                <div className="tpl2-cards-2">
                    <div className="tpl2-card">
                        <img src={resume1} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Blank</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={resume2} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Find a Time</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={resume3} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Contact Information</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={resume4} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Job Application</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={resume5} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">RSVP</p>
                        </div>
                    </div>


                </div>
                <h3 className="gal-section12"> Letters</h3>
                <div className="tpl2-cards-2">
                    <div className="tpl2-card">
                        <img src={letter1} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Blank</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={letter2} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Find a Time</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={letter3} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Contact Information</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={letter4} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">Job Application</p>
                        </div>
                    </div>

                    <div className="tpl2-card">
                        <img src={letter5} alt="no-img" className="tpl2-card-img2" />
                        <div className="tpl2-card-text">
                            <p className="tpl2-card-title">RSVP</p>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default Docsgallery;
