import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";

const MainBody = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="main-body">
            <div className="mainbody-top">
                <div className="mainbody-top-left">Recent forms</div>
                <div className="mainbody-top-right">
                    <div className="main-top-center" onClick={handleClick}>
                        Owned by anyone{" "}
                        <ArrowDropDownIcon className="dropdown-icon" />
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
            <div className="mainbody-docs">
                <div className="docs-card">
                    <h3>No forms yet</h3>
                    <p>
                        Select a blank form or choose another template above to get
                        started
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MainBody;
