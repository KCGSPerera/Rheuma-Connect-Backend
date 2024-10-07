// middlewares/pdfUploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Set up Multer for PDF uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/pdfs/"); // Separate folder for PDFs
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename format
  },
});

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// Create the upload middleware using the storage and fileFilter
const uploadPdf = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10, // Limit to 10MB for PDF files
  },
});

module.exports = uploadPdf;
