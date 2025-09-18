const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// --- Storage for field uploads ---
const fieldStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/fields";
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// --- Storage for slide images ---
const slideStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/slides";
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// --- Storage for response files (images + videos) ---
const responseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/response";
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// --- File filter for response (only image + video allowed) ---
const responseFileFilter = (req, file, cb) => {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// --- Multer instances ---
const upload = multer({ storage: fieldStorage });
const changeSlideUpload = multer({ storage: slideStorage });
const responseUpload = multer({
  storage: responseStorage,
  fileFilter: responseFileFilter,
});

module.exports = { upload, changeSlideUpload, responseUpload };
