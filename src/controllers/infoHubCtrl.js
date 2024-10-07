const InfoHub = require("../models/InfoHub");
const Doctor = require("../models/staff/Doctor");
const upload = require("../middleware/uploadMiddleware"); // Import the file upload middleware

// Add an article with a PDF document
const addArticle = async (req, res) => {
  try {
    const { name, category, uploadedBy } = req.body;

    // Ensure a PDF file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    // Create new article
    const newArticle = new InfoHub({
      name,
      doc: `/uploads/${req.file.filename}`, // Save the file path for the PDF
      category,
      uploadedBy,
      uploadedAt: new Date(),
    });

    const savedArticle = await newArticle.save();

    // Push the new article to the Doctor who added it
    const doctor = await Doctor.findById(uploadedBy);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.infoHub.push(savedArticle._id);
    await doctor.save();

    res.status(201).json({
      message: "Article added successfully",
      article: savedArticle,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding article", error });
  }
};

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const articles = await InfoHub.find().populate("uploadedBy", "name");
    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

// Get one article by ID
const getOneArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await InfoHub.findById(id).populate("uploadedBy", "name");
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ article });
  } catch (error) {
    res.status(500).json({ message: "Error fetching article", error });
  }
};

// Update article by ID
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const updateData = {
      name,
      category,
    };

    if (req.file) {
      updateData.doc = `/uploads/${req.file.filename}`; // Update the document if a new file is uploaded
    }

    const updatedArticle = await InfoHub.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article updated successfully", article: updatedArticle });
  } catch (error) {
    res.status(500).json({ message: "Error updating article", error });
  }
};

// Delete an article by ID
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArticle = await InfoHub.findByIdAndDelete(id);
    if (!deletedArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting article", error });
  }
};

// Filter articles by name or category
const filterArticles = async (req, res) => {
  try {
    const { searchQuery } = req.query;

    const articles = await InfoHub.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } }, // case-insensitive search by name
        { category: { $regex: searchQuery, $options: "i" } }, // case-insensitive search by category
      ],
    });

    if (articles.length === 0) {
      return res.status(404).json({ message: "No matching articles found" });
    }

    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ message: "Error filtering articles", error });
  }
};

module.exports = {
  addArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
  deleteArticle,
  filterArticles,
};
