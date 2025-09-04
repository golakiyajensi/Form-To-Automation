import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { Link, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";

import blank from "/img/blank1.png";
import blank8 from "/img/blank8.png";
import blank2 from "/img/blank2.png";
import blank4 from "/img/blank4.png";
import blank3 from "/img/blank3.png";
import blank5 from "/img/blank5.png";

const Template = () => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleGalleryClick = () => {
        navigate("/gallery");
    };

    return (
        <>
            <div className="tpl-container">
                <div className="tpl-wrapper">
                    <div className="tpl-header">
                        <div className="tpl-header-left">
                            <span className="tpl-heading">Start a new form</span>
                        </div>
                        <div className="tpl-header-right">
                            <div
                                className="tpl-gallery-btn"
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
                    <div className="tpl-cards">
                        <Link to="/question" className="tpl-card">
                            <img src={blank} alt="no-img" className="tpl-card-img" />
                            <p className="tpl-card-title">Blank</p>
                        </Link>
                        <Link to="#" className="tpl-card">
                            <img src={blank8} alt="no-img" className="tpl-card-img" />
                            <p className="tpl-card-title">Find a Time</p>
                        </Link>
                        <Link to="/form/contact" className="tpl-card">
                            <img src={blank2} alt="no-img" className="tpl-card-img" />
                            <p className="tpl-card-title">Contact Information</p>
                        </Link>
                        <Link to="#" className="tpl-card">
                            <img src={blank4} alt="no-img" className="tpl-card-img" />
                            <p className="tpl-card-title">Job Application</p>
                        </Link>
                        <Link to="/form/rsvpform" className="tpl-card">
                            <img src={blank3} alt="no-img" className="tpl-card-img" />
                            <p className="tpl-card-title">RSVP</p>
                        </Link>
                        <Link to="#" className="tpl-card">
                            <img src={blank5} alt="no-img" className="tpl-card-img" />
                            <p className="tpl-card-title">Party Invite</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Dashboard Section */}
            <div className="dashboard">
                <div className="dashboard-header">
                    <div className="dashboard-header-left">Recent forms</div>
                    <div className="dashboard-header-right">
                        <div className="filter-dropdown" onClick={handleClick}>
                            Owned by anyone{" "}
                            <ArrowDropDownIcon className="filter-icon" />
                        </div>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Owned by anyone</MenuItem>
                            <MenuItem onClick={handleClose}>Owned by me</MenuItem>
                            <MenuItem onClick={handleClose}>Not owned by me</MenuItem>
                        </Menu>
                        <IconButton>
                            <StorageIcon />
                        </IconButton>
                        <IconButton>
                            <SortByAlphaIcon />
                        </IconButton>
                        <IconButton>
                            <FolderOpenIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="empty-state-card">
                        <h3>No forms yet</h3>
                        <p>
                            Select a blank form or choose another template above to get
                            started
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Template;
