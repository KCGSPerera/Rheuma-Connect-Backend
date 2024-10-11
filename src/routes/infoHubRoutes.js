const express = require("express");
const router = express.Router();
const {
  addArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
  deleteArticle,
  // filterArticles,
  // New imports from here
  addInfoArticle,
  getAllInfoArticles,
  getInfoArticleById,
  deleteInfoArticle,
  filterInfoArticles,
} = require("../controllers/infoHubCtrl");
const { authMiddleware, roleMiddleware } = require("../middleware/authMiddleware");
const uploadPdf = require("../middleware/pdfUploadMiddleware");
// const upload = require("../middleware/uploadMiddleware"); // Multer upload configuration

// // Add a new article (only doctors can add articles)
// // router.post("/add", authMiddleware, roleMiddleware(["doctor"]), upload.single("doc"), addArticle);
// router.post("/add", authMiddleware, roleMiddleware(["doctor"]), uploadPdf.single("doc"), addArticle);

// // Get all articles
// router.get("/all", authMiddleware, getAllArticles);

// // Get one article by ID
// router.get("/:id", authMiddleware, getOneArticle);

// // Update an article by ID
// router.put("/:id", authMiddleware, roleMiddleware(["doctor"]), uploadPdf.single("doc"), updateArticle);

// // Delete an article by ID
// router.delete("/:id", authMiddleware, roleMiddleware(["doctor"]), deleteArticle);

// // Filter articles by name or category
// router.get("/filter", authMiddleware, filterArticles);




// =================================================

// From here new infoHubArticle routes are available

// =================================================

// Add a new article
router.post("/add", addInfoArticle);

// Get all articles
router.get("/all", getAllInfoArticles);

// Get an article by ID
router.get("/:id", getInfoArticleById);

// Delete an article by ID
router.delete("/:id", deleteInfoArticle);

// Filter articles by name, category, or doc
router.get("/filter", filterInfoArticles);






module.exports = router;
