// middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Filename format
  },
});


// multer photo upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
}).single("photo"); // Expecting a field called 'photo' in the form

module.exports = upload;
