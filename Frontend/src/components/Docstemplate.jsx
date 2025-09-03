import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import StorageIcon from "@mui/icons-material/Storage";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { IconButton, Menu, MenuItem } from "@mui/material";

import blank from "/img/blank1.png";
import docs2 from "/img/docs2.png";
import docs3 from "/img/docs3.png";
import docs4 from "/img/docs4.png";
import docs5 from "/img/docs5.png";
import docs6 from "/img/docs6.png";
import docs7 from "/img/docs7.png";

const Docstemplate = () => {
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
        navigate("/docsgallery");
    };

    return (
        <>
            <div className="tpl2-container">
                <div className="tpl2-wrapper">
                    {/* Header */}
                    <div className="tpl2-header">
                        <div className="tpl2-header-left">
                            <span className="tpl2-heading">Start a new document</span>
                        </div>
                        <div className="tpl2-header-right">
                            <div className="tpl2-gallery-btn" onClick={handleGalleryClick}>
                                Template gallery
                                <UnfoldMoreIcon />
                            </div>
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        </div>
                    </div>

                    {/* Cards Section */}
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
                                <p className="tpl2-card-title"></p>
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
                </div>
            </div>

            {/* Recent Forms Section */}
            <div className="docs-body">
                <div className="docs-top">
                    <div className="docs-top-left">Recent documents</div>
                    <div className="docs-top-right">
                        <div className="docs-top-center" onClick={handleClick}>
                            Owned by anyone{" "}
                            <ArrowDropDownIcon className="docs-dropdown-icon" />
                        </div>
                        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
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

                {/* No forms yet */}
                <div className="docs-body-content">
                    <div className="docs-card">
                        <h3>No documents yet</h3>
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

export default Docstemplate;
